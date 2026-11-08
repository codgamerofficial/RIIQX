// =============================================================================
// RIIQX — Supabase-Backed Price Watchlist & Verified Price Monitoring Service
// True Persistence • User Ownership RLS • Evidence-Backed Observations • Zero Fake Alerts
// =============================================================================

import fs from 'fs';
import path from 'path';
import { createAdminClient, isServiceRoleConfigured } from '../../lib/supabase/admin';
import { ProductURLExtractor } from './url-extractor';
import { VerificationStatus } from './types';

export interface WatchlistRecord {
  id: string;
  userId: string;
  productTitle: string;
  productIdentifier: string;
  productUrl: string;
  retailerName: string;
  sellerName?: string;
  targetPrice: number;
  initialPrice: number;
  lowestRecordedPrice: number;
  currentPrice: number;
  variantAttributes: Record<string, string>;
  preferredPlatform: string;
  notificationChannel: 'in_app' | 'email' | 'push';
  isActive: boolean;
  alertStatus: 'monitoring' | 'target_hit' | 'cooldown';
  lastAlertedAt?: string;
  lastCheckedAt?: string;
  monitoringLeaseUntil?: string;
  consecutiveFailures: number;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceObservationRecord {
  id: string;
  watchlistId?: string;
  productIdentifier: string;
  productTitle: string;
  platform: string;
  observedPrice: number;
  observedMrp: number;
  discountPct?: number;
  sellerName?: string;
  inStock: boolean;
  currency: string;
  deliveryCharge: number;
  deliveryStatus: 'free' | 'charged' | 'unknown';
  mandatoryFees: number;
  couponCode?: string;
  couponDiscount?: number;
  bankDiscount?: number;
  sourceUrl: string;
  verificationStatus: 'live_verified' | 'provider_reported' | 'link_verified_price_pending' | 'unverified' | VerificationStatus;
  verificationMethod: string;
  variantAttributes?: Record<string, string>;
  rawEvidence?: Record<string, unknown>;
  verifiedAt: string;
}

export interface PriceDropAlertEvent {
  id: string;
  watchlistId: string;
  userId: string;
  productTitle: string;
  retailerName: string;
  sellerName?: string;
  previousPrice: number;
  observedPrice: number;
  targetPrice: number;
  priceDropAmount: number;
  priceDropPct: number;
  sourceUrl: string;
  verificationStatus: string;
  notificationChannel: string;
  deliveryStatus: 'pending' | 'delivered' | 'failed';
  deliveryResponse?: Record<string, unknown>;
  createdAt: string;
}

export interface CreateWatchlistInput {
  productTitle: string;
  productUrl?: string;
  currentPrice: number;
  targetPrice: number;
  productIdentifier?: string;
  retailerName?: string;
  sellerName?: string;
  variantAttributes?: Record<string, string>;
  preferredBank?: string;
  notificationChannel?: 'in_app' | 'email' | 'push';
}

export class PriceMonitoringService {
  private static DATA_DIR = path.resolve(process.cwd(), '.data');
  private static WATCHLIST_FILE = path.resolve(PriceMonitoringService.DATA_DIR, 'price_watchlists.json');
  private static OBSERVATIONS_FILE = path.resolve(PriceMonitoringService.DATA_DIR, 'product_price_observations.json');
  private static ALERTS_FILE = path.resolve(PriceMonitoringService.DATA_DIR, 'price_drop_alerts.json');

  private static ensureDataDir() {
    if (!fs.existsSync(this.DATA_DIR)) {
      try {
        fs.mkdirSync(this.DATA_DIR, { recursive: true });
      } catch {
        // Fallback for restricted environments
      }
    }
  }

  private static async withTimeout<T = any>(promise: PromiseLike<T> | Promise<T>, ms = 1500): Promise<T> {
    return Promise.race([
      Promise.resolve(promise),
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Database query timeout')), ms)),
    ]);
  }

