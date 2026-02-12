import { useState } from 'react';

interface Message {
    role: 'user' | 'model';
    content: string;
}

export function useStylist() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async (messages: Message[]) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/stylist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch stylist response');
            }

            const data = await response.json();
            return data.content;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { sendMessage, isLoading, error };
}
