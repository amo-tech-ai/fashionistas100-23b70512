import { supabase } from "@/integrations/supabase/client";
import { sampleEvents } from "@/data/sampleEvents";

// Normalized Event model for the app (computed fields included)
export interface EventSummary {
  id: string;
  title: string;
  description: string | null;
  status: string;
  startISO: string; // events.start_datetime
  endISO: string | null; // events.end_datetime
  slug: string; // computed from title + id
  venue: {
    id: string | null;
    name: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    slug: string | null;
  };
  heroImage: string | null;
  galleryImages: string[];
  capacity: number | null; // sum of ticket total_quantity
  ticketsSold: number; // sum of sold_quantity
  available: number; // sum of available_quantity (if null, compute total - sold)
  priceMin: number | null;
  priceMax: number | null;
  currency: string | null; // dominant currency among tickets
}

// Helpers
const toSlug = (title: string, id: string) => {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base}-${id.slice(0, 8)}`;
};

const dominantCurrency = (currencies: string[]): string | null => {
  if (!currencies.length) return null;
  const counts = new Map<string, number>();
  for (const c of currencies) counts.set(c, (counts.get(c) || 0) + 1);
  let best: string | null = null;
  let max = 0;
  for (const [c, n] of counts) {
    if (n > max) {
      best = c;
      max = n;
    }
  }
  return best;
};

// Mock data converter for development fallback
const getMockEvents = (options?: { limit?: number; city?: string; fromDateISO?: string }): EventSummary[] => {
  let events = sampleEvents.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    status: "published",
    startISO: `${event.date}T${event.time}:00.000Z`,
    endISO: null,
    slug: toSlug(event.title, event.id),
    venue: {
      id: `venue-${event.id}`,
      name: event.venue,
      address: null,
      city: event.city,
      country: null,
      slug: null,
    },
    heroImage: event.image.replace('/src/assets/', '/src/assets/'),
    galleryImages: [],
    capacity: 500,
    ticketsSold: Math.floor(Math.random() * 200),
    available: 300,
    priceMin: event.price.general,
    priceMax: event.price.platinum,
    currency: "USD",
  }));

  // Apply filters
  if (options?.city) {
    events = events.filter(e => e.venue.city?.toLowerCase() === options.city!.toLowerCase());
  }
  
  if (options?.fromDateISO) {
    events = events.filter(e => e.startISO >= options.fromDateISO!);
  }
  
  if (options?.limit) {
    events = events.slice(0, options.limit);
  }

  return events;
};

// Core fetcher: list published events with related data and computed fields
export async function listPublishedEvents(options?: {
  limit?: number;
  city?: string; // filter by venue city
  fromDateISO?: string; // only events with start_datetime >= this date
}): Promise<{ data: EventSummary[]; error: string | null }> {
  try {
    // 1) Fetch published events (lightweight)
    let query = supabase
      .from("events")
      .select("id, event_name, description, status, start_datetime, end_datetime, venue_id")
      .eq("status", "published")
      .order("start_datetime", { ascending: true });

    if (options?.fromDateISO) {
      query = query.gte("start_datetime", options.fromDateISO);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data: events, error: eventsErr } = await query;
    if (eventsErr) return { data: [], error: eventsErr.message };
    
    // 🚨 FALLBACK: If no events in database, return mock data for development
    if (!events || events.length === 0) {
      console.warn("No events found in database, using mock data for development");
      return { data: getMockEvents(options), error: null };
    }

    const eventIds = events.map((e) => e.id);
    const venueIds = events.map((e) => e.venue_id).filter(Boolean) as string[];

    // 2) Batch related fetches in parallel
    const [ticketsRes, imagesRes, venuesRes] = await Promise.all([
      supabase
        .from("event_tickets")
        .select("event_id, price, currency, total_quantity, sold_quantity, available_quantity, status")
        .in("event_id", eventIds)
        .eq("status", "active"),
      supabase
        .from("event_images")
        .select("event_id, image_url, image_type, display_order, is_active")
        .in("event_id", eventIds)
        .eq("is_active", true),
      venueIds.length
        ? supabase
            .from("venues")
            .select("id, venue_name, address, city, country, slug, status")
            .in("id", venueIds)
            .eq("status", "active")
        : Promise.resolve({ data: [], error: null } as any),
    ]);

    if (ticketsRes.error) return { data: [], error: ticketsRes.error.message };
    if (imagesRes.error) return { data: [], error: imagesRes.error.message };
    if (venuesRes.error) return { data: [], error: venuesRes.error.message };

    // Optional city filter (client-side via venues, if requested)
    const venuesById = new Map<string, any>();
    for (const v of venuesRes.data || []) venuesById.set(v.id, v);

    const ticketsByEvent = new Map<string, any[]>();
    for (const t of ticketsRes.data || []) {
      const list = ticketsByEvent.get(t.event_id) || [];
      list.push(t);
      ticketsByEvent.set(t.event_id, list);
    }

    const imagesByEvent = new Map<string, any[]>();
    for (const im of imagesRes.data || []) {
      const list = imagesByEvent.get(im.event_id) || [];
      list.push(im);
      imagesByEvent.set(im.event_id, list);
    }

    let result: EventSummary[] = events.map((e) => {
      const venue = e.venue_id ? venuesById.get(e.venue_id) : null;
      const evTickets = ticketsByEvent.get(e.id) || [];
      const evImages = (imagesByEvent.get(e.id) || []).sort(
        (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
      );

      const prices = evTickets.map((t) => Number(t.price)).filter((n) => !Number.isNaN(n));
      const currencies = evTickets.map((t) => t.currency).filter(Boolean) as string[];
      const totalQty = evTickets.reduce((sum, t) => sum + (t.total_quantity ?? 0), 0);
      const soldQty = evTickets.reduce((sum, t) => sum + (t.sold_quantity ?? 0), 0);
      const availableQty = evTickets.reduce((sum, t) => {
        const avail = t.available_quantity ?? Math.max((t.total_quantity ?? 0) - (t.sold_quantity ?? 0), 0);
        return sum + avail;
      }, 0);

      const hero = evImages.find((i) => i.image_type === "hero")?.image_url ?? evImages[0]?.image_url ?? null;
      const gallery = evImages
        .filter((i) => i.image_type !== "hero")
        .map((i) => i.image_url);

      const title = e.event_name as string;

      const eventSummary: EventSummary = {
        id: e.id,
        title,
        description: (e as any).description ?? null,
        status: (e as any).status ?? "draft",
        startISO: (e as any).start_datetime,
        endISO: (e as any).end_datetime ?? null,
        slug: toSlug(title, e.id),
        venue: {
          id: venue?.id ?? null,
          name: venue?.venue_name ?? null,
          address: venue?.address ?? null,
          city: venue?.city ?? null,
          country: venue?.country ?? null,
          slug: venue?.slug ?? null,
        },
        heroImage: hero,
        galleryImages: gallery,
        capacity: totalQty || null,
        ticketsSold: soldQty,
        available: availableQty,
        priceMin: prices.length ? Math.min(...prices) : null,
        priceMax: prices.length ? Math.max(...prices) : null,
        currency: dominantCurrency(currencies),
      };

      return eventSummary;
    });

    if (options?.city) {
      result = result.filter((r) => (r.venue.city || "").toLowerCase() === options.city!.toLowerCase());
    }

    return { data: result, error: null };
  } catch (e: any) {
    return { data: [], error: e?.message || "Unknown error" };
  }
}

// Fetch a single event by id with related data and computed fields
export async function getEventById(eventId: string): Promise<{ data: EventSummary | null; error: string | null }> {
  try {
    const { data: e, error: evErr } = await supabase
      .from("events")
      .select("id, event_name, description, status, start_datetime, end_datetime, venue_id")
      .eq("id", eventId)
      .maybeSingle();
    if (evErr) return { data: null, error: evErr.message };
    
    // 🚨 FALLBACK: If event not found in database, check mock data
    if (!e) {
      console.warn(`Event ${eventId} not found in database, checking mock data`);
      const mockEvents = getMockEvents();
      const mockEvent = mockEvents.find(event => event.id === eventId);
      return { data: mockEvent || null, error: null };
    }

    const [ticketsRes, imagesRes, venueRes] = await Promise.all([
      supabase
        .from("event_tickets")
        .select("event_id, price, currency, total_quantity, sold_quantity, available_quantity, status")
        .eq("event_id", e.id)
        .eq("status", "active"),
      supabase
        .from("event_images")
        .select("event_id, image_url, image_type, display_order, is_active")
        .eq("event_id", e.id)
        .eq("is_active", true),
      e.venue_id
        ? supabase
            .from("venues")
            .select("id, venue_name, address, city, country, slug, status")
            .eq("id", e.venue_id)
            .eq("status", "active")
            .maybeSingle()
        : Promise.resolve({ data: null, error: null } as any),
    ]);

    if (ticketsRes.error) return { data: null, error: ticketsRes.error.message };
    if (imagesRes.error) return { data: null, error: imagesRes.error.message };
    if (venueRes.error) return { data: null, error: venueRes.error.message };

    const evTickets = ticketsRes.data || [];
    const evImages = (imagesRes.data || []).sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );

    const prices = evTickets.map((t) => Number(t.price)).filter((n) => !Number.isNaN(n));
    const currencies = evTickets.map((t) => t.currency).filter(Boolean) as string[];
    const totalQty = evTickets.reduce((sum, t) => sum + (t.total_quantity ?? 0), 0);
    const soldQty = evTickets.reduce((sum, t) => sum + (t.sold_quantity ?? 0), 0);
    const availableQty = evTickets.reduce((sum, t) => {
      const avail = t.available_quantity ?? Math.max((t.total_quantity ?? 0) - (t.sold_quantity ?? 0), 0);
      return sum + avail;
    }, 0);

    const hero = evImages.find((i) => i.image_type === "hero")?.image_url ?? evImages[0]?.image_url ?? null;
    const gallery = evImages
      .filter((i) => i.image_type !== "hero")
      .map((i) => i.image_url);

    const title = e.event_name as string;

    const eventSummary: EventSummary = {
      id: e.id,
      title,
      description: (e as any).description ?? null,
      status: (e as any).status ?? "draft",
      startISO: (e as any).start_datetime,
      endISO: (e as any).end_datetime ?? null,
      slug: toSlug(title, e.id),
      venue: {
        id: (venueRes.data as any)?.id ?? null,
        name: (venueRes.data as any)?.venue_name ?? null,
        address: (venueRes.data as any)?.address ?? null,
        city: (venueRes.data as any)?.city ?? null,
        country: (venueRes.data as any)?.country ?? null,
        slug: (venueRes.data as any)?.slug ?? null,
      },
      heroImage: hero,
      galleryImages: gallery,
      capacity: totalQty || null,
      ticketsSold: soldQty,
      available: availableQty,
      priceMin: prices.length ? Math.min(...prices) : null,
      priceMax: prices.length ? Math.max(...prices) : null,
      currency: dominantCurrency(currencies),
    };

    return { data: eventSummary, error: null };
  } catch (e: any) {
    return { data: null, error: e?.message || "Unknown error" };
  }
}