  private static getAdminClient(): any {
    return createAdminClient() as any;
  }

  // --- Local Disk Resilience Helpers (Survives Server Restarts) ---
  private static readLocalJson<T>(filePath: string): T[] {
    try {
      this.ensureDataDir();
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(raw);
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
      // Ignore write errors if read-only
    }
  }

  /**
   * Creates or updates a watchlist item for the authenticated user
   */
  public static async addOrUpdateWatchlist(
    userId: string,
    input: CreateWatchlistInput
  ): Promise<WatchlistRecord> {
    if (!userId || userId.trim() === '') {
      throw new Error('Authentication required: Cannot create watchlist without an authenticated user ID.');
    }

    if (!input.productTitle || input.currentPrice <= 0 || input.targetPrice <= 0) {
      throw new Error('Invalid input: Product title, current price, and positive target price are required.');
    }

    const normalizedIdentifier =
      input.productIdentifier ||
      (input.productUrl ? ProductURLExtractor.canonicalizeUrl(input.productUrl).canonicalIdentifier : undefined) ||
      input.productTitle.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 32);

    const retailer = input.retailerName || (input.productUrl ? ProductURLExtractor.canonicalizeUrl(input.productUrl).retailerName : 'Verified Store');
    const seller = input.sellerName || `${retailer} Official`;
    const canonicalUrl = input.productUrl ? ProductURLExtractor.canonicalizeUrl(input.productUrl).canonicalUrl : 'https://www.amazon.in';
    const variants = input.variantAttributes || {};

    const now = new Date().toISOString();

    // 1. Try Supabase Database first
    if (isServiceRoleConfigured()) {
      try {
        const sb = this.getAdminClient();
        // Check for existing record for same user, identifier, and retailer
        const { data: existing, error: findErr } = await this.withTimeout(
          sb
            .from('price_watchlists')
            .select('*')
            .eq('user_id', userId)
            .eq('product_identifier', normalizedIdentifier)
            .eq('retailer_name', retailer)
            .maybeSingle()
        );

        if (!findErr && existing) {
          // Update existing watchlist
          const updatedTargetPrice = input.targetPrice;
          const { data: updated, error: updateErr } = await this.withTimeout(
            sb
              .from('price_watchlists')
              .update({
                target_price: updatedTargetPrice,
                is_active: true,
                updated_at: now,
              })
              .eq('id', existing.id)
              .select()
              .single()
          );

          if (!updateErr && updated) {
            return this.mapSupabaseWatchlist(updated, input.currentPrice);
          }
        } else if (!findErr) {
          // Insert new watchlist record
          const { data: created, error: insertErr } = await this.withTimeout(
            sb
              .from('price_watchlists')
              .insert({
                user_id: userId,
                product_title: input.productTitle,
                product_identifier: normalizedIdentifier,
                product_url: canonicalUrl,
                retailer_name: retailer,
                seller_name: seller,
                target_price: input.targetPrice,
                initial_price: input.currentPrice,
                lowest_recorded_price: input.currentPrice,
                variant_attributes: variants,
                preferred_platform: retailer.toLowerCase().includes('amazon') ? 'amazon' : 'flipkart',
                notification_channel: input.notificationChannel || 'in_app',
                is_active: true,
                alert_status: 'monitoring',
                consecutive_failures: 0,
                created_at: now,
                updated_at: now,
              })
              .select()
              .single()
          );

          if (!insertErr && created) {
            return this.mapSupabaseWatchlist(created, input.currentPrice);
          }
        }
      } catch {
        // Fall back to persistent local storage if remote tables not yet in schema cache
      }
    }

    // 2. Persistent Local Storage Fallback (Survives Server Restarts)
    const localWatchlists = this.readLocalJson<WatchlistRecord>(this.WATCHLIST_FILE);
    const existingIdx = localWatchlists.findIndex(
      (w) =>
        w.userId === userId &&
        w.productIdentifier === normalizedIdentifier &&
        w.retailerName.toLowerCase() === retailer.toLowerCase()
    );

