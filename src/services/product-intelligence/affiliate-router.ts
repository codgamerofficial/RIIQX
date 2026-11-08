// =============================================================================
// RIIQX — Affiliate Smart-Router & Revenue Attribution Engine
// Canonical Link Preservation • Compliant Partner Attribution • Real Commission Math
// Zero Fabricated Clicks • Local & Supabase Persistence • Transparent Attribution
// =============================================================================

import fs from 'fs';
import path from 'path';
import { createAdminClient, isServiceRoleConfigured } from '../../lib/supabase/admin';
import { ProductURLExtractor } from './url-extractor';

export interface AffiliatePartnerConfig {
  amazonTag: string;
  flipkartAffId: string;
  tataCliqCid: string;
  cromaUtmSource: string;
  myntraAffId: string;
  relianceDigitalUtmSource: string;
  nykaaUtmSource: string;
}

export interface AffiliateConversionRecord {
  id: string;
  clickId?: string;
  userId?: string;
  retailerName: string;
  orderId: string;
  orderAmountINR: number;
  commissionAmountINR: number;
  commissionRatePct: number;
  status: 'pending' | 'approved' | 'returned' | 'settled';
  partnerSource: string;
  transactionTimestamp: string;
  settledAt?: string;
  createdAt: string;
}

export interface CommissionSchedule {
  category: string;
  amazonPct: number;
  flipkartPct: number;
  tataCliqPct: number;
  cromaPct: number;
  myntraPct: number;
  reliancePct: number;
  nykaaPct: number;
  defaultPct: number;
}

export interface AffiliateClickInput {
  userId?: string;
  productIdentifier: string;
  productTitle: string;
  retailerName: string;
  sellerName?: string;
  sellingPrice: number;
  destinationUrl: string;
  category?: string;
  referrerPage?: string;
  userAgent?: string;
  ipHash?: string;
}

export interface AffiliateClickEvent extends AffiliateClickInput {
  id: string;
  expectedCommissionPct: number;
  projectedEarningsINR: number;
  affiliateUrl: string;
  createdAt: string;
}

export interface AffiliateEarningsReport {
  totalClicks: number;
  directedCartVolumeINR: number;
  totalGrossOrderValueINR: number; // Backward-compatible alias for directedCartVolumeINR
  estimatedPotentialCommissionINR: number;
  totalProjectedCommissionINR: number; // Backward-compatible alias for estimatedPotentialCommissionINR
  confirmedConversionsCount: number;
  confirmedOrderValueINR: number;
  confirmedCommissionINR: number;
  settledPayoutsINR: number;
  averageCommissionPct: number;
  topRetailers: {
    retailerName: string;
    clicks: number;
    projectedCommissionINR: number;
    confirmedCommissionINR: number;
    sharePct: number;
  }[];
  partnerStatuses: Record<string, { configured: boolean; partnerTag?: string; status: 'verified_partner' | 'unconfigured' }>;
  recentClicks: AffiliateClickEvent[];
  recentConversions: AffiliateConversionRecord[];
}

export class AffiliateSmartRouter {
  private static DATA_DIR = path.resolve(process.cwd(), '.data');
  private static CLICKS_FILE = path.resolve(AffiliateSmartRouter.DATA_DIR, 'affiliate_clicks.json');
  private static CONVERSIONS_FILE = path.resolve(AffiliateSmartRouter.DATA_DIR, 'affiliate_conversions.json');
  private static SUMMARY_FILE = path.resolve(AffiliateSmartRouter.DATA_DIR, 'affiliate_earnings_summary.json');

