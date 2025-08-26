import { supabase } from "@/integrations/supabase/client";

// Normalized Ticket model
export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  description: string | null;
  price: number; // numeric in event_tickets
  currency: string; // e.g., 'USD', 'COP'
  quantityTotal: number;
  quantitySold: number;
  quantityAvailable: number; // computed if null in DB
  tierLevel: 1 | 2 | 3; // 1=basic, 2=premium, 3=vip
  active: boolean;
}

export interface AttendeeData {
  name: string;
  email: string;
  phone?: string;
}

export interface PurchaseResult {
  registrationId: string;
  orderId: string;
  status: "pending" | "confirmed" | "failed";
}

// 5-second availability cache
const AVAILABILITY_TTL = 5000; // ms
const availabilityCache = new Map<string, { available: number; fetchedAt: number }>();

function mapTierLevel(ticketType?: string | null): 1 | 2 | 3 {
  const t = (ticketType || "").toLowerCase();
  if (t === "vip") return 3;
  if (t === "premium") return 2;
  return 1;
}

function toTicketTier(row: any): TicketTier {
  const available = row.available_quantity ?? Math.max((row.total_quantity ?? 0) - (row.sold_quantity ?? 0), 0);
  return {
    id: row.id,
    eventId: row.event_id,
    name: row.ticket_name,
    description: row.description ?? null,
    price: Number(row.price ?? 0),
    currency: row.currency ?? "USD",
    quantityTotal: row.total_quantity ?? 0,
    quantitySold: row.sold_quantity ?? 0,
    quantityAvailable: available,
    tierLevel: mapTierLevel(row.ticket_type),
    active: String(row.status || "").toLowerCase() === "active",
  };
}

export async function getEventTickets(eventId: string): Promise<{ data: TicketTier[]; error: string | null }>{
  try {
    const { data, error } = await supabase
      .from("event_tickets")
      .select("id, event_id, ticket_name, description, price, currency, total_quantity, sold_quantity, available_quantity, ticket_type, status")
      .eq("event_id", eventId)
      .eq("status", "active")
      .order("price", { ascending: true });

    if (error) return { data: [], error: error.message };
    const tiers = (data || []).map(toTicketTier);
    return { data: tiers, error: null };
  } catch (e: any) {
    return { data: [], error: e?.message || "Unknown error" };
  }
}

export async function getTicketById(ticketId: string): Promise<{ data: TicketTier | null; error: string | null }>{
  try {
    const { data, error } = await supabase
      .from("event_tickets")
      .select("id, event_id, ticket_name, description, price, currency, total_quantity, sold_quantity, available_quantity, ticket_type, status")
      .eq("id", ticketId)
      .eq("status", "active")
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    if (!data) return { data: null, error: null };
    return { data: toTicketTier(data), error: null };
  } catch (e: any) {
    return { data: null, error: e?.message || "Unknown error" };
  }
}

export async function checkAvailability(ticketId: string, quantity: number): Promise<{ ok: boolean; available: number; error?: string }>{
  if (quantity <= 0) return { ok: false, available: 0, error: "Quantity must be greater than 0" };

  const cached = availabilityCache.get(ticketId);
  const now = Date.now();
  if (cached && now - cached.fetchedAt < AVAILABILITY_TTL) {
    return { ok: cached.available >= quantity, available: cached.available, error: cached.available >= quantity ? undefined : "Not enough tickets available" };
  }

  const { data, error } = await getTicketById(ticketId);
  if (error) return { ok: false, available: 0, error };
  if (!data || !data.active) return { ok: false, available: 0, error: "Ticket not available" };

  availabilityCache.set(ticketId, { available: data.quantityAvailable, fetchedAt: now });
  const ok = data.quantityAvailable >= quantity;
  return { ok, available: data.quantityAvailable, error: ok ? undefined : "Not enough tickets available" };
}

export async function createRegistration(
  ticketId: string,
  attendee: AttendeeData,
  quantity: number
): Promise<{ data: PurchaseResult | null; error: string | null }>{
  try {
    // Require auth for RLS-protected inserts
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr) return { data: null, error: userErr.message };
    const user = userRes.user;
    if (!user) return { data: null, error: "You must be signed in to purchase." };

    // Load ticket
    const { data: ticket, error: ticketErr } = await getTicketById(ticketId);
    if (ticketErr) return { data: null, error: ticketErr };
    if (!ticket) return { data: null, error: "Ticket not found" };

    // Validate quantity against latest availability
    const availability = await checkAvailability(ticketId, quantity);
    if (!availability.ok) return { data: null, error: availability.error || "Not enough availability" };

    // Prepare order details
    const amountTotal = Math.round(ticket.price * quantity * 100) / 100; // keep as decimal (db uses numeric)

    // Insert order first (so we can safely abort without orphaning registration)
    const { data: orderInsert, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        event_id: ticket.eventId,
        total_amount: amountTotal,
        currency: ticket.currency,
        order_status: "pending",
        customer_name: attendee.name,
        customer_email: attendee.email,
        customer_phone: attendee.phone ?? null,
      })
      .select("id")
      .maybeSingle();

    if (orderErr || !orderInsert) {
      return { data: null, error: orderErr?.message || "Failed to create order" };
    }

    // Insert registration record (no quantity field in schema)
    const { data: regInsert, error: regErr } = await supabase
      .from("event_registrations")
      .insert({
        user_id: user.id,
        event_id: ticket.eventId,
        registration_type: ticket.tierLevel === 3 ? "vip" : ticket.tierLevel === 2 ? "premium" : "general",
        status: "pending",
        email_notifications: true,
      })
      .select("id")
      .maybeSingle();

    if (regErr || !regInsert) {
      // Cleanup order if registration fails to avoid orphaned order
      await supabase.from("orders").delete().eq("id", orderInsert.id);
      return { data: null, error: regErr?.message || "Failed to create registration" };
    }

    const payload: PurchaseResult = {
      registrationId: regInsert.id,
      orderId: orderInsert.id,
      status: "pending",
    };

    return { data: payload, error: null };
  } catch (e: any) {
    return { data: null, error: e?.message || "Unknown error" };
  }
}

// Optional: Create a Stripe Checkout session via Edge Function (not enabled by default)
export async function createPaymentSession(orderId: string, amountCents: number, currency: string): Promise<{ url: string | null; error: string | null }>{
  try {
    const { data, error } = await supabase.functions.invoke("create-payment", {
      body: { orderId, amountCents, currency },
    });
    if (error) return { url: null, error: (error as any).message || "Payment session error" };
    return { url: (data as any)?.url ?? null, error: null };
  } catch (e: any) {
    return { url: null, error: e?.message || "Unknown error" };
  }
}