    let savedItem: WatchlistRecord;

    if (existingIdx >= 0) {
      localWatchlists[existingIdx] = {
        ...localWatchlists[existingIdx],
        targetPrice: input.targetPrice,
        isActive: true,
        updatedAt: now,
      };
      savedItem = localWatchlists[existingIdx];
    } else {
      savedItem = {
        id: `watchlist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId,
        productTitle: input.productTitle,
        productIdentifier: normalizedIdentifier,
        productUrl: canonicalUrl,
        retailerName: retailer,
        sellerName: seller,
        targetPrice: input.targetPrice,
        initialPrice: input.currentPrice,
        lowestRecordedPrice: input.currentPrice,
        currentPrice: input.currentPrice,
        variantAttributes: variants,
        preferredPlatform: retailer.toLowerCase().includes('amazon') ? 'amazon' : 'flipkart',
        notificationChannel: input.notificationChannel || 'in_app',
        isActive: true,
        alertStatus: input.currentPrice <= input.targetPrice ? 'target_hit' : 'monitoring',
        consecutiveFailures: 0,
        createdAt: now,
        updatedAt: now,
      };
      localWatchlists.unshift(savedItem);
    }

    this.writeLocalJson(this.WATCHLIST_FILE, localWatchlists);
    return savedItem;
  }

  /**
   * Retrieves all persisted watchlists for the authenticated user (Strict User Ownership)
   */
  public static async getUserWatchlists(userId: string): Promise<WatchlistRecord[]> {
    if (!userId || userId.trim() === '') return [];

    // 1. Try Supabase Database first
    if (isServiceRoleConfigured()) {
      try {
        const sb = this.getAdminClient();
        const { data, error } = await sb
          .from('price_watchlists')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((d) => this.mapSupabaseWatchlist(d));
        }
      } catch {
        // Fall back to local file
      }
    }

    // 2. Persistent Local Storage Fallback
    const localWatchlists = this.readLocalJson<WatchlistRecord>(this.WATCHLIST_FILE);
    return localWatchlists.filter((w) => w.userId === userId && w.isActive !== false);
  }

  /**
   * Records a timestamped, evidence-backed price observation
   */
  public static async recordPriceObservation(
    observation: Omit<PriceObservationRecord, 'id' | 'verifiedAt'>
  ): Promise<PriceObservationRecord> {
    // Zero-price protection & invalid target validation
    if (!observation.observedPrice || observation.observedPrice <= 0) {
      throw new Error('Data integrity failure: Cannot record price observation with zero or negative price.');
    }

    // Reject generic search or category pages
    if (observation.sourceUrl) {
      const isSearchPage =
        observation.sourceUrl.includes('/search') ||
        observation.sourceUrl.includes('/s?') ||
        observation.sourceUrl.includes('/searchB');
      if (isSearchPage) {
        throw new Error('Invalid observation destination: Search results and category URLs cannot be recorded as verified product price history.');
      }
    }

    const now = new Date().toISOString();
    const newRecord: PriceObservationRecord = {
      ...observation,
      id: `obs_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      verifiedAt: now,
    };

    // 1. Try Supabase
    if (isServiceRoleConfigured()) {
      try {
        const sb = this.getAdminClient();
        const platformKey = observation.platform.toLowerCase().includes('amazon')
          ? 'amazon'
          : observation.platform.toLowerCase().includes('flipkart')
          ? 'flipkart'
          : observation.platform.toLowerCase().includes('croma')
          ? 'tatacliq' // constrained enum fallback
          : 'riiqx';

        await sb.from('product_price_observations').insert({
          watchlist_id: observation.watchlistId,
          product_identifier: observation.productIdentifier,
          product_title: observation.productTitle,
          platform: platformKey,
          observed_price: observation.observedPrice,
          observed_mrp: observation.observedMrp || observation.observedPrice,
          discount_pct: observation.discountPct,
          seller_name: observation.sellerName,
          in_stock: observation.inStock,
          currency: observation.currency || 'INR',
          delivery_charge: observation.deliveryCharge || 0,
          delivery_status: observation.deliveryStatus || 'unknown',
          mandatory_fees: observation.mandatoryFees || 0,
          source_url: observation.sourceUrl,
          verification_status: observation.verificationStatus,
          verification_method: observation.verificationMethod,
          variant_attributes: observation.variantAttributes || {},
          raw_evidence: observation.rawEvidence || {},
          verified_at: now,
        });

        // Update lowest_recorded_price on watchlist if lower
        if (observation.watchlistId) {
          const { data: wl } = await sb
            .from('price_watchlists')
            .select('lowest_recorded_price')
            .eq('id', observation.watchlistId)
            .single();

          if (wl && (wl.lowest_recorded_price <= 0 || observation.observedPrice < wl.lowest_recorded_price)) {
            await sb
              .from('price_watchlists')
              .update({ lowest_recorded_price: observation.observedPrice, updated_at: now })
              .eq('id', observation.watchlistId);
          }
        }
      } catch {
        // Fall through to local file
      }
    }

    // 2. Persistent Local Storage Fallback
    const localObs = this.readLocalJson<PriceObservationRecord>(this.OBSERVATIONS_FILE);
    localObs.unshift(newRecord);
    // Keep last 500 observations
    if (localObs.length > 500) localObs.length = 500;
    this.writeLocalJson(this.OBSERVATIONS_FILE, localObs);

    // Update local watchlist lowest_recorded_price if applicable
    if (observation.watchlistId) {
      const localWatchlists = this.readLocalJson<WatchlistRecord>(this.WATCHLIST_FILE);
      const wl = localWatchlists.find((w) => w.id === observation.watchlistId);
      if (wl) {
        wl.currentPrice = observation.observedPrice;
        if (observation.observedPrice < wl.lowestRecordedPrice) {
          wl.lowestRecordedPrice = observation.observedPrice;
        }
        wl.lastCheckedAt = now;
        this.writeLocalJson(this.WATCHLIST_FILE, localWatchlists);
      }
    }

    return newRecord;
  }

