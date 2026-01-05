import axios from "axios";

// Environment variables
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
const CASHFREE_ENV = process.env.CASHFREE_ENV || "sandbox"; // 'sandbox' or 'production'

const BASE_URL =
    CASHFREE_ENV === "production"
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg";

export const cashfree = axios.create({
    baseURL: BASE_URL,
    headers: {
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01", // Use the latest API version you are targeting
        "Content-Type": "application/json",
    },
});

export interface CreateOrderPayload {
    order_id: string;
    order_amount: number;
    order_currency: string;
    customer_details: {
        customer_id: string;
        customer_email: string;
        customer_phone: string;
        customer_name?: string;
    };
    order_meta: {
        return_url: string;
        notify_url: string;
    };
}

export const createCashfreeOrder = async (payload: CreateOrderPayload) => {
    try {
        const response = await cashfree.post("/orders", payload);
        return response.data;
    } catch (error: any) {
        console.error("Cashfree Create Order Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create Cashfree order");
    }
};

export const getCashfreeOrder = async (orderId: string) => {
    try {
        const response = await cashfree.get(`/orders/${orderId}`);
        return response.data;
    } catch (error: any) {
        console.error("Cashfree Get Order Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch Cashfree order");
    }
};

export const verifyCashfreeSignature = (signature: string, payload: any) => {
    // Placeholder SDK verification logic.
    // In production, use Cashfree's signature verification algorithm:
    // HMAC-SHA256(timestamp + body, secretKey)
    return true;
};
