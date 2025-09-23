export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      designer_profiles: {
        Row: {
          achievements: string[] | null
          certifications: string[] | null
          collections: Json | null
          created_at: string
          designer_id: string
          id: string
          lead_time_days: number | null
          minimum_order_quantity: number | null
          preferred_materials: string[] | null
          press_mentions: Json | null
          showcase_images: string[] | null
          size_ranges: string[] | null
          updated_at: string
        }
        Insert: {
          achievements?: string[] | null
          certifications?: string[] | null
          collections?: Json | null
          created_at?: string
          designer_id: string
          id?: string
          lead_time_days?: number | null
          minimum_order_quantity?: number | null
          preferred_materials?: string[] | null
          press_mentions?: Json | null
          showcase_images?: string[] | null
          size_ranges?: string[] | null
          updated_at?: string
        }
        Update: {
          achievements?: string[] | null
          certifications?: string[] | null
          collections?: Json | null
          created_at?: string
          designer_id?: string
          id?: string
          lead_time_days?: number | null
          minimum_order_quantity?: number | null
          preferred_materials?: string[] | null
          press_mentions?: Json | null
          showcase_images?: string[] | null
          size_ranges?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "designer_profiles_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: true
            referencedRelation: "designers"
            referencedColumns: ["id"]
          },
        ]
      }
      designers: {
        Row: {
          bio: string | null
          brand_name: string
          created_at: string
          hourly_rate: number | null
          id: string
          instagram_handle: string | null
          is_available: boolean
          is_verified: boolean
          organization_id: string
          portfolio_url: string | null
          profile_id: string | null
          slug: string
          style_categories: string[] | null
          tier: Database["public"]["Enums"]["designer_tier"]
          updated_at: string
          website_url: string | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          brand_name: string
          created_at?: string
          hourly_rate?: number | null
          id?: string
          instagram_handle?: string | null
          is_available?: boolean
          is_verified?: boolean
          organization_id: string
          portfolio_url?: string | null
          profile_id?: string | null
          slug: string
          style_categories?: string[] | null
          tier?: Database["public"]["Enums"]["designer_tier"]
          updated_at?: string
          website_url?: string | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          brand_name?: string
          created_at?: string
          hourly_rate?: number | null
          id?: string
          instagram_handle?: string | null
          is_available?: boolean
          is_verified?: boolean
          organization_id?: string
          portfolio_url?: string | null
          profile_id?: string | null
          slug?: string
          style_categories?: string[] | null
          tier?: Database["public"]["Enums"]["designer_tier"]
          updated_at?: string
          website_url?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "designers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_bookings: {
        Row: {
          attendee_id: string
          booking_reference: string
          created_at: string
          event_id: string
          id: string
          organization_id: string
          payment_intent_id: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"]
          ticket_quantity: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          attendee_id: string
          booking_reference: string
          created_at?: string
          event_id: string
          id?: string
          organization_id: string
          payment_intent_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          ticket_quantity?: number
          total_amount: number
          updated_at?: string
        }
        Update: {
          attendee_id?: string
          booking_reference?: string
          created_at?: string
          event_id?: string
          id?: string
          organization_id?: string
          payment_intent_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          ticket_quantity?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_bookings_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_bookings_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string
          currency: string | null
          description: string | null
          end_datetime: string
          id: string
          images: string[] | null
          is_featured: boolean
          metadata: Json | null
          organization_id: string
          organizer_id: string
          slug: string
          start_datetime: string
          status: Database["public"]["Enums"]["event_status"]
          tags: string[] | null
          ticket_price: number | null
          title: string
          updated_at: string
          venue_id: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          end_datetime: string
          id?: string
          images?: string[] | null
          is_featured?: boolean
          metadata?: Json | null
          organization_id: string
          organizer_id: string
          slug: string
          start_datetime: string
          status?: Database["public"]["Enums"]["event_status"]
          tags?: string[] | null
          ticket_price?: number | null
          title: string
          updated_at?: string
          venue_id?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          end_datetime?: string
          id?: string
          images?: string[] | null
          is_featured?: boolean
          metadata?: Json | null
          organization_id?: string
          organizer_id?: string
          slug?: string
          start_datetime?: string
          status?: Database["public"]["Enums"]["event_status"]
          tags?: string[] | null
          ticket_price?: number | null
          title?: string
          updated_at?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          max_events: number | null
          max_users: number | null
          name: string
          slug: string
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          max_events?: number | null
          max_users?: number | null
          name: string
          slug: string
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          max_events?: number | null
          max_users?: number | null
          name?: string
          slug?: string
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          organization_id: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_bookings: {
        Row: {
          booking_date: string
          created_at: string
          end_time: string
          event_id: string | null
          id: string
          organization_id: string
          organizer_id: string
          special_requirements: string | null
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          updated_at: string
          venue_id: string
        }
        Insert: {
          booking_date: string
          created_at?: string
          end_time: string
          event_id?: string | null
          id?: string
          organization_id: string
          organizer_id: string
          special_requirements?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          updated_at?: string
          venue_id: string
        }
        Update: {
          booking_date?: string
          created_at?: string
          end_time?: string
          event_id?: string | null
          id?: string
          organization_id?: string
          organizer_id?: string
          special_requirements?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount?: number
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_bookings_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_bookings_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_bookings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: Json
          amenities: string[] | null
          availability_calendar: Json | null
          capacity: number
          coordinates: Json | null
          created_at: string
          description: string | null
          hourly_rate: number | null
          id: string
          images: string[] | null
          is_active: boolean
          name: string
          organization_id: string
          owner_id: string | null
          slug: string
          updated_at: string
          venue_type: Database["public"]["Enums"]["venue_type"]
        }
        Insert: {
          address: Json
          amenities?: string[] | null
          availability_calendar?: Json | null
          capacity: number
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          hourly_rate?: number | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          name: string
          organization_id: string
          owner_id?: string | null
          slug: string
          updated_at?: string
          venue_type?: Database["public"]["Enums"]["venue_type"]
        }
        Update: {
          address?: Json
          amenities?: string[] | null
          availability_calendar?: Json | null
          capacity?: number
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          hourly_rate?: number | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          name?: string
          organization_id?: string
          owner_id?: string | null
          slug?: string
          updated_at?: string
          venue_type?: Database["public"]["Enums"]["venue_type"]
        }
        Relationships: [
          {
            foreignKeyName: "venues_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venues_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venues_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      requesting_org_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      designer_tier: "emerging" | "established" | "luxury"
      event_status: "draft" | "published" | "cancelled" | "completed"
      subscription_status: "active" | "inactive" | "cancelled" | "past_due"
      user_role:
        | "admin"
        | "organizer"
        | "designer"
        | "venue_owner"
        | "sponsor"
        | "attendee"
      venue_type: "indoor" | "outdoor" | "hybrid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      designer_tier: ["emerging", "established", "luxury"],
      event_status: ["draft", "published", "cancelled", "completed"],
      subscription_status: ["active", "inactive", "cancelled", "past_due"],
      user_role: [
        "admin",
        "organizer",
        "designer",
        "venue_owner",
        "sponsor",
        "attendee",
      ],
      venue_type: ["indoor", "outdoor", "hybrid"],
    },
  },
} as const
