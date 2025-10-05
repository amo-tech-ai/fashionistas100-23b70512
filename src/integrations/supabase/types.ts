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
      ai_analysis_results: {
        Row: {
          ai_model: string | null
          ai_response: Json
          analysis_type: string
          confidence_score: number | null
          created_at: string | null
          designer_id: string | null
          error_message: string | null
          id: string
          input_data: Json
          processing_time_ms: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          ai_model?: string | null
          ai_response: Json
          analysis_type: string
          confidence_score?: number | null
          created_at?: string | null
          designer_id?: string | null
          error_message?: string | null
          id?: string
          input_data: Json
          processing_time_ms?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_model?: string | null
          ai_response?: Json
          analysis_type?: string
          confidence_score?: number | null
          created_at?: string | null
          designer_id?: string | null
          error_message?: string | null
          id?: string
          input_data?: Json
          processing_time_ms?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_analysis_results_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designers"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_recommendations: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          profile_id: string | null
          score: number | null
          type: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          profile_id?: string | null
          score?: number | null
          type: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          profile_id?: string | null
          score?: number | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_recommendations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          profile_id: string | null
          type: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          profile_id?: string | null
          type?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          profile_id?: string | null
          type?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_data: Json | null
          new_values: Json | null
          old_data: Json | null
          old_values: Json | null
          operation: string | null
          organization_id: string | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          new_values?: Json | null
          old_data?: Json | null
          old_values?: Json | null
          operation?: string | null
          organization_id?: string | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          new_values?: Json | null
          old_data?: Json | null
          old_values?: Json | null
          operation?: string | null
          organization_id?: string | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_tickets: {
        Row: {
          booking_id: string | null
          created_at: string | null
          event_ticket_id: string | null
          id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          event_ticket_id?: string | null
          id?: string
          quantity?: number
          unit_price: number
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          event_ticket_id?: string | null
          id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_tickets_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_tickets_event_ticket_id_fkey"
            columns: ["event_ticket_id"]
            isOneToOne: false
            referencedRelation: "event_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          profile_id: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          profile_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          profile_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_performance_analytics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
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
      email_campaigns: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          name: string
          organization_id: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          name: string
          organization_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_messages: {
        Row: {
          campaign_id: string | null
          clicked_at: string | null
          created_at: string | null
          id: string
          opened_at: string | null
          recipient_email: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          campaign_id?: string | null
          clicked_at?: string | null
          created_at?: string | null
          id?: string
          opened_at?: string | null
          recipient_email: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          campaign_id?: string | null
          clicked_at?: string | null
          created_at?: string | null
          id?: string
          opened_at?: string | null
          recipient_email?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
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
            referencedRelation: "event_performance_analytics"
            referencedColumns: ["event_id"]
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
      event_tickets: {
        Row: {
          created_at: string
          description: string | null
          event_id: string
          id: string
          name: string
          organization_id: string
          price: number
          quantity: number
          quantity_sold: number
          status: Database["public"]["Enums"]["event_ticket_status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id: string
          id?: string
          name: string
          organization_id: string
          price?: number
          quantity?: number
          quantity_sold?: number
          status?: Database["public"]["Enums"]["event_ticket_status"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string
          id?: string
          name?: string
          organization_id?: string
          price?: number
          quantity?: number
          quantity_sold?: number
          status?: Database["public"]["Enums"]["event_ticket_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_performance_analytics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tickets_org_fk"
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
          start_date: string | null
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
          start_date?: string | null
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
          start_date?: string | null
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
      models: {
        Row: {
          agency: string | null
          created_at: string | null
          hourly_rate: number | null
          id: string
          is_available: boolean | null
          measurements: Json | null
          name: string
          portfolio_url: string | null
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          agency?: string | null
          created_at?: string | null
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          measurements?: Json | null
          name: string
          portfolio_url?: string | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agency?: string | null
          created_at?: string | null
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          measurements?: Json | null
          name?: string
          portfolio_url?: string | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "models_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "models_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string | null
          profile_id: string | null
          read_at: string | null
          title: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string | null
          profile_id?: string | null
          read_at?: string | null
          title?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string | null
          profile_id?: string | null
          read_at?: string | null
          title?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      payment_audit_log: {
        Row: {
          action: string
          amount_cents: number | null
          created_at: string | null
          created_by: string | null
          id: string
          idempotency_key: string | null
          metadata: Json | null
          new_status: string | null
          old_status: string | null
          payment_id: string
          stripe_payment_intent_id: string | null
        }
        Insert: {
          action: string
          amount_cents?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json | null
          new_status?: string | null
          old_status?: string | null
          payment_id: string
          stripe_payment_intent_id?: string | null
        }
        Update: {
          action?: string
          amount_cents?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json | null
          new_status?: string | null
          old_status?: string | null
          payment_id?: string
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_audit_log_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          amount_cents: number | null
          amount_received: number | null
          booking_id: string | null
          created_at: string | null
          currency: string | null
          customer_email: string | null
          failure_reason: string | null
          id: string
          idempotency_key: string | null
          metadata: Json | null
          payment_method: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          amount_cents?: number | null
          amount_received?: number | null
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          failure_reason?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json | null
          payment_method?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          amount_cents?: number | null
          amount_received?: number | null
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          failure_reason?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json | null
          payment_method?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          clerk_id: string
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
          clerk_id: string
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
          clerk_id?: string
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
      stripe_customers: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string | null
          stripe_customer_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id?: string | null
          stripe_customer_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string | null
          stripe_customer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_customers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_customers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          id: string
          profile_id: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          profile_id?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          profile_id?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_subscriptions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_subscriptions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tavily_scraping_results: {
        Row: {
          created_at: string | null
          designer_id: string | null
          error_message: string | null
          extracted_data: Json | null
          id: string
          retry_count: number | null
          scraped_content: Json
          scraping_timestamp: string | null
          source_type: string
          source_url: string
          success: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          designer_id?: string | null
          error_message?: string | null
          extracted_data?: Json | null
          id?: string
          retry_count?: number | null
          scraped_content: Json
          scraping_timestamp?: string | null
          source_type: string
          source_url: string
          success?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          designer_id?: string | null
          error_message?: string | null
          extracted_data?: Json | null
          id?: string
          retry_count?: number | null
          scraped_content?: Json
          scraping_timestamp?: string | null
          source_type?: string
          source_url?: string
          success?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tavily_scraping_results_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designers"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          booking_ticket_id: string | null
          created_at: string | null
          event_id: string | null
          id: string
          qr_code: string | null
          quota: number
          sold_count: number
          status: string | null
          used_at: string | null
        }
        Insert: {
          booking_ticket_id?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          qr_code?: string | null
          quota?: number
          sold_count?: number
          status?: string | null
          used_at?: string | null
        }
        Update: {
          booking_ticket_id?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          qr_code?: string | null
          quota?: number
          sold_count?: number
          status?: string | null
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_booking_ticket_id_fkey"
            columns: ["booking_ticket_id"]
            isOneToOne: false
            referencedRelation: "booking_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_performance_analytics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
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
            referencedRelation: "event_performance_analytics"
            referencedColumns: ["event_id"]
          },
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
          address_city: string | null
          address_country: string | null
          address_postal_code: string | null
          address_state: string | null
          address_street: string | null
          amenities: string[] | null
          availability_calendar: Json | null
          capacity: number
          coordinates: Json | null
          created_at: string
          description: string | null
          facebook_url: string | null
          hourly_rate: number | null
          id: string
          images: string[] | null
          instagram_url: string | null
          is_active: boolean
          linkedin_url: string | null
          name: string
          organization_id: string
          owner_id: string | null
          slug: string
          tiktok_url: string | null
          updated_at: string
          venue_type: Database["public"]["Enums"]["venue_type"]
          website: string | null
          whatsapp_number: string | null
          youtube_url: string | null
        }
        Insert: {
          address: Json
          address_city?: string | null
          address_country?: string | null
          address_postal_code?: string | null
          address_state?: string | null
          address_street?: string | null
          amenities?: string[] | null
          availability_calendar?: Json | null
          capacity: number
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          facebook_url?: string | null
          hourly_rate?: number | null
          id?: string
          images?: string[] | null
          instagram_url?: string | null
          is_active?: boolean
          linkedin_url?: string | null
          name: string
          organization_id: string
          owner_id?: string | null
          slug: string
          tiktok_url?: string | null
          updated_at?: string
          venue_type?: Database["public"]["Enums"]["venue_type"]
          website?: string | null
          whatsapp_number?: string | null
          youtube_url?: string | null
        }
        Update: {
          address?: Json
          address_city?: string | null
          address_country?: string | null
          address_postal_code?: string | null
          address_state?: string | null
          address_street?: string | null
          amenities?: string[] | null
          availability_calendar?: Json | null
          capacity?: number
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          facebook_url?: string | null
          hourly_rate?: number | null
          id?: string
          images?: string[] | null
          instagram_url?: string | null
          is_active?: boolean
          linkedin_url?: string | null
          name?: string
          organization_id?: string
          owner_id?: string | null
          slug?: string
          tiktok_url?: string | null
          updated_at?: string
          venue_type?: Database["public"]["Enums"]["venue_type"]
          website?: string | null
          whatsapp_number?: string | null
          youtube_url?: string | null
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
      webhook_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          processed: boolean | null
          processed_at: string | null
          processing_error: string | null
          raw_payload: Json
          stripe_event_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          raw_payload: Json
          stripe_event_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          raw_payload?: Json
          stripe_event_id?: string
        }
        Relationships: []
      }
      whatsapp_contacts: {
        Row: {
          created_at: string | null
          id: string
          is_verified: boolean | null
          name: string | null
          phone_number: string
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string | null
          phone_number: string
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string | null
          phone_number?: string
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_contacts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_contacts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          contact_id: string | null
          content: string | null
          created_at: string | null
          delivered_at: string | null
          id: string
          message_type: string
          read_at: string | null
          sent_at: string | null
          status: string | null
        }
        Insert: {
          contact_id?: string | null
          content?: string | null
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          message_type: string
          read_at?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          contact_id?: string | null
          content?: string | null
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          message_type?: string
          read_at?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      wizard_actions: {
        Row: {
          action_name: string
          created_at: string
          duration_ms: number | null
          error_message: string | null
          id: string
          params: Json
          result: Json
          session_id: string
          stage: string
          success: boolean
        }
        Insert: {
          action_name: string
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          params?: Json
          result?: Json
          session_id: string
          stage: string
          success?: boolean
        }
        Update: {
          action_name?: string
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          params?: Json
          result?: Json
          session_id?: string
          stage?: string
          success?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "wizard_actions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "wizard_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      wizard_interactions: {
        Row: {
          ai_response: string | null
          created_at: string
          id: string
          interaction_type: string
          metadata: Json
          session_id: string
          stage: string
          user_message: string | null
        }
        Insert: {
          ai_response?: string | null
          created_at?: string
          id?: string
          interaction_type: string
          metadata?: Json
          session_id: string
          stage: string
          user_message?: string | null
        }
        Update: {
          ai_response?: string | null
          created_at?: string
          id?: string
          interaction_type?: string
          metadata?: Json
          session_id?: string
          stage?: string
          user_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wizard_interactions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "wizard_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      wizard_sessions: {
        Row: {
          completed_at: string | null
          completion_percentage: number
          created_at: string
          current_stage: string
          data: Json
          event_id: string | null
          last_activity_at: string
          session_id: string
          started_at: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number
          created_at?: string
          current_stage?: string
          data?: Json
          event_id?: string | null
          last_activity_at?: string
          session_id?: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number
          created_at?: string
          current_stage?: string
          data?: Json
          event_id?: string | null
          last_activity_at?: string
          session_id?: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wizard_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_performance_analytics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "wizard_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wizard_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wizard_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      dashboard_analytics: {
        Row: {
          day: string | null
          events_completed: number | null
          events_published: number | null
          events_upcoming: number | null
          gross_revenue_cents: number | null
          organization_id: string | null
          payments_count: number | null
          tickets_sold: number | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_metrics_realtime: {
        Row: {
          day: string | null
          events_completed: number | null
          events_published: number | null
          events_upcoming: number | null
          organization_id: string | null
          tickets_sold: number | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      event_performance_analytics: {
        Row: {
          event_id: string | null
          organization_id: string | null
          sell_through_rate_pct: number | null
          start_datetime: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          tickets_quota: number | null
          tickets_sold: number | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_analytics: {
        Row: {
          day: string | null
          event_id: string | null
          gross_revenue_cents: number | null
          organization_id: string | null
          payments_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_performance_analytics"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      rls_performance: {
        Row: {
          estimated_rows: number | null
          rls_enabled: boolean | null
          rls_forced: boolean | null
          schemaname: unknown | null
          tablename: unknown | null
        }
        Relationships: []
      }
      users: {
        Row: {
          clerk_id: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string | null
          last_name: string | null
          organization_id: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          clerk_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: never
          id?: string | null
          last_name?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          clerk_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: never
          id?: string | null
          last_name?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
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
    }
    Functions: {
      calculate_event_revenue: {
        Args: { event_uuid: string }
        Returns: number
      }
      calculate_wizard_completion: {
        Args: { p_session_id: string }
        Returns: number
      }
      can_access_org: {
        Args: { org_id: string }
        Returns: boolean
      }
      can_manage_event: {
        Args: { event_uuid: string }
        Returns: boolean
      }
      clerk_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      current_profile_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      exec_sql: {
        Args: { query: string }
        Returns: {
          result: Json
        }[]
      }
      generate_designer_content_ai: {
        Args: {
          p_content_type: string
          p_context?: Json
          p_designer_id: string
        }
        Returns: Json
      }
      get_available_venues: {
        Args: { end_time: string; org_id: string; start_time: string }
        Returns: {
          capacity: number
          hourly_rate: number
          venue_id: string
          venue_name: string
        }[]
      }
      get_dashboard_metrics: {
        Args: { p_organization_id: string }
        Returns: {
          events_total: number
          gross_revenue_cents: number
          tickets_sold: number
          upcoming_events: number
        }[]
      }
      get_event_stats: {
        Args: { event_uuid: string }
        Returns: {
          capacity_utilization: number
          confirmed_bookings: number
          total_bookings: number
          total_revenue: number
        }[]
      }
      get_user_organization_context: {
        Args: Record<PropertyKey, never>
        Returns: {
          organization_id: string
          organization_name: string
          profile_id: string
          user_id: string
          user_role: Database["public"]["Enums"]["user_role"]
        }[]
      }
      handle_checkout_session_completed: {
        Args: { payload: Json }
        Returns: undefined
      }
      handle_payment_intent_created: {
        Args: { payload: Json }
        Returns: undefined
      }
      handle_payment_intent_failed: {
        Args: { payload: Json }
        Returns: undefined
      }
      handle_payment_intent_succeeded: {
        Args: { payload: Json }
        Returns: undefined
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      is_valid_email: {
        Args: { email: string }
        Returns: boolean
      }
      is_valid_phone: {
        Args: { phone: string }
        Returns: boolean
      }
      jwt_sub: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      log_audit_event: {
        Args: {
          new_data?: Json
          old_data?: Json
          operation: string
          record_id: string
          table_name: string
        }
        Returns: undefined
      }
      log_payment_audit: {
        Args: {
          p_action: string
          p_metadata?: Json
          p_new_status?: string
          p_old_status?: string
          p_payment_id: string
        }
        Returns: string
      }
      org_id_from_jwt: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      process_designer_onboarding_ai: {
        Args: {
          p_designer_id: string
          p_instagram_handle: string
          p_portfolio_url: string
          p_website_url: string
        }
        Returns: Json
      }
      process_payment_idempotent: {
        Args: {
          p_amount_cents: number
          p_booking_id: string
          p_currency: string
          p_idempotency_key: string
          p_payment_method: string
          p_status?: string
          p_stripe_payment_intent_id: string
        }
        Returns: {
          is_duplicate: boolean
          message: string
          payment_id: string
        }[]
      }
      process_stripe_webhook: {
        Args: {
          p_event_type: string
          p_raw_payload: Json
          p_stripe_event_id: string
        }
        Returns: Json
      }
      reconcile_payment_with_stripe: {
        Args: {
          p_stripe_amount_received?: number
          p_stripe_payment_intent_id: string
          p_stripe_status: string
        }
        Returns: {
          message: string
          payment_id: string
          reconciliation_status: string
        }[]
      }
      refresh_dashboard_analytics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      requesting_org_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      retry_failed_webhooks: {
        Args: { p_max_retries?: number }
        Returns: {
          event_id: string
          event_type: string
          retry_count: number
          status: string
        }[]
      }
      safe_user_org_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      safe_user_org_id_from_jwt: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      scrape_designer_sources_tavily: {
        Args: { p_designer_id: string; p_sources: Json }
        Returns: Json
      }
      update_payment_status_safe: {
        Args: {
          p_new_status: string
          p_payment_id: string
          p_stripe_payment_intent_id?: string
        }
        Returns: {
          current_status: string
          message: string
          success: boolean
        }[]
      }
      user_org_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      user_profile_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      validate_event_dates: {
        Args: { end_time: string; start_time: string }
        Returns: boolean
      }
      validate_stripe_webhook: {
        Args: { p_payload: string; p_secret?: string; p_signature: string }
        Returns: boolean
      }
      verify_stripe_signature: {
        Args: { payload: string; secret: string; signature: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "organizer"
        | "designer"
        | "model"
        | "venue"
        | "vendor"
        | "sponsor"
        | "media"
        | "buyer"
        | "attendee"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      designer_tier: "emerging" | "established" | "luxury"
      event_status: "draft" | "published" | "cancelled" | "completed"
      event_ticket_status: "active" | "inactive" | "sold_out" | "cancelled"
      payment_status:
        | "pending"
        | "processing"
        | "succeeded"
        | "failed"
        | "cancelled"
        | "refunded"
      severity_level: "low" | "medium" | "high" | "critical"
      subscription_status: "active" | "inactive" | "cancelled" | "past_due"
      ticket_status: "issued" | "active" | "used" | "void" | "refunded"
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
      app_role: [
        "admin",
        "organizer",
        "designer",
        "model",
        "venue",
        "vendor",
        "sponsor",
        "media",
        "buyer",
        "attendee",
      ],
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      designer_tier: ["emerging", "established", "luxury"],
      event_status: ["draft", "published", "cancelled", "completed"],
      event_ticket_status: ["active", "inactive", "sold_out", "cancelled"],
      payment_status: [
        "pending",
        "processing",
        "succeeded",
        "failed",
        "cancelled",
        "refunded",
      ],
      severity_level: ["low", "medium", "high", "critical"],
      subscription_status: ["active", "inactive", "cancelled", "past_due"],
      ticket_status: ["issued", "active", "used", "void", "refunded"],
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
