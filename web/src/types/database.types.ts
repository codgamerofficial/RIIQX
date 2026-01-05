export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    created_at: string
                    email: string | null
                    full_name: string | null
                    avatar_url: string | null
                    role: 'user' | 'admin'
                    wallet_balance: number
                    referral_code: string | null
                    referred_by: string | null
                }
                Insert: {
                    id: string
                    created_at?: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'user' | 'admin'
                    wallet_balance?: number
                    referral_code?: string | null
                    referred_by?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'user' | 'admin'
                    wallet_balance?: number
                    referral_code?: string | null
                    referred_by?: string | null
                }
            }
            products: {
                Row: {
                    id: string
                    created_at: string | null
                    qikink_product_id: string | null
                    title: string
                    description: string | null
                    base_price: number
                    selling_price: number
                    category: string | null
                    tags: string[] | null
                    images: string[] | null
                    glb_model_url: string | null
                    is_active: boolean
                }
                Insert: {
                    id?: string
                    created_at?: string | null
                    qikink_product_id?: string | null
                    title: string
                    description?: string | null
                    base_price: number
                    selling_price: number
                    category?: string | null
                    tags?: string[] | null
                    images?: string[] | null
                    glb_model_url?: string | null
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string | null
                    qikink_product_id?: string | null
                    title?: string
                    description?: string | null
                    base_price?: number
                    selling_price?: number
                    category?: string | null
                    tags?: string[] | null
                    images?: string[] | null
                    glb_model_url?: string | null
                    is_active?: boolean
                }
            }
            product_variants: {
                Row: {
                    id: string
                    product_id: string
                    color: string | null
                    size: string | null
                    sku: string | null
                    stock: number
                    qikink_variant_id: string | null
                }
                Insert: {
                    id?: string
                    product_id: string
                    color?: string | null
                    size?: string | null
                    sku?: string | null
                    stock?: number
                    qikink_variant_id?: string | null
                }
                Update: {
                    id?: string
                    product_id?: string
                    color?: string | null
                    size?: string | null
                    sku?: string | null
                    stock?: number
                    qikink_variant_id?: string | null
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string | null
                    status: string
                    total_amount: number
                    shipping_address: Json | null
                    payment_id: string | null
                    payment_method: string | null
                    tracking_id: string | null
                    courier_name: string | null
                    qikink_order_id: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    status?: string
                    total_amount: number
                    shipping_address?: Json | null
                    payment_id?: string | null
                    payment_method?: string | null
                    tracking_id?: string | null
                    courier_name?: string | null
                    qikink_order_id?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    status?: string
                    total_amount?: number
                    shipping_address?: Json | null
                    payment_id?: string | null
                    payment_method?: string | null
                    tracking_id?: string | null
                    courier_name?: string | null
                    qikink_order_id?: string | null
                    created_at?: string | null
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string | null
                    variant_id: string | null
                    quantity: number
                    price_at_purchase: number
                }
                Insert: {
                    id?: string
                    order_id: string
                    product_id?: string | null
                    variant_id?: string | null
                    quantity?: number
                    price_at_purchase: number
                }
                Update: {
                    id?: string
                    order_id?: string
                    product_id?: string | null
                    variant_id?: string | null
                    quantity?: number
                    price_at_purchase?: number
                }
            }
            cart_items: {
                Row: {
                    id: string
                    user_id: string | null
                    product_id: string | null
                    variant_id: string | null
                    quantity: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    product_id?: string | null
                    variant_id?: string | null
                    quantity?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    product_id?: string | null
                    variant_id?: string | null
                    quantity?: number
                    created_at?: string
                }
            }
        }
    }
}
