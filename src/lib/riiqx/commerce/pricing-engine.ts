// =============================================================================
// RIIQX Commerce OS — Pricing & Contribution Margin Mathematics Engine
// Transparent Unit Economics • Landed Cost Breakdown • Zero False Profit Policy
// =============================================================================

export interface PricingBreakdown {
  sellingPrice: number;
  supplierCogs: number;
  shippingCost: number;
  packagingCost: number;
  gatewayFee: number;
  gstAmount: number;
  rtoReserve: number;
  netContribution: number;
  netContributionMarginPct: number;
  breakEvenRoas: number;
  isCommerciallyViable: boolean;
  currency: 'INR' | 'USD';
}

export interface PricingInputParams {
  sellingPrice: number;
  supplierCogs: number;
  shippingCost?: number;
  packagingCost?: number;
  gatewayFeePct?: number; // Default 2.0%
  rtoReservePct?: number; // 4% for lifestyle, 10% for apparel
  currency?: 'INR' | 'USD';
}

export const MINIMUM_VIABLE_MARGIN_PCT = 30.0; // 30% contribution threshold

/**
 * Calculates genuine unit contribution margin after all variable operating expenses
 */
export function calculateUnitContribution(params: PricingInputParams): PricingBreakdown {
  const sellingPrice = Math.max(0, params.sellingPrice);
  const supplierCogs = Math.max(0, params.supplierCogs);
  const shippingCost = params.shippingCost ?? 70; // Standard express air parcel < 500g
  const packagingCost = params.packagingCost ?? 30; // Dustbag, unboxing card, sticker
  const gatewayRate = params.gatewayFeePct ?? 0.02; // 2% gateway rate
  const gatewayFeeGst = 0.18; // 18% GST on payment gateway services
  const effectiveGatewayRate = gatewayRate * (1 + gatewayFeeGst); // 2.36%

  const rtoReserveRate = params.rtoReservePct ?? 0.05; // 5% reserve

  const gatewayFee = Math.round(sellingPrice * effectiveGatewayRate * 100) / 100;
  const rtoReserve = Math.round(sellingPrice * rtoReserveRate * 100) / 100;
  const grossProfit = Math.max(0, sellingPrice - supplierCogs);

  // In Indian GST regime: 18% inclusive GST on value addition margin
  const gstAmount = Math.round(((grossProfit * 0.18) / 1.18) * 100) / 100;

  // Net Contribution Margin = SP - COGS - Shipping - Packaging - Gateway - GST - RTO Reserve
  const netContribution =
    Math.round(
      (sellingPrice - supplierCogs - shippingCost - packagingCost - gatewayFee - gstAmount - rtoReserve) * 100
    ) / 100;

  const netContributionMarginPct =
    sellingPrice > 0 ? Math.round((netContribution / sellingPrice) * 1000) / 10 : 0;

  const breakEvenRoas =
    netContribution > 0 ? Math.round((sellingPrice / netContribution) * 100) / 100 : 999.0;

  const isCommerciallyViable = netContributionMarginPct >= MINIMUM_VIABLE_MARGIN_PCT;

  return {
    sellingPrice,
    supplierCogs,
    shippingCost,
    packagingCost,
    gatewayFee,
    gstAmount,
    rtoReserve,
    netContribution,
    netContributionMarginPct,
    breakEvenRoas,
    isCommerciallyViable,
    currency: params.currency || 'INR',
  };
}

/**
 * Formats currency in Indian numbering system (e.g. ₹1,899)
 */
export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