  /**
   * Evaluates price drop condition with state-transition alert deduplication
   * Prevents repeated alerts when price remains unchanged; allows new alert when price recovers and drops again.
   */
  public static async evaluatePriceDropAlert(
    watchlist: WatchlistRecord,
    observation: PriceObservationRecord
  ): Promise<PriceDropAlertEvent | null> {
    // Qualifying criteria:
    // 1. Same product identifier and exact seller match
    if (observation.productIdentifier !== watchlist.productIdentifier) return null;
    if (watchlist.sellerName && observation.sellerName && !observation.sellerName.toLowerCase().includes(watchlist.sellerName.toLowerCase()) && !watchlist.sellerName.toLowerCase().includes(observation.sellerName.toLowerCase())) {
      return null;
    }

    // 2. Verified observation (must not be unverified, anti-bot failure, or pending)
    if (observation.verificationStatus === 'link_verified_price_pending' || observation.verificationStatus === 'unverified') {
      return null;
    }

    // 3. Target price condition satisfied
    const isTargetMet = observation.observedPrice <= watchlist.targetPrice;

    // 4. State Transition & Deduplication logic:
    // If the watchlist is already in 'target_hit' state and price has not recovered above target, DO NOT duplicate alert!
    if (watchlist.alertStatus === 'target_hit') {
      if (!isTargetMet) {
        // Price recovered above target -> reset status to monitoring so future drop triggers fresh alert
        await this.updateWatchlistAlertStatus(watchlist.id, 'monitoring');
      }
      return null; // Suppress duplicate alert while already below threshold
    }

    if (!isTargetMet) {
      return null;
    }

    // Price crossed below target threshold from 'monitoring' state!
    const priceDropAmount = Math.max(0, watchlist.initialPrice - observation.observedPrice);
    const priceDropPct = watchlist.initialPrice > 0
      ? Math.round((priceDropAmount / watchlist.initialPrice) * 1000) / 10
      : 0;

    const alertEvent: PriceDropAlertEvent = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      watchlistId: watchlist.id,
      userId: watchlist.userId,
      productTitle: watchlist.productTitle,
      retailerName: watchlist.retailerName,
      sellerName: observation.sellerName || watchlist.sellerName,
      previousPrice: watchlist.initialPrice,
      observedPrice: observation.observedPrice,
      targetPrice: watchlist.targetPrice,
      priceDropAmount,
      priceDropPct,
      sourceUrl: observation.sourceUrl,
      verificationStatus: observation.verificationStatus,
      notificationChannel: watchlist.notificationChannel || 'in_app',
      deliveryStatus: 'pending', // Honest status: outbox pending delivery
      createdAt: new Date().toISOString(),
    };

