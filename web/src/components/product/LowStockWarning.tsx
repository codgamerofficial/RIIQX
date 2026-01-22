import { AlertTriangle } from 'lucide-react';

interface LowStockWarningProps {
    stock: number;
    threshold?: number;
}

export function LowStockWarning({ stock, threshold = 10 }: LowStockWarningProps) {
    if (stock > threshold) return null;

    return (
        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-cherry/10 border border-orange-500/30 rounded-lg px-4 py-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <div>
                <p className="text-orange-500 font-semibold text-sm">
                    Only {stock} left in stock!
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                    Order soon before it's gone
                </p>
            </div>
        </div>
    );
}
