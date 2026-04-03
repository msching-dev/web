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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          auth_id: string | null
          created_at: string | null
          default_address: string | null
          default_shipping_method:
            | Database["public"]["Enums"]["shipping_method"]
            | null
          email: string
          id: string
          name: string
          note: string | null
          phone: string
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          default_address?: string | null
          default_shipping_method?:
            | Database["public"]["Enums"]["shipping_method"]
            | null
          email: string
          id?: string
          name: string
          note?: string | null
          phone: string
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          default_address?: string | null
          default_shipping_method?:
            | Database["public"]["Enums"]["shipping_method"]
            | null
          email?: string
          id?: string
          name?: string
          note?: string | null
          phone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_price: number
          quantity: number
          subtotal: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_price: number
          quantity: number
          subtotal: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_price?: number
          quantity?: number
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_note: string | null
          created_at: string | null
          customer_id: string
          customer_note: string | null
          ecpay_merchant_trade_no: string | null
          ecpay_trade_no: string | null
          id: string
          order_number: string
          paid_at: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          shipped_at: string | null
          shipping_address: string | null
          shipping_fee: number | null
          shipping_method: Database["public"]["Enums"]["shipping_method"]
          shipping_name: string
          shipping_phone: string
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          total_amount: number
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          admin_note?: string | null
          created_at?: string | null
          customer_id: string
          customer_note?: string | null
          ecpay_merchant_trade_no?: string | null
          ecpay_trade_no?: string | null
          id?: string
          order_number: string
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_fee?: number | null
          shipping_method: Database["public"]["Enums"]["shipping_method"]
          shipping_name: string
          shipping_phone: string
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          total_amount: number
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_note?: string | null
          created_at?: string | null
          customer_id?: string
          customer_note?: string | null
          ecpay_merchant_trade_no?: string | null
          ecpay_trade_no?: string | null
          id?: string
          order_number?: string
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_fee?: number | null
          shipping_method?: Database["public"]["Enums"]["shipping_method"]
          shipping_name?: string
          shipping_phone?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          alias: string | null
          allergens: string | null
          category_id: string | null
          compare_price: number | null
          created_at: string | null
          description: string | null
          detail: Json | null
          id: string
          images: Json | null
          include_size: string | null
          is_active: boolean | null
          is_featured: boolean | null
          max_order_qty: number | null
          min_order_qty: number | null
          name: string
          nutrition: Json | null
          portion_size: number | null
          price: number
          shelf_life: string | null
          slug: string
          sort_order: number | null
          specifications: Json | null
          stock_quantity: number | null
          storage_instructions: string | null
          tags: string[] | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          alias?: string | null
          allergens?: string | null
          category_id?: string | null
          compare_price?: number | null
          created_at?: string | null
          description?: string | null
          detail?: Json | null
          id?: string
          images?: Json | null
          include_size?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          max_order_qty?: number | null
          min_order_qty?: number | null
          name: string
          nutrition?: Json | null
          portion_size?: number | null
          price: number
          shelf_life?: string | null
          slug: string
          sort_order?: number | null
          specifications?: Json | null
          stock_quantity?: number | null
          storage_instructions?: string | null
          tags?: string[] | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          alias?: string | null
          allergens?: string | null
          category_id?: string | null
          compare_price?: number | null
          created_at?: string | null
          description?: string | null
          detail?: Json | null
          id?: string
          images?: Json | null
          include_size?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          max_order_qty?: number | null
          min_order_qty?: number | null
          name?: string
          nutrition?: Json | null
          portion_size?: number | null
          price?: number
          shelf_life?: string | null
          slug?: string
          sort_order?: number | null
          specifications?: Json | null
          stock_quantity?: number | null
          storage_instructions?: string | null
          tags?: string[] | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status:
        | "pending_payment"
        | "paid"
        | "preparing"
        | "shipped"
        | "completed"
        | "cancelled"
      payment_method: "credit_card" | "atm" | "cvs_code" | "cvs_barcode"
      shipping_method: "pickup" | "home_delivery" | "convenience_store"
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
      order_status: [
        "pending_payment",
        "paid",
        "preparing",
        "shipped",
        "completed",
        "cancelled",
      ],
      payment_method: ["credit_card", "atm", "cvs_code", "cvs_barcode"],
      shipping_method: ["pickup", "home_delivery", "convenience_store"],
    },
  },
} as const
