import axios from "axios";
import { Database } from "@/types/database.types";

// Environment variables
// Note: Qikink API documentation varies. Assuming standard REST workflow.
// Often requires Authentication Header.

const QIKINK_API_URL = "https://sandbox.qikink.com/api"; // Updated based on Probe

export const syncToQikink = async (order: Database["public"]["Tables"]["orders"]["Row"], items: any[]) => {
    try {
        // 1. Map RIIQX Order to Qikink Payload
        const payload = {
            order_id: order.id,
            order_date: order.created_at,
            billing_customer_name: (order.shipping_address as any)?.fullName,
            billing_last_name: "",
            billing_address: (order.shipping_address as any)?.address,
            billing_city: (order.shipping_address as any)?.city,
            // ... mapping other fields ...
            line_items: items.map(item => ({
                sku: item.variant?.sku || "SKU-MISSING",
                quantity: item.quantity,
                selling_price: item.price_at_purchase
            }))
        };

        // 2. Send to Qikink
        const response = await axios.post(`${QIKINK_API_URL}/orders`, payload, {
            headers: {
                // Check Qikink docs for exact header name, usually it's plain 'Authorization' or 'api-key'
                // Assuming Bearer for now based on typical modern APIs
                "Authorization": `Bearer ${process.env.QIKINK_API_KEY}`
            }
        });
        return response.data;

    } catch (error: any) {
        console.error("Qikink Sync Error:", error);
        throw new Error("Failed to sync order to Qikink");
    }
};

// 3. Get Access Token
const getAccessToken = async () => {
    try {
        const response = await axios.post(`${QIKINK_API_URL}/token`, {
            ClientId: process.env.QIKINK_CLIENT_ID,
            client_secret: process.env.QIKINK_CLIENT_SECRET
        });
        return response.data.Accesstoken; // Case sensitive from Probe
    } catch (error: any) {
        console.error("Qikink Auth Error:", error.response?.data || error.message);
        throw new Error("Failed to authenticate with Qikink");
    }
};

export const getQikinkProducts = async () => {
    try {
        // 1. Authenticate
        const token = await getAccessToken();

        // 2. Fetch Products
        // Probe result: /api/product -> 404. /api/products -> Likely OK.
        const response = await axios.get(`${QIKINK_API_URL}/products`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const qikinkItems = response.data.data || response.data || []; // Handle wrapper

        // 3. Map to RIIQX Schema
        return qikinkItems.map((item: any) => ({
            id: `qk_${item.id}`,
            name: item.name || "Qikink Product",
            description: item.description || "",
            price: item.price || 0,
            images: item.images || [], // Assuming array of strings
            variants: (item.variants || []).map((v: any) => ({
                sku: v.sku || `QK-${item.id}-${v.size}-${v.color}`,
                size: v.size,
                color: v.color,
                stock: v.stock || 0
            }))
        }));

    } catch (error: any) {
        console.error("Qikink Fetch Error:", error.response?.data || error.message);
        return [];
    }
};