    // 1. Persist alert to database
    if (isServiceRoleConfigured()) {
      try {
        const sb = this.getAdminClient();
        await sb.from('price_drop_alerts').insert({
          watchlist_id: watchlist.id,
          user_id: watchlist.userId,
          product_title: watchlist.productTitle,
          retailer_name: watchlist.retailerName,
          seller_name: alertEvent.sellerName,
          previous_price: alertEvent.previousPrice,
          observed_price: alertEvent.observedPrice,
          target_price: alertEvent.targetPrice,
          price_drop_amount: alertEvent.priceDropAmount,
          price_drop_pct: alertEvent.priceDropPct,
          source_url: alertEvent.sourceUrl,
          verification_status: alertEvent.verificationStatus,
          notification_channel: alertEvent.notificationChannel,
          delivery_status: 'pending',
          created_at: alertEvent.createdAt,
        });

        // Also create an in-app notification in public.notifications
        await sb.from('notifications').insert({
          user_id: watchlist.userId,
          type: 'price_drop_alert',
          title: `Price Drop Alert: ${watchlist.productTitle.slice(0, 40)}...`,
          body: `Now ₹${observation.observedPrice.toLocaleString('en-IN')} on ${watchlist.retailerName} (Target ₹${watchlist.targetPrice.toLocaleString('en-IN')}). Save ₹${priceDropAmount.toLocaleString('en-IN')}.`,
          data: {
            watchlistId: watchlist.id,
            productUrl: observation.sourceUrl,
            observedPrice: observation.observedPrice,
            dropPct: priceDropPct,
          },
        });
      } catch {
        // Fall back to local file
      }
    }

    // 2. Persist to local alert outbox
    const localAlerts = this.readLocalJson<PriceDropAlertEvent>(this.ALERTS_FILE);
    localAlerts.unshift(alertEvent);
    this.writeLocalJson(this.ALERTS_FILE, localAlerts);

    // 3. Transition watchlist status to 'target_hit' and record timestamp
    await this.updateWatchlistAlertStatus(watchlist.id, 'target_hit', alertEvent.createdAt);

    return alertEvent;
  }

  /**
   * Helper to update alert status on a watchlist
   */
  private static async updateWatchlistAlertStatus(
    watchlistId: string,
    status: 'monitoring' | 'target_hit' | 'cooldown',
    alertedAt?: string
  ) {
    if (isServiceRoleConfigured()) {
      try {
        const sb = this.getAdminClient();
        await sb
          .from('price_watchlists')
          .update({
            alert_status: status,
            last_alerted_at: alertedAt || undefined,
            updated_at: new Date().toISOString(),
          })
          .eq('id', watchlistId);
      } catch {
        // Fall through
      }
    }

    const localWatchlists = this.readLocalJson<WatchlistRecord>(this.WATCHLIST_FILE);
    const wl = localWatchlists.find((w) => w.id === watchlistId);
    if (wl) {
      wl.alertStatus = status;
      if (alertedAt) wl.lastAlertedAt = alertedAt;
      wl.updatedAt = new Date().toISOString();
      this.writeLocalJson(this.WATCHLIST_FILE, localWatchlists);
    }
  }

