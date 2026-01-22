import { useState } from 'react';
import { Tag, X } from 'lucide-react';

interface PromoCodeInputProps {
    onApply: (code: string) => void;
    discount?: number;
}

export function PromoCodeInput({ onApply, discount }: PromoCodeInputProps) {
    const [code, setCode] = useState('');
    const [isApplied, setIsApplied] = useState(false);
    const [error, setError] = useState('');

    const handleApply = () => {
        if (!code.trim()) {
            setError('Please enter a promo code');
            return;
        }

        // Mock validation - replace with actual API call
        const validCodes = ['FIRST10', 'SAVE20', 'RIIQX15'];
        if (validCodes.includes(code.toUpperCase())) {
            setIsApplied(true);
            setError('');
            onApply(code);
        } else {
            setError('Invalid promo code');
        }
    };

    const handleRemove = () => {
        setCode('');
        setIsApplied(false);
        setError('');
        onApply('');
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Enter promo code"
                        disabled={isApplied}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cherry disabled:opacity-50"
                    />
                </div>
                {!isApplied ? (
                    <button
                        onClick={handleApply}
                        className="px-6 py-3 bg-cherry hover:bg-cherry/90 text-white font-semibold rounded-lg transition-colors"
                    >
                        Apply
                    </button>
                ) : (
                    <button
                        onClick={handleRemove}
                        className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            {isApplied && discount && (
                <div className="flex items-center gap-2 text-green-500 text-sm">
                    <Tag className="w-4 h-4" />
                    <span>Code applied! You saved ₹{discount}</span>
                </div>
            )}
        </div>
    );
}
