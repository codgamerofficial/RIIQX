export type PromoCode = {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minOrderValue?: number;
};

export const AVAILABLE_PROMOS: PromoCode[] = [
    { code: 'RIIQX10', type: 'percentage', value: 10, minOrderValue: 0 },
    { code: 'WELCOME20', type: 'percentage', value: 20, minOrderValue: 1000 },
    { code: 'FLAT500', type: 'fixed', value: 500, minOrderValue: 2000 },
    { code: 'SUMMER30', type: 'percentage', value: 30, minOrderValue: 5000 },
];

export const validatePromoCode = (code: string, cartTotal: number): { valid: boolean; discount?: PromoCode; error?: string } => {
    const promo = AVAILABLE_PROMOS.find(p => p.code.toUpperCase() === code.toUpperCase());

    if (!promo) {
        return { valid: false, error: 'Invalid promo code' };
    }

    if (promo.minOrderValue && cartTotal < promo.minOrderValue) {
        return { valid: false, error: `Minimum order value of ₹${promo.minOrderValue} required` };
    }

    return { valid: true, discount: promo };
};

export const calculateDiscount = (total: number, discount: PromoCode): number => {
    if (discount.type === 'percentage') {
        return Math.round((total * discount.value) / 100);
    }
    return discount.value;
};