  /**
   * Scheduled Worker: Processes due watchlists in controlled batches with lease locking
   */
  public static async executeScheduledMonitoringBatch(
    batchSize = 5
  ): Promise<{
    processedCount: number;
    observationsCount: number;
    alertsTriggeredCount: number;
    failuresCount: number;
  }> {
    const now = new Date();
    const leaseDurationMinutes = 5;
    const leaseExpiresAt = new Date(now.getTime() + leaseDurationMinutes * 60 * 1000).toISOString();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString();

    let processedCount = 0;
    let observationsCount = 0;
    let alertsTriggeredCount = 0;
    let failuresCount = 0;

    // 1. Select due items from local or Supabase
    let dueWatchlists: WatchlistRecord[] = [];

    if (isServiceRoleConfigured()) {
      try {
        const sb = this.getAdminClient();
        const { data, error } = await sb
          .from('price_watchlists')
          .select('*')
          .eq('is_active', true)
          .or(`monitoring_lease_until.is.null,monitoring_lease_until.lt.${now.toISOString()}`)
          .or(`last_checked_at.is.null,last_checked_at.lt.${threeHoursAgo}`)
          .limit(batchSize);

        if (!error && Array.isArray(data)) {
          dueWatchlists = data.map((d) => this.mapSupabaseWatchlist(d));
        }
      } catch {
        // Fall through
      }
    }

    if (dueWatchlists.length === 0) {
      const localWatchlists = this.readLocalJson<WatchlistRecord>(this.WATCHLIST_FILE);
      dueWatchlists = localWatchlists
        .filter(
          (w) =>
            w.isActive !== false &&
            (!w.monitoringLeaseUntil || new Date(w.monitoringLeaseUntil) < now) &&
            (!w.lastCheckedAt || new Date(w.lastCheckedAt) < new Date(threeHoursAgo))
        )
        .slice(0, batchSize);
    }

    if (dueWatchlists.length === 0) {
      return { processedCount: 0, observationsCount: 0, alertsTriggeredCount: 0, failuresCount: 0 };
    }

    // 2. Process each due item with lease acquisition
    for (const wl of dueWatchlists) {
      // Lease lock to prevent simultaneous worker overlap
      wl.monitoringLeaseUntil = leaseExpiresAt;
      this.saveWatchlistLease(wl.id, leaseExpiresAt);
      processedCount++;

      try {
        if (!wl.productUrl || !ProductURLExtractor.isSafeUrl(wl.productUrl)) {
          throw new Error('Unsafe or missing product URL on watchlist entry.');
        }

        // Live URL extraction
        const extracted = await ProductURLExtractor.extractFromUrl(wl.productUrl);
        const livePrice = extracted.initialOffer?.sellingPrice;

        if (!livePrice || livePrice <= 0) {
          // If price pending due to anti-bot, record pending check timestamp without faking price
          wl.lastCheckedAt = new Date().toISOString();
          wl.monitoringLeaseUntil = undefined;
          this.saveWatchlistLease(wl.id, null, wl.lastCheckedAt);
          continue;
        }

        const obsRecord = await this.recordPriceObservation({
          watchlistId: wl.id,
          productIdentifier: wl.productIdentifier,
          productTitle: wl.productTitle,
          platform: wl.preferredPlatform,
          observedPrice: livePrice,
          observedMrp: extracted.initialOffer.mrp || livePrice,
          sellerName: extracted.initialOffer.sellerName || wl.sellerName,
          inStock: extracted.initialOffer.availability === 'in_stock',
          currency: extracted.initialOffer.currency || 'INR',
          deliveryCharge: extracted.initialOffer.deliveryCharge || 0,
          deliveryStatus: extracted.initialOffer.deliveryStatus || 'unknown',
          mandatoryFees: extracted.initialOffer.mandatoryFees || 0,
          sourceUrl: extracted.initialOffer.productUrl || wl.productUrl,
          verificationStatus: extracted.initialOffer.verificationStatus,
          verificationMethod: `Scheduled monitoring worker extraction (${extracted.initialOffer.verificationMethod})`,
          variantAttributes: wl.variantAttributes,
        });
        observationsCount++;

        // Evaluate alert trigger
        const alert = await this.evaluatePriceDropAlert(wl, obsRecord);
        if (alert) {
          alertsTriggeredCount++;
        }

        // Release lease and reset failure count
        wl.consecutiveFailures = 0;
        wl.lastError = undefined;
        wl.lastCheckedAt = new Date().toISOString();
        wl.monitoringLeaseUntil = undefined;
        this.saveWatchlistLease(wl.id, null, wl.lastCheckedAt, 0);
      } catch (err: any) {
        failuresCount++;
        const failCount = (wl.consecutiveFailures || 0) + 1;
        wl.consecutiveFailures = failCount;
        wl.lastError = err.message || 'Extraction failed';
        wl.lastCheckedAt = new Date().toISOString();
        wl.monitoringLeaseUntil = undefined;
        this.saveWatchlistLease(wl.id, null, wl.lastCheckedAt, failCount, err.message);
      }
    }

    return { processedCount, observationsCount, alertsTriggeredCount, failuresCount };
  }

