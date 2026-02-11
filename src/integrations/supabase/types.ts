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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      affiliate_clicks: {
        Row: {
          category_id: string | null
          clicked_at: string
          guest_id: string | null
          id: string
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          category_id?: string | null
          clicked_at?: string
          guest_id?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          category_id?: string | null
          clicked_at?: string
          guest_id?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "affiliate_clicks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_links: {
        Row: {
          affiliate_url: string
          created_at: string
          id: string
          is_primary: boolean
          platform: string
          product_id: string
          updated_at: string
        }
        Insert: {
          affiliate_url: string
          created_at?: string
          id?: string
          is_primary?: boolean
          platform: string
          product_id: string
          updated_at?: string
        }
        Update: {
          affiliate_url?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          platform?: string
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          category_id: string
          category_name: string
          created_at: string
          icon_optional: string | null
          is_enabled: boolean
          priority_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          category_name: string
          created_at?: string
          icon_optional?: string | null
          is_enabled?: boolean
          priority_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          category_name?: string
          created_at?: string
          icon_optional?: string | null
          is_enabled?: boolean
          priority_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      deal_notifications: {
        Row: {
          deal_score: number
          deep_link: string | null
          id: string
          notification_body: string
          notification_title: string
          product_id: string
          sent_at: string
          trigger_reason: string
          user_id: string
        }
        Insert: {
          deal_score: number
          deep_link?: string | null
          id?: string
          notification_body: string
          notification_title: string
          product_id: string
          sent_at?: string
          trigger_reason: string
          user_id: string
        }
        Update: {
          deal_score?: number
          deep_link?: string | null
          id?: string
          notification_body?: string
          notification_title?: string
          product_id?: string
          sent_at?: string
          trigger_reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_notifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      price_snapshots: {
        Row: {
          deal_score: number
          id: string
          price: number
          product_id: string
          snapshot_at: string
        }
        Insert: {
          deal_score?: number
          id?: string
          price: number
          product_id: string
          snapshot_at?: string
        }
        Update: {
          deal_score?: number
          id?: string
          price?: number
          product_id?: string
          snapshot_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_snapshots_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          ai_status: string | null
          ai_status_override: boolean
          category_id: string | null
          created_at: string
          current_price: number
          id: string
          image_url: string | null
          is_enabled: boolean
          is_featured: boolean
          is_todays_best_drop: boolean
          name: string
          original_price: number | null
          price_drop: number | null
          updated_at: string
        }
        Insert: {
          ai_status?: string | null
          ai_status_override?: boolean
          category_id?: string | null
          created_at?: string
          current_price?: number
          id?: string
          image_url?: string | null
          is_enabled?: boolean
          is_featured?: boolean
          is_todays_best_drop?: boolean
          name: string
          original_price?: number | null
          price_drop?: number | null
          updated_at?: string
        }
        Update: {
          ai_status?: string | null
          ai_status_override?: boolean
          category_id?: string | null
          created_at?: string
          current_price?: number
          id?: string
          image_url?: string | null
          is_enabled?: boolean
          is_featured?: boolean
          is_todays_best_drop?: boolean
          name?: string
          original_price?: number | null
          price_drop?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          guest_id: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          guest_id?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          guest_id?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_watchlist: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          is_active: boolean
          product_id: string | null
          target_price: number | null
          user_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          product_id?: string | null
          target_price?: number | null
          user_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          product_id?: string | null
          target_price?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_watchlist_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "user_watchlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
