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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_type: string
          created_at: string
          entity_id: string
          entity_type: string | null
          id: string
          metadata: Json
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          entity_id: string
          entity_type?: string | null
          id?: string
          metadata?: Json
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          entity_id?: string
          entity_type?: string | null
          id?: string
          metadata?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      contact_forms: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          email: string
          event_id: string | null
          id: string
          inquiry_type: Database["public"]["Enums"]["inquiry_type"]
          message: string
          name: string
          phone: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          email: string
          event_id?: string | null
          id?: string
          inquiry_type?: Database["public"]["Enums"]["inquiry_type"]
          message: string
          name: string
          phone?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          email?: string
          event_id?: string | null
          id?: string
          inquiry_type?: Database["public"]["Enums"]["inquiry_type"]
          message?: string
          name?: string
          phone?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_forms_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_forms_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_forms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string | null
          display_order: number | null
          event_id: string
          id: string
          image_type: string | null
          image_url: string
          is_active: boolean | null
          photographer_credit: string | null
          updated_at: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          event_id: string
          id?: string
          image_type?: string | null
          image_url: string
          is_active?: boolean | null
          photographer_credit?: string | null
          updated_at?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          event_id?: string
          id?: string
          image_type?: string | null
          image_url?: string
          is_active?: boolean | null
          photographer_credit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_images_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          checked_in: boolean | null
          checked_in_at: string | null
          created_at: string | null
          email_notifications: boolean | null
          event_id: string
          id: string
          registration_type: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          checked_in?: boolean | null
          checked_in_at?: string | null
          created_at?: string | null
          email_notifications?: boolean | null
          event_id: string
          id?: string
          registration_type?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          checked_in?: boolean | null
          checked_in_at?: string | null
          created_at?: string | null
          email_notifications?: boolean | null
          event_id?: string
          id?: string
          registration_type?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          end_datetime: string
          event_name: string
          id: string
          organizer_id: string
          start_datetime: string
          status: string | null
          updated_at: string | null
          venue_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_datetime: string
          event_name: string
          id?: string
          organizer_id: string
          start_datetime: string
          status?: string | null
          updated_at?: string | null
          venue_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_datetime?: string
          event_name?: string
          id?: string
          organizer_id?: string
          start_datetime?: string
          status?: string | null
          updated_at?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      notifications: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          is_read: boolean | null
          message: string
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          read_at?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          event_id: string
          id: string
          order_status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          event_id: string
          id?: string
          order_status?: string
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          event_id?: string
          id?: string
          order_status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean
          phone: string | null
          profile_visibility: Database["public"]["Enums"]["profile_visibility"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          phone?: string | null
          profile_visibility?: Database["public"]["Enums"]["profile_visibility"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          profile_visibility?: Database["public"]["Enums"]["profile_visibility"]
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          is_published: boolean | null
          rating: number
          review_text: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          is_published?: boolean | null
          rating: number
          review_text?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          is_published?: boolean | null
          rating?: number
          review_text?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          prefs: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          prefs?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          prefs?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          device: string | null
          expires_at: string
          id: string
          ip_address: string | null
          last_activity: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device?: string | null
          expires_at: string
          id?: string
          ip_address?: string | null
          last_activity?: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          last_activity?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          accessibility_features: string[] | null
          address: string
          amenities: string[] | null
          city: string
          country: string | null
          created_at: string | null
          description: string | null
          email: string | null
          gallery_images: string[] | null
          hero_image_url: string | null
          id: string
          is_featured: boolean | null
          max_capacity: number
          phone: string | null
          postal_code: string | null
          slug: string
          status: string | null
          updated_at: string | null
          venue_name: string
          venue_type: string | null
          website: string | null
        }
        Insert: {
          accessibility_features?: string[] | null
          address: string
          amenities?: string[] | null
          city: string
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          gallery_images?: string[] | null
          hero_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          max_capacity: number
          phone?: string | null
          postal_code?: string | null
          slug: string
          status?: string | null
          updated_at?: string | null
          venue_name: string
          venue_type?: string | null
          website?: string | null
        }
        Update: {
          accessibility_features?: string[] | null
          address?: string
          amenities?: string[] | null
          city?: string
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          gallery_images?: string[] | null
          hero_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          max_capacity?: number
          phone?: string | null
          postal_code?: string | null
          slug?: string
          status?: string | null
          updated_at?: string | null
          venue_name?: string
          venue_type?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_event_metrics: {
        Args: { event_uuid: string; target_date?: string }
        Returns: Json
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_old_activity_logs: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "organizer" | "attendee" | "sponsor" | "vendor"
      inquiry_type:
        | "general"
        | "event_inquiry"
        | "partnership"
        | "media"
        | "technical_support"
        | "billing"
        | "feedback"
      notification_type:
        | "event_reminder"
        | "registration_confirmed"
        | "event_cancelled"
        | "application_status"
        | "new_message"
        | "system_update"
      profile_visibility: "public" | "private"
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
      app_role: ["admin", "organizer", "attendee", "sponsor", "vendor"],
      inquiry_type: [
        "general",
        "event_inquiry",
        "partnership",
        "media",
        "technical_support",
        "billing",
        "feedback",
      ],
      notification_type: [
        "event_reminder",
        "registration_confirmed",
        "event_cancelled",
        "application_status",
        "new_message",
        "system_update",
      ],
      profile_visibility: ["public", "private"],
    },
  },
} as const