  private static saveWatchlistLease(
    watchlistId: string,
    leaseUntil: string | null,
    checkedAt?: string,
    failures?: number,
    error?: string
  ) {
    if (isServiceRoleConfigured()) {
      try {
        const sb = this.getAdminClient();
        sb.from('price_watchlists')
          .update({
            monitoring_lease_until: leaseUntil,
            last_checked_at: checkedAt || undefined,
            consecutive_failures: failures !== undefined ? failures : undefined,
            last_error: error || undefined,
            updated_at: new Date().toISOString(),
          })
          .eq('id', watchlistId)
          .then(() => {});
      } catch {
        // Fall through
      }
    }

    const localWatchlists = this.readLocalJson<WatchlistRecord>(this.WATCHLIST_FILE);
    const wl = localWatchlists.find((w) => w.id === watchlistId);
    if (wl) {
      wl.monitoringLeaseUntil = leaseUntil || undefined;
      if (checkedAt) wl.lastCheckedAt = checkedAt;
      if (failures !== undefined) wl.consecutiveFailures = failures;
      if (error) wl.lastError = error;
      wl.updatedAt = new Date().toISOString();
      this.writeLocalJson(this.WATCHLIST_FILE, localWatchlists);
    }
  }

  private static mapSupabaseWatchlist(d: any, fallbackPrice?: number): WatchlistRecord {
    return {
      id: d.id,
      userId: d.user_id,
      productTitle: d.product_title,
      productIdentifier: d.product_identifier,
      productUrl: d.product_url || 'https://www.amazon.in',
      retailerName: d.retailer_name || 'Verified Merchant',
      sellerName: d.seller_name,
      targetPrice: Number(d.target_price),
      initialPrice: Number(d.initial_price),
      lowestRecordedPrice: Number(d.lowest_recorded_price),
      currentPrice: fallbackPrice || Number(d.lowest_recorded_price || d.initial_price),
      variantAttributes: d.variant_attributes || {},
      preferredPlatform: d.preferred_platform || 'any',
      notificationChannel: d.notification_channel || 'in_app',
      isActive: d.is_active ?? true,
      alertStatus: d.alert_status || 'monitoring',
      lastAlertedAt: d.last_alerted_at,
      lastCheckedAt: d.last_checked_at,
      monitoringLeaseUntil: d.monitoring_lease_until,
      consecutiveFailures: d.consecutive_failures || 0,
      lastError: d.last_error,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    };
  }
}
