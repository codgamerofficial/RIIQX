// =============================================================================
// RIIQX — Festive Price Drop Sniper & 48-Hour Bank Arbitrage Engine
// Autonomous 48-Hour Bank Offer Rotation Tracking (HDFC -> ICICI -> SBI -> Axis)
// Supabase-Backed Persistence • Zero Mock Persistence • Strict Evidence
// =============================================================================

import { PriceMonitoringService, WatchlistRecord } from './price-monitoring-service';

export interface BankCycleSchedule {
  bankName: string;
  activeDays: string[];
  discountPercentage: number;
  maxDiscountCap: number;
  minTransaction: number;
  status: 'active_now' | 'upcoming_next' | 'scheduled';
  hoursRemaining?: number;
  cardTypeRequired: string;
}

export interface SniperWatchlistItem {
  id: string;
  productTitle: string;
  retailerName: string;
  productUrl: string;
  initialObservedPrice: number;
  currentFloorPrice: number;
  targetSnipePrice: number;
  bestApplicableBank: string;
  netPayableAfterBankDiscount: number;
  targetHit: boolean;
  status: 'monitoring' | 'snipe_ready' | 'target_hit' | 'purchased';
  lastCheckedAt: string;
  optimalBuyWindow: string;
  predictedDropDate: string;
  potentialSavings: number;
  variantAttributes?: Record<string, string>;
}

export interface FestiveSniperDashboardReport {
  timestamp: string;
  activeSaleEvent: string;
  bankRotationDisclaimer: string;
  currentActiveBank: BankCycleSchedule;
  upcomingBank: BankCycleSchedule;
  weeklyCycle: BankCycleSchedule[];
  watchlist: SniperWatchlistItem[];
  totalPotentialSavings: number;
  snipeReadyCount: number;
}

export class FestiveDropSniperService {
  /**
   * Deterministic 48-hour Indian Festive Bank Rotation Calendar
   * Monday-Tuesday: HDFC Bank
   * Wednesday-Thursday: ICICI Bank
   * Friday-Sunday: SBI Card & Axis Bank
   * NOTE: Bank rotation is an analytical schedule based on documented card flash schedules,
   * kept strictly separate from live merchant catalog price observations.
   */
  public static getBankRotationCalendar(): BankCycleSchedule[] {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const hoursLeftInDay = 24 - now.getHours();

    const calendar: BankCycleSchedule[] = [
      {
        bankName: 'HDFC Bank Credit Card',
        activeDays: ['Monday', 'Tuesday'],
        discountPercentage: 10,
        maxDiscountCap: 1750,
        minTransaction: 10000,
        cardTypeRequired: 'HDFC Millennia / Regalia / Diners',
        status: dayOfWeek === 1 || dayOfWeek === 2 ? 'active_now' : 'scheduled',
        hoursRemaining:
          dayOfWeek === 1 || dayOfWeek === 2 ? hoursLeftInDay + (dayOfWeek === 1 ? 24 : 0) : undefined,
      },
      {
        bankName: 'ICICI Bank Credit Card',
        activeDays: ['Wednesday', 'Thursday'],
        discountPercentage: 10,
        maxDiscountCap: 2000,
        minTransaction: 12000,
        cardTypeRequired: 'ICICI Amazon Pay / Sapphiro / Coral',
        status:
          dayOfWeek === 3 || dayOfWeek === 4
            ? 'active_now'
            : dayOfWeek === 1 || dayOfWeek === 2
            ? 'upcoming_next'
            : 'scheduled',
        hoursRemaining:
          dayOfWeek === 3 || dayOfWeek === 4 ? hoursLeftInDay + (dayOfWeek === 3 ? 24 : 0) : undefined,
      },
      {
        bankName: 'SBI Card & Axis Bank',
        activeDays: ['Friday', 'Saturday', 'Sunday'],
        discountPercentage: 10,
        maxDiscountCap: 1500,
        minTransaction: 8000,
        cardTypeRequired: 'SBI SimplyCLICK / Cashback SBI / Axis Flipkart',
        status:
          dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0
            ? 'active_now'
            : dayOfWeek === 4
            ? 'upcoming_next'
            : 'scheduled',
        hoursRemaining:
          dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0
            ? hoursLeftInDay + (dayOfWeek === 5 ? 48 : dayOfWeek === 6 ? 24 : 0)
            : undefined,
      },
    ];

    return calendar;
  }