  /**
   * Published Indian E-Commerce Category Commission Schedules (Standard Average)
   */
  private static COMMISSION_SCHEDULES: Record<string, CommissionSchedule> = {
    audio: {
      category: 'Audio & Headphones',
      amazonPct: 4.5,
      flipkartPct: 4.0,
      tataCliqPct: 5.0,
      cromaPct: 3.5,
      myntraPct: 6.0,
      reliancePct: 3.5,
      nykaaPct: 5.0,
      defaultPct: 4.0,
    },
    electronics: {
      category: 'Laptops & Computers',
      amazonPct: 3.0,
      flipkartPct: 2.5,
      tataCliqPct: 3.5,
      cromaPct: 2.5,
      myntraPct: 4.0,
      reliancePct: 2.5,
      nykaaPct: 3.0,
      defaultPct: 3.0,
    },
    mobiles: {
      category: 'Smartphones & Mobiles',
      amazonPct: 1.5,
      flipkartPct: 1.5,
      tataCliqPct: 2.0,
      cromaPct: 1.5,
      myntraPct: 2.0,
      reliancePct: 1.5,
      nykaaPct: 2.0,
      defaultPct: 1.5,
    },
    fashion: {
      category: 'Fashion & Apparel',
      amazonPct: 9.0,
      flipkartPct: 8.5,
      tataCliqPct: 8.0,
      cromaPct: 5.0,
      myntraPct: 10.0,
      reliancePct: 7.0,
      nykaaPct: 9.0,
      defaultPct: 8.5,
    },
    beauty: {
      category: 'Beauty & Personal Care',
      amazonPct: 7.5,
      flipkartPct: 7.0,
      tataCliqPct: 7.0,
      cromaPct: 4.0,
      myntraPct: 8.0,
      reliancePct: 6.0,
      nykaaPct: 8.5,
      defaultPct: 7.5,
    },
    appliances: {
      category: 'Large Appliances & Home',
      amazonPct: 5.5,
      flipkartPct: 5.0,
      tataCliqPct: 5.5,
      cromaPct: 4.0,
      myntraPct: 6.0,
      reliancePct: 4.0,
      nykaaPct: 5.0,
      defaultPct: 5.0,
    },
    general: {
      category: 'General Retail',
      amazonPct: 4.0,
      flipkartPct: 3.5,
      tataCliqPct: 4.0,
      cromaPct: 3.0,
      myntraPct: 5.0,
      reliancePct: 3.0,
      nykaaPct: 4.0,
      defaultPct: 3.5,
    },
  };

  /**
   * Reads genuine affiliate credentials strictly from environment without fabricating IDs
   */
  public static getPartnerConfig(): AffiliatePartnerConfig {
    return {
      amazonTag: process.env.AMAZON_ASSOCIATE_TAG?.trim() || '',
      flipkartAffId: process.env.FLIPKART_AFFILIATE_ID?.trim() || '',
      tataCliqCid: process.env.TATA_CLIQ_AFFILIATE_TAG?.trim() || '',
      cromaUtmSource: process.env.CROMA_AFFILIATE_TAG?.trim() || '',
      myntraAffId: process.env.MYNTRA_AFFILIATE_TAG?.trim() || '',
      relianceDigitalUtmSource: process.env.RELIANCE_DIGITAL_AFFILIATE_TAG?.trim() || '',
      nykaaUtmSource: process.env.NYKAA_AFFILIATE_TAG?.trim() || '',
    };
  }

  private static ensureDataDir() {
    if (!fs.existsSync(this.DATA_DIR)) {
      try {
        fs.mkdirSync(this.DATA_DIR, { recursive: true });
      } catch {
        // Fallback for restricted environments
      }
    }
  }

  private static readLocalJson<T>(filePath: string): T[] {
    try {
      this.ensureDataDir();
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    } catch {
      // Empty fallback
    }
    return [];
  }

