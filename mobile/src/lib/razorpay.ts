import { Alert, Linking } from 'react-native';

const API_URL = 'https://riiqx.vercel.app'; // Production URL

export interface RazorpayOrderResponse {
    id: string;
    currency: string;
    amount: number;
}

export const createRazorpayOrder = async (amount: number, currency: string = 'INR'): Promise<RazorpayOrderResponse | null> => {
    try {
        const response = await fetch(`${API_URL}/api/razorpay/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: Math.round(amount * 100), // Convert to paise
                currency,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create Razorpay order');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Razorpay Order Creation Error:', error);
        Alert.alert('Error', 'Failed to initiate payment. Please try again.');
        return null;
    }
};

export const initiateRazorpayPayment = async (
    orderId: string,
    amount: number,
    currency: string,
    userEmail?: string,
    userName?: string
) => {
    try {
        // For mobile, we'll redirect to a web payment page
        // This is more reliable than native integration
        const paymentUrl = `${API_URL}/payment?orderId=${orderId}&amount=${amount}&currency=${currency}`;

        const canOpen = await Linking.canOpenURL(paymentUrl);
        if (canOpen) {
            await Linking.openURL(paymentUrl);
        } else {
            Alert.alert('Error', 'Cannot open payment page');
        }
    } catch (error) {
        console.error('Payment Initiation Error:', error);
        Alert.alert('Error', 'Failed to open payment page');
    }
};