  /**
   * Evaluates and returns complete Sniper Dashboard Report from persistent storage
   */
  public static async getDashboardReport(userId = 'usr_guest_local'): Promise<FestiveSniperDashboardReport> {
    const weeklyCycle = this.getBankRotationCalendar();
    const currentActiveBank =
      weeklyCycle.find((b) => b.status === 'active_now') || weeklyCycle[0];
    const upcomingBank =
      weeklyCycle.find((b) => b.status === 'upcoming_next') || weeklyCycle[1];

    // Fetch actual persisted watchlists for this user from Supabase / persistent store
    const persistedRecords = await PriceMonitoringService.getUserWatchlists(userId);

    const watchlist: SniperWatchlistItem[] = persistedRecords.map((rec) => {
      const discount =
        rec.currentPrice >= currentActiveBank.minTransaction
          ? Math.min(
              currentActiveBank.maxDiscountCap,
              Math.round(rec.currentPrice * (currentActiveBank.discountPercentage / 100))
            )
          : 0;

      const netPayable = Math.max(0, rec.currentPrice - discount);
      const isTargetHit = netPayable <= rec.targetPrice;

      return {
        id: rec.id,
        productTitle: rec.productTitle,
        retailerName: rec.retailerName,
        productUrl: rec.productUrl,
        initialObservedPrice: rec.initialPrice,
        currentFloorPrice: rec.currentPrice,
        targetSnipePrice: rec.targetPrice,
        bestApplicableBank: currentActiveBank.bankName,
        netPayableAfterBankDiscount: netPayable,
        targetHit: isTargetHit,
        status: isTargetHit ? 'snipe_ready' : 'monitoring',
        lastCheckedAt: rec.lastCheckedAt || rec.createdAt,
        optimalBuyWindow: isTargetHit ? 'Active Target Deal' : 'Pending 48h Shift',
        predictedDropDate: isTargetHit ? 'Floor Active' : 'Estimated 3-4 days',
        potentialSavings: Math.max(0, rec.initialPrice - netPayable),
        variantAttributes: rec.variantAttributes,
      };
    });

    let totalPotentialSavings = 0;
    let snipeReadyCount = 0;

    for (const item of watchlist) {
      totalPotentialSavings += item.potentialSavings;
      if (item.targetHit || item.status === 'snipe_ready') {
        snipeReadyCount++;
      }
    }

    return {
      timestamp: new Date().toISOString(),
      activeSaleEvent: 'Grand Festive Price Radar & Bank Arbitrage',
      bankRotationDisclaimer:
        'Estimated 48-hour bank campaign rotation based on published banking schedules; independent of live merchant catalog prices.',
      currentActiveBank,
      upcomingBank,
      weeklyCycle,
      watchlist,
      totalPotentialSavings,
      snipeReadyCount,
    };
  }

  /**
   * Adds or registers a new sniper target into Supabase / persistent database
   */
  public static async addSniperTarget(
    item: {
      productTitle: string;
      productUrl?: string;
      currentPrice: number;
      targetPrice: number;
      preferredBank?: string;
      retailerName?: string;
      sellerName?: string;
      variantAttributes?: Record<string, string>;
    },
    userId = 'usr_guest_local'
  ): Promise<SniperWatchlistItem> {
    const persisted = await PriceMonitoringService.addOrUpdateWatchlist(userId, {
      productTitle: item.productTitle,
      productUrl: item.productUrl,
      currentPrice: item.currentPrice,
      targetPrice: item.targetPrice,
      retailerName: item.retailerName,
      sellerName: item.sellerName,
      variantAttributes: item.variantAttributes,
      preferredBank: item.preferredBank,
    });

    const bankCalendar = this.getBankRotationCalendar();
    const activeBank = bankCalendar.find((b) => b.status === 'active_now') || bankCalendar[0];
    const bankName = item.preferredBank || activeBank.bankName;

    const discount =
      persisted.currentPrice >= activeBank.minTransaction
        ? Math.min(
            activeBank.maxDiscountCap,
            Math.round(persisted.currentPrice * (activeBank.discountPercentage / 100))
          )
        : 0;

    const netPayable = Math.max(0, persisted.currentPrice - discount);
    const targetHit = netPayable <= persisted.targetPrice;

    return {
      id: persisted.id,
      productTitle: persisted.productTitle,
      retailerName: persisted.retailerName,
      productUrl: persisted.productUrl,
      initialObservedPrice: persisted.initialPrice,
      currentFloorPrice: persisted.currentPrice,
      targetSnipePrice: persisted.targetPrice,
      bestApplicableBank: bankName,
      netPayableAfterBankDiscount: netPayable,
      targetHit,
      status: targetHit ? 'snipe_ready' : 'monitoring',
      lastCheckedAt: persisted.updatedAt,
      optimalBuyWindow: targetHit ? 'Immediate Flash Deal' : 'Pending 48h Bank Shift',
      predictedDropDate: targetHit ? 'Active Today' : 'Estimated within 3-4 days',
      potentialSavings: Math.max(0, persisted.initialPrice - netPayable),
      variantAttributes: persisted.variantAttributes,
    };
  }
}
