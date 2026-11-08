import { NextRequest, NextResponse } from 'next/server';
import { publishProjectToSocial } from '@/lib/riiqx/social/publishing-engine';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { getConnectedAccounts } from '@/lib/riiqx/social/account-repository';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const userId = await resolveAuthUserId(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to publish.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      projectId,
      accountId,
      platform,
      title,
      caption,
      mediaUrl,
      idempotencyKey,
      scheduledFor,
    } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: 'Target social accountId is required. Please connect an account first.' },
        { status: 400 }
      );
    }

    // Verify ownership of target social account
    const accounts = await getConnectedAccounts(userId);
    const hasAccount = accounts.some((a) => a.id === accountId);
    if (!hasAccount) {
      return NextResponse.json(
        { error: 'Unauthorized: Target social account does not belong to the authenticated user.' },
        { status: 403 }
      );
    }

    if (!platform || !['youtube', 'instagram', 'facebook', 'whatsapp', 'twitter', 'linkedin'].includes(platform)) {
      return NextResponse.json(
        { error: "Valid platform ('youtube', 'instagram', 'facebook', 'whatsapp', 'twitter', 'linkedin') is required." },
        { status: 400 }
      );
    }

    if (!title || !caption || !mediaUrl) {
      return NextResponse.json(
        { error: 'title, caption, and mediaUrl are required for social publishing.' },
        { status: 400 }
      );
    }

    const result = await publishProjectToSocial({
      userId,
      projectId,
      accountId,
      platform,
      title,
      caption,
      mediaUrl,
      idempotencyKey,
      scheduledFor,
    });

    return NextResponse.json({
      success: result.success,
      jobId: result.jobId,
      platform: result.platform,
      status: result.status,
      mediaId: result.platformMediaId,
      permalink: result.platformPermalink,
      error: result.errorMessage,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Publishing execution failure';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