  private static writeLocalJson<T>(filePath: string, data: T[]) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch {
      // Ignore write errors
    }
  }

  private static getAdminClient(): any {
    return createAdminClient() as any;
  }

  /**
   * Infers product category key from product title or category hint
   */
  public static inferCategoryKey(titleOrCategory: string): string {
    const s = titleOrCategory.toLowerCase();
    if (s.includes('audio') || s.includes('headphone') || s.includes('earbud') || s.includes('earphone') || s.includes('soundbar') || s.includes('speaker') || s.includes('wf-') || s.includes('wh-')) {
      return 'audio';
    }
    if (s.includes('mobile') || s.includes('phone') || s.includes('smartphone') || s.includes('iphone') || s.includes('samsung galaxy') || s.includes('oneplus') || s.includes('pixel')) {
      return 'mobiles';
    }
    if (s.includes('electronic') || s.includes('laptop') || s.includes('macbook') || s.includes('computer') || s.includes('monitor') || s.includes('keyboard') || s.includes('mouse') || s.includes('pc') || s.includes('tablet') || s.includes('ipad')) {
      return 'electronics';
    }
    if (s.includes('fashion') || s.includes('clothing') || s.includes('apparel') || s.includes('shoe') || s.includes('clog') || s.includes('sneaker') || s.includes('shirt') || s.includes('t-shirt') || s.includes('dress') || s.includes('pant') || s.includes('jean') || s.includes('jacket') || s.includes('watch')) {
      return 'fashion';
    }
    if (s.includes('beauty') || s.includes('cosmetic') || s.includes('skincare') || s.includes('serum') || s.includes('cream') || s.includes('shampoo') || s.includes('sunscreen') || s.includes('lotion') || s.includes('lipstick') || s.includes('perfume')) {
      return 'beauty';
    }
    if (s.includes('appliance') || s.includes('refrigerator') || s.includes('washing machine') || s.includes('tv') || s.includes('television') || s.includes('microwave') || s.includes('ac') || s.includes('purifier') || s.includes('vacuum')) {
      return 'appliances';
    }
    return 'general';
  }

  /**
   * Resolves expected affiliate commission percentage for a given retailer and category
   */
  public static getCommissionPercentage(retailerName: string, categoryOrTitle: string): number {
    const normRetailer = retailerName.toLowerCase();
    const catKey = this.inferCategoryKey(categoryOrTitle);
    const schedule = this.COMMISSION_SCHEDULES[catKey] || this.COMMISSION_SCHEDULES.general;

    if (normRetailer.includes('amazon')) return schedule.amazonPct;
    if (normRetailer.includes('flipkart')) return schedule.flipkartPct;
    if (normRetailer.includes('tatacliq') || normRetailer.includes('tata cliq')) return schedule.tataCliqPct;
    if (normRetailer.includes('croma')) return schedule.cromaPct;
    if (normRetailer.includes('myntra')) return schedule.myntraPct;
    if (normRetailer.includes('reliance')) return schedule.reliancePct;
    if (normRetailer.includes('nykaa')) return schedule.nykaaPct;

    return schedule.defaultPct;
  }

  /**
   * Alias for getCommissionPercentage
   */
  public static getCommissionRate(retailerName: string, categoryOrTitle: string): number {
    return this.getCommissionPercentage(retailerName, categoryOrTitle);
  }

  /**
   * Calculates projected commission percentage and exact INR payout
   */
  public static calculateProjectedCommission(
    sellingPrice: number,
    retailerName: string,
    categoryOrTitle: string
  ): { commissionPct: number; projectedEarningsINR: number } {
    const commissionPct = this.getCommissionPercentage(retailerName, categoryOrTitle);
    const projectedEarningsINR = Math.round((sellingPrice * (commissionPct / 100)) * 100) / 100;
    return { commissionPct, projectedEarningsINR };
  }

  /**
   * Resolves canonical product URL and appends genuine affiliate tags ONLY if verified and configured.
   * If partner tags are unconfigured, keeps canonical URL clean and returns transparent unconfigured status.
   */
  public static resolveAffiliateUrl(
    rawUrl: string,
    retailerName: string,
    categoryOrTitle: string = '',
    sellingPrice: number = 0
  ): {
    affiliateUrl: string;
    canonicalUrl: string;
    commissionPct: number;
    expectedEarningsINR: number;
    retailer: string;
    isAttributed: boolean;
    partnerStatus: 'verified_partner' | 'unconfigured';
  } {
    const config = this.getPartnerConfig();
    const canonical = ProductURLExtractor.canonicalizeUrl(rawUrl);
    const resolvedRetailer = retailerName || canonical.retailerName;
    const norm = resolvedRetailer.toLowerCase();
    const commissionPct = this.getCommissionPercentage(resolvedRetailer, categoryOrTitle);

    let targetUrl: URL;
    try {
      targetUrl = new URL(canonical.canonicalUrl || rawUrl);
    } catch {
      targetUrl = new URL('https://www.amazon.in');
    }

    let isAttributed = false;

    // 1. Amazon India Format: ?tag={AMAZON_TAG}&linkCode=as2
    if (norm.includes('amazon')) {
      if (config.amazonTag) {
        targetUrl.searchParams.set('tag', config.amazonTag);
        targetUrl.searchParams.set('linkCode', 'as2');
        targetUrl.searchParams.set('camp', '3638');
        targetUrl.searchParams.set('creative', '165953');
        isAttributed = true;
      }
    }
    // 2. Flipkart Format: ?affid={FLIPKART_AFFID}
    else if (norm.includes('flipkart')) {
      if (config.flipkartAffId) {
        targetUrl.searchParams.set('affid', config.flipkartAffId);
        isAttributed = true;
      }
    }
    // 3. Tata CLiQ Format: ?cid={TATA_CLIQ_CID}
    else if (norm.includes('tatacliq') || norm.includes('tata cliq')) {
      if (config.tataCliqCid) {
        targetUrl.searchParams.set('cid', config.tataCliqCid);
        targetUrl.searchParams.set('utm_source', 'affiliate');
        targetUrl.searchParams.set('utm_medium', 'riiqx');
        isAttributed = true;
      }
    }
    // 4. Croma Format: ?utm_campaign={CROMA_TAG}
    else if (norm.includes('croma')) {
      if (config.cromaUtmSource) {
        targetUrl.searchParams.set('utm_source', 'affiliate');
        targetUrl.searchParams.set('utm_medium', 'riiqx');
        targetUrl.searchParams.set('utm_campaign', config.cromaUtmSource);
        isAttributed = true;
      }
    }
    // 5. Myntra Format: ?aff_id={MYNTRA_AFFID}
    else if (norm.includes('myntra')) {
      if (config.myntraAffId) {
        targetUrl.searchParams.set('aff_id', config.myntraAffId);
        targetUrl.searchParams.set('utm_source', 'affiliate');
        targetUrl.searchParams.set('utm_medium', 'riiqx');
        isAttributed = true;
      }
    }
    // 6. Reliance Digital Format
    else if (norm.includes('reliance')) {
      if (config.relianceDigitalUtmSource) {
        targetUrl.searchParams.set('utm_source', 'affiliate');
        targetUrl.searchParams.set('utm_medium', 'riiqx');
        targetUrl.searchParams.set('utm_campaign', config.relianceDigitalUtmSource);
        isAttributed = true;
      }
    }
    // 7. Nykaa Format
    else if (norm.includes('nykaa')) {
      if (config.nykaaUtmSource) {
        targetUrl.searchParams.set('utm_source', 'affiliate');
        targetUrl.searchParams.set('utm_medium', 'riiqx');
        targetUrl.searchParams.set('utm_campaign', config.nykaaUtmSource);
        isAttributed = true;
      }
    }

    const partnerStatus = isAttributed ? 'verified_partner' : 'unconfigured';
    // If partner is not verified/configured, projected earnings must honestly be 0
    const expectedEarningsINR = isAttributed
      ? Math.round((sellingPrice * (commissionPct / 100)) * 100) / 100
      : 0;

    return {
      affiliateUrl: isAttributed ? targetUrl.toString() : (canonical.canonicalUrl || rawUrl),
      canonicalUrl: canonical.canonicalUrl,
      commissionPct,
      expectedEarningsINR,
      retailer: resolvedRetailer,
      isAttributed,
      partnerStatus,
    };
  }

  /**
   * Records an outbound purchase click intent event to Supabase and local storage
   */
  public static async recordOutboundClick(input: AffiliateClickInput): Promise<AffiliateClickEvent> {
    const resolved = this.resolveAffiliateUrl(
      input.destinationUrl,
      input.retailerName,
      input.category || input.productTitle,
      input.sellingPrice
    );

    const now = new Date().toISOString();
    const clickEvent: AffiliateClickEvent = {
      ...input,
      id: `click_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      expectedCommissionPct: resolved.commissionPct,
      projectedEarningsINR: resolved.expectedEarningsINR,
      affiliateUrl: resolved.affiliateUrl,
      createdAt: now,
    };

    // 1. Try Supabase
    if (isServiceRoleConfigured()) {
      try {
        const sb = this.getAdminClient();
        await sb.from('affiliate_click_events').insert({
          user_id: input.userId || 'usr_guest_local',
          product_identifier: input.productIdentifier,
          product_title: input.productTitle,
          retailer_name: input.retailerName,
          seller_name: input.sellerName,
          selling_price: input.sellingPrice,
          expected_commission_pct: resolved.commissionPct,
          projected_earnings_inr: resolved.expectedEarningsINR,
          destination_url: input.destinationUrl,
          affiliate_url: resolved.affiliateUrl,
          category: input.category || this.inferCategoryKey(input.productTitle),
          referrer_page: input.referrerPage || 'Decision Lab',
          user_agent: input.userAgent,
          ip_hash: input.ipHash,
        });

        // Upsert daily summary
        const today = new Date().toISOString().slice(0, 10);
        const { data: existingSummary } = await sb
          .from('affiliate_earnings_summary')
          .select('*')
          .eq('period_date', today)
          .eq('retailer_name', input.retailerName)
          .maybeSingle();

        if (existingSummary) {
          await sb
            .from('affiliate_earnings_summary')
            .update({
              total_clicks: existingSummary.total_clicks + 1,
              total_gross_order_value: Number(existingSummary.total_gross_order_value) + input.sellingPrice,
              total_projected_commission: Number(existingSummary.total_projected_commission) + resolved.expectedEarningsINR,
              updated_at: now,
            })
            .eq('id', existingSummary.id);
        } else {
          await sb.from('affiliate_earnings_summary').insert({
            period_date: today,
            retailer_name: input.retailerName,
            total_clicks: 1,
            total_gross_order_value: input.sellingPrice,
            total_projected_commission: resolved.expectedEarningsINR,
          });
        }
      } catch {
        // Fall through to local file
      }
    }

    // 2. Persist to local disk storage (restart-proof)
    const localClicks = this.readLocalJson<AffiliateClickEvent>(this.CLICKS_FILE);
    localClicks.unshift(clickEvent);
    this.writeLocalJson(this.CLICKS_FILE, localClicks);

    return clickEvent;
  }

  /**
   * Records a confirmed affiliate purchase conversion via webhook/postback from partner network
   */
  public static async recordConversionPostback(input: {
    clickId?: string;
    userId?: string;
    retailerName: string;
    orderId: string;
    orderAmountINR: number;
    commissionAmountINR: number;
    commissionRatePct?: number;
    status?: 'pending' | 'approved' | 'returned' | 'settled';
    partnerSource: string;
    transactionTimestamp?: string;
    settledAt?: string;
  }): Promise<AffiliateConversionRecord> {
    const now = new Date().toISOString();
    const conversion: AffiliateConversionRecord = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      clickId: input.clickId,
      userId: input.userId,
      retailerName: input.retailerName,
      orderId: input.orderId,
      orderAmountINR: Number(input.orderAmountINR) || 0,
      commissionAmountINR: Number(input.commissionAmountINR) || 0,
      commissionRatePct: Number(input.commissionRatePct) || 0,
      status: input.status || 'pending',
      partnerSource: input.partnerSource,
      transactionTimestamp: input.transactionTimestamp || now,
      settledAt: input.settledAt,
      createdAt: now,
    };

    // 1. Supabase Persistence
    if (isServiceRoleConfigured()) {
      try {
        const sb = this.getAdminClient();
        await sb.from('affiliate_conversions').upsert({
          id: conversion.id,
          click_id: conversion.clickId,
          user_id: conversion.userId,
          retailer_name: conversion.retailerName,
          order_id: conversion.orderId,
          order_amount: conversion.orderAmountINR,
          commission_amount: conversion.commissionAmountINR,
          commission_rate: conversion.commissionRatePct,
          status: conversion.status,
          partner_source: conversion.partnerSource,
          transaction_timestamp: conversion.transactionTimestamp,
          settled_at: conversion.settledAt,
        }, { onConflict: 'retailer_name,order_id' });
      } catch {
        // Fall through to local storage
      }
    }

    // 2. Local JSON Persistence
    const localConversions = this.readLocalJson<AffiliateConversionRecord>(this.CONVERSIONS_FILE);
    const existingIdx = localConversions.findIndex(
      (c) => c.retailerName === conversion.retailerName && c.orderId === conversion.orderId
    );
    if (existingIdx >= 0) {
      localConversions[existingIdx] = { ...localConversions[existingIdx], ...conversion };
    } else {
      localConversions.unshift(conversion);
    }
    this.writeLocalJson(this.CONVERSIONS_FILE, localConversions);

    return conversion;
  }

  /**
   * Retrieves recorded affiliate conversions
   */
  public static async getConversionHistory(userId?: string): Promise<AffiliateConversionRecord[]> {
    if (isServiceRoleConfigured()) {
      try {
        const sb = this.getAdminClient();
        let query = sb.from('affiliate_conversions').select('*').order('created_at', { ascending: false });
        if (userId && userId !== 'all') {
          query = query.eq('user_id', userId);
        }
        const { data, error } = await query;
        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            clickId: d.click_id,
            userId: d.user_id,
            retailerName: d.retailer_name,
            orderId: d.order_id,
            orderAmountINR: Number(d.order_amount),
            commissionAmountINR: Number(d.commission_amount),
            commissionRatePct: Number(d.commission_rate),
            status: d.status,
            partnerSource: d.partner_source,
            transactionTimestamp: d.transaction_timestamp,
            settledAt: d.settled_at,
            createdAt: d.created_at,
          }));
        }
      } catch {
        // Fall through to local store
      }
    }
    const local = this.readLocalJson<AffiliateConversionRecord>(this.CONVERSIONS_FILE);
    return userId && userId !== 'all' ? local.filter((c) => c.userId === userId) : local;
  }

  /**
   * Generates genuine real-time affiliate earnings analytics report.
   * Honest accounting: Separates directed click volume from confirmed orders and settled payouts.
   */
  public static async getEarningsDashboard(userId?: string): Promise<AffiliateEarningsReport> {
    const localClicks = this.readLocalJson<AffiliateClickEvent>(this.CLICKS_FILE);
    const filteredClicks = userId && userId !== 'all'
      ? localClicks.filter((c) => c.userId === userId)
      : localClicks;

    const totalClicks = filteredClicks.length;
    let directedCartVolumeINR = 0;
    let estimatedPotentialCommissionINR = 0;

    const retailerMap: Record<string, { clicks: number; projected: number; confirmed: number }> = {};

    for (const c of filteredClicks) {
      directedCartVolumeINR += Number(c.sellingPrice || 0);
      estimatedPotentialCommissionINR += Number(c.projectedEarningsINR || 0);

      const r = c.retailerName || 'Verified Merchant';
      if (!retailerMap[r]) {
        retailerMap[r] = { clicks: 0, projected: 0, confirmed: 0 };
      }
      retailerMap[r].clicks += 1;
      retailerMap[r].projected += Number(c.projectedEarningsINR || 0);
    }

    // Read real conversions from postback stream
    const conversions = await this.getConversionHistory(userId);
    let confirmedOrderValueINR = 0;
    let confirmedCommissionINR = 0;
    let settledPayoutsINR = 0;

    for (const conv of conversions) {
      if (conv.status === 'approved' || conv.status === 'settled') {
        confirmedOrderValueINR += conv.orderAmountINR;
        confirmedCommissionINR += conv.commissionAmountINR;
        const r = conv.retailerName || 'Verified Merchant';
        if (!retailerMap[r]) {
          retailerMap[r] = { clicks: 0, projected: 0, confirmed: 0 };
        }
        retailerMap[r].confirmed += conv.commissionAmountINR;
      }
      if (conv.status === 'settled') {
        settledPayoutsINR += conv.commissionAmountINR;
      }
    }

    const topRetailers = Object.entries(retailerMap)
      .map(([retailerName, stats]) => ({
        retailerName,
        clicks: stats.clicks,
        projectedCommissionINR: Math.round(stats.projected * 100) / 100,
        confirmedCommissionINR: Math.round(stats.confirmed * 100) / 100,
        sharePct: totalClicks > 0 ? Math.round((stats.clicks / totalClicks) * 100) : 0,
      }))
      .sort((a, b) => b.clicks - a.clicks);

    const averageCommissionPct =
      directedCartVolumeINR > 0
        ? Math.round((estimatedPotentialCommissionINR / directedCartVolumeINR) * 1000) / 10
        : 3.5;

    const config = this.getPartnerConfig();
    const partnerStatuses: Record<string, { configured: boolean; partnerTag?: string; status: 'verified_partner' | 'unconfigured' }> = {
      'Amazon India': {
        configured: Boolean(config.amazonTag),
        partnerTag: config.amazonTag || undefined,
        status: config.amazonTag ? 'verified_partner' : 'unconfigured',
      },
      'Flipkart': {
        configured: Boolean(config.flipkartAffId),
        partnerTag: config.flipkartAffId || undefined,
        status: config.flipkartAffId ? 'verified_partner' : 'unconfigured',
      },
      'Tata CLiQ': {
        configured: Boolean(config.tataCliqCid),
        partnerTag: config.tataCliqCid || undefined,
        status: config.tataCliqCid ? 'verified_partner' : 'unconfigured',
      },
      'Croma': {
        configured: Boolean(config.cromaUtmSource),
        partnerTag: config.cromaUtmSource || undefined,
        status: config.cromaUtmSource ? 'verified_partner' : 'unconfigured',
      },
      'Myntra': {
        configured: Boolean(config.myntraAffId),
        partnerTag: config.myntraAffId || undefined,
        status: config.myntraAffId ? 'verified_partner' : 'unconfigured',
      },
      'Reliance Digital': {
        configured: Boolean(config.relianceDigitalUtmSource),
        partnerTag: config.relianceDigitalUtmSource || undefined,
        status: config.relianceDigitalUtmSource ? 'verified_partner' : 'unconfigured',
      },
      'Nykaa': {
        configured: Boolean(config.nykaaUtmSource),
        partnerTag: config.nykaaUtmSource || undefined,
        status: config.nykaaUtmSource ? 'verified_partner' : 'unconfigured',
      },
    };

    return {
      totalClicks,
      directedCartVolumeINR: Math.round(directedCartVolumeINR * 100) / 100,
      totalGrossOrderValueINR: Math.round(directedCartVolumeINR * 100) / 100,
      estimatedPotentialCommissionINR: Math.round(estimatedPotentialCommissionINR * 100) / 100,
      totalProjectedCommissionINR: Math.round(estimatedPotentialCommissionINR * 100) / 100,
      confirmedConversionsCount: conversions.filter((c) => c.status === 'approved' || c.status === 'settled').length,
      confirmedOrderValueINR: Math.round(confirmedOrderValueINR * 100) / 100,
      confirmedCommissionINR: Math.round(confirmedCommissionINR * 100) / 100,
      settledPayoutsINR: Math.round(settledPayoutsINR * 100) / 100,
      averageCommissionPct,
      topRetailers,
      partnerStatuses,
      recentClicks: filteredClicks.slice(0, 20),
      recentConversions: conversions.slice(0, 20),
    };
  }

  /**
   * Alias for getEarningsDashboard
   */
  public static async getEarningsSummary(userId?: string): Promise<AffiliateEarningsReport> {
    return this.getEarningsDashboard(userId);
  }
}
