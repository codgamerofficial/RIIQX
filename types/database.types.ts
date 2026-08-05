export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'customer';
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'printed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';
export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'preorder';
export type DiscountType = 'percentage' | 'flat';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          phone: string | null;
          shipping_address: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          phone?: string | null;
          shipping_address?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          phone?: string | null;
          shipping_address?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          base_price: number;
          sale_price: number | null;
          qikink_product_id?: string | null;
          is_published: boolean;
          metadata: Json;
          category_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          base_price: number;
          sale_price?: number | null;
          qikink_product_id?: string | null;
          is_published?: boolean;
          metadata?: Json;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          base_price?: number;
          sale_price?: number | null;
          qikink_product_id?: string | null;
          is_published?: boolean;
          metadata?: Json;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };

      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          color: string;
          size: string;
          price_override: number | null;
          qikink_variant_id?: string | null;
          qikink_sku?: string | null;
          stock_quantity: number;
          status: InventoryStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          color: string;
          size: string;
          price_override?: number | null;
          qikink_variant_id?: string | null;
          qikink_sku?: string | null;
          stock_quantity?: number;
          status?: InventoryStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          sku?: string;
          color?: string;
          size?: string;
          price_override?: number | null;
          qikink_variant_id?: string | null;
          qikink_sku?: string | null;
          stock_quantity?: number;
          status?: InventoryStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };

      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          alt_text?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };

      orders: {
        Row: {
          id: string;
          user_id: string | null;
          order_number: string;
          total_amount: number;
          discount_amount: number;
          tax_amount: number;
          status: OrderStatus;
          payment_status: PaymentStatus;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          qikink_order_id: string | null;
          tracking_number: string | null;
          carrier_name: string | null;
          tracking_url: string | null;
          estimated_delivery_date: string | null;
          shipping_address: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          order_number: string;
          total_amount: number;
          discount_amount?: number;
          tax_amount?: number;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          qikink_order_id?: string | null;
          tracking_number?: string | null;
          carrier_name?: string | null;
          tracking_url?: string | null;
          estimated_delivery_date?: string | null;
          shipping_address: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          order_number?: string;
          total_amount?: number;
          discount_amount?: number;
          tax_amount?: number;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          qikink_order_id?: string | null;
          tracking_number?: string | null;
          carrier_name?: string | null;
          tracking_url?: string | null;
          estimated_delivery_date?: string | null;
          shipping_address?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_variant_id: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_variant_id?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_variant_id?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_variant_id_fkey";
            columns: ["product_variant_id"];
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          }
        ];
      };

      coupons: {
        Row: {
          id: string;
          code: string;
          discount_type: DiscountType;
          discount_value: number;
          min_order_amount: number;
          max_uses: number | null;
          current_uses: number;
          expires_at: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_type: DiscountType;
          discount_value: number;
          min_order_amount?: number;
          max_uses?: number | null;
          current_uses?: number;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          discount_type?: DiscountType;
          discount_value?: number;
          min_order_amount?: number;
          max_uses?: number | null;
          current_uses?: number;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wishlists_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      processed_webhooks: {
        Row: {
          id: string;
          event_id: string;
          provider: string;
          processed_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          provider?: string;
          processed_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          provider?: string;
          processed_at?: string;
        };
        Relationships: [];
      };

      qikink_sync_logs: {
        Row: {
          id: string;
          entity_type: string;
          entity_id: string | null;
          qikink_reference_id: string | null;
          status: string;
          payload: Json | null;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          entity_type: string;
          entity_id?: string | null;
          qikink_reference_id?: string | null;
          status: string;
          payload?: Json | null;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          entity_type: string;
          entity_id?: string | null;
          qikink_reference_id?: string | null;
          status?: string;
          payload?: Json | null;
          error_message?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      inventory_status: InventoryStatus;
      discount_type: DiscountType;
    };
  };
}
