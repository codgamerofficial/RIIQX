// =============================================================================
// RIIQX — Autonomous Deal Shorts & Reels Pipeline Dispatcher
// Automated Watchlist Scanning • Trigger-on-Drop • Physical 9:16 Video Generation
// Verified Affiliate Attribution • Auto-Publishing to YouTube Shorts & Instagram
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { PriceMonitoringService, WatchlistRecord } from '@/services/product-intelligence/price-monitoring-service';
import { DealShortsVideoFactory, DealShortsResult } from './deal-shorts-factory';
import { getConnectedAccounts } from '@/lib/riiqx/social/account-repository';
import { publishProjectToSocial } from '@/lib/riiqx/social/publishing-engine';

export interface AutonomousPipelineRunResult {
  runId: string;
  timestamp: string;
  watchedItemsScanned: number;
  qualifyingDropsFound: number;
  videosGenerated: DealShortsResult[];
  socialPostsQueued: number;
  totalProjectedCommissionINR: number;
  errors: string[];
}

export class AutonomousDealPipeline {
  private static DATA_DIR = path.resolve(process.cwd(), '.data');
  private static LOG_FILE = path.resolve(AutonomousDealPipeline.DATA_DIR, 'autonomous_deal_pipeline_log.json');
  private static GENERATED_KEYS_FILE = path.resolve(AutonomousDealPipeline.DATA_DIR, 'generated_deal_drops.json');

  private static ensureDirs() {
    if (!fs.existsSync(this.DATA_DIR)) {
      try { fs.mkdirSync(this.DATA_DIR, { recursive: true }); } catch {}
    }
  }

  private static readJson<T>(filePath: string): T[] {
    try {
      this.ensureDirs();
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    } catch {}
    return [];
  }

  private static writeJson<T>(filePath: string, data: T[]) {
    try {
      this.ensureDirs();
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch {}
  }

  /**
   * Runs an autonomous sweep across all active watchlists.
   * If a product price dropped by >= 10% below its initial/target price and hasn't had a video made yet,
   * it physically renders the 9:16 MP4 video and queues social publishing!
   */
  public static async runAutonomousSweep(params?: {
    userId?: string;
    minSavingsPct?: number;
    autoPublish?: boolean;
    maxVideosPerRun?: number;
  }): Promise<AutonomousPipelineRunResult> {
    this.ensureDirs();
    const runId = `sweep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const minSavings = params?.minSavingsPct ?? 10; // Default: 10% drop
    const maxVideos = params?.maxVideosPerRun ?? 3;
    const errors: string[] = [];
    const generatedVideos: DealShortsResult[] = [];
    let socialPostsQueued = 0;
    let totalProjectedCommissionINR = 0;

    // 1. Get all active watchlists
    const userId = params?.userId;
    let allWatchlists: WatchlistRecord[] = [];
    try {
      if (userId) {
        allWatchlists = await PriceMonitoringService.getUserWatchlists(userId);
      } else {
        // Background system cron sweep: scan all active watchlists across system
        const localWatchlistsFile = path.resolve(this.DATA_DIR, 'price_watchlists.json');
        allWatchlists = this.readJson<WatchlistRecord>(localWatchlistsFile).filter((w) => w.isActive);
      }
    } catch (err: any) {
      errors.push(`Failed to fetch watchlists: ${err.message}`);
    }

    const previouslyGeneratedDropKeys = new Set(this.readJson<string>(this.GENERATED_KEYS_FILE));

    // 2. Filter for qualifying drops
    const qualifyingItems = allWatchlists.filter((w) => {
      if (!w.isActive || !w.productUrl) return false;
      const initial = Number(w.initialPrice) || Number(w.currentPrice) || 0;
      const current = Number(w.lowestRecordedPrice) || Number(w.currentPrice) || initial;
      if (initial <= 0 || current <= 0 || current >= initial) return false;

      const dropPct = Math.round(((initial - current) / initial) * 100);
      return dropPct >= minSavings;
    });

    // 3. Process up to maxVideos qualifying drops
    for (const item of qualifyingItems.slice(0, maxVideos)) {
      const initial = Number(item.initialPrice) || Number(item.currentPrice);
      const current = Number(item.lowestRecordedPrice) || Number(item.currentPrice);
      const dropKey = `${item.id}_${current}`;

      if (previouslyGeneratedDropKeys.has(dropKey)) {
        continue; // Already synthesized video for this exact drop
      }

      try {
        const video = await DealShortsVideoFactory.generateDealShort({
          productTitle: item.productTitle,
          productIdentifier: item.productIdentifier,
          retailerName: item.retailerName || 'Amazon India',
          originalPrice: initial,
          lowestPrice: current,
          productUrl: item.productUrl,
          category: (item.variantAttributes as any)?.category,
          language: 'en',
          userId: item.userId || userId,
        });

        generatedVideos.push(video);
        totalProjectedCommissionINR += video.projectedCommissionINR;
        previouslyGeneratedDropKeys.add(dropKey);

        // 4. Check for connected social accounts and queue publishing with verified owner
        const targetUserId = item.userId || userId;
        if (params?.autoPublish !== false && targetUserId) {
          try {
            const accounts = await getConnectedAccounts(targetUserId);
            for (const acc of accounts) {
              if (acc.status === 'connected' && (acc.provider === 'youtube' || acc.provider === 'instagram')) {
                await publishProjectToSocial({
                  userId: targetUserId,
                  projectId: video.id,
                  accountId: acc.id,
                  platform: acc.provider,
                  title: video.title,
                  caption: video.caption,
                  mediaUrl: video.videoUrl,
                  idempotencyKey: `auto_pub_${video.id}_${acc.provider}`,
                });
                socialPostsQueued++;
              }
            }
          } catch (pubErr: any) {
            errors.push(`Auto-publish error for ${item.productTitle}: ${pubErr.message}`);
          }
        }
      } catch (genErr: any) {
        errors.push(`Video render error for ${item.productTitle}: ${genErr.message}`);
      }
    }

    // Save updated drop keys
    this.writeJson(this.GENERATED_KEYS_FILE, Array.from(previouslyGeneratedDropKeys));

    const runResult: AutonomousPipelineRunResult = {
      runId,
      timestamp: new Date().toISOString(),
      watchedItemsScanned: allWatchlists.length,
      qualifyingDropsFound: qualifyingItems.length,
      videosGenerated: generatedVideos,
      socialPostsQueued,
      totalProjectedCommissionINR: Math.round(totalProjectedCommissionINR * 100) / 100,
      errors,
    };

    // Save run audit log
    const logs = this.readJson<AutonomousPipelineRunResult>(this.LOG_FILE);
    logs.unshift(runResult);
    this.writeJson(this.LOG_FILE, logs.slice(0, 50));

    return runResult;
  }

  /**
   * Retrieves pipeline audit history
   */
  public static async getPipelineHistory(limit = 20): Promise<AutonomousPipelineRunResult[]> {
    const logs = this.readJson<AutonomousPipelineRunResult>(this.LOG_FILE);
    return logs.slice(0, limit);
  }
}

