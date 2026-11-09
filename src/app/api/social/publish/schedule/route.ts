import { NextRequest, NextResponse } from 'next/server';
import {
  getScheduledPosts,
  cancelScheduledPost,
  processDueScheduledPosts,
  scheduleSocialPost,
} from '@/lib/riiqx/social/publishing-engine';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userId = await resolveAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }
    const posts = await getScheduledPosts(userId);

    return NextResponse.json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch scheduled posts';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // Action 1: Trigger autonomous processing of due posts (requires CRON_SECRET or authenticated user)
    if (action === 'process_due') {
      const authHeader = req.headers.get('authorization');
      const cronSecret = process.env.CRON_SECRET;
      const isCronAuthorized = cronSecret && (
        authHeader === `Bearer ${cronSecret}` ||
        url.searchParams.get('secret') === cronSecret
      );
      const userId = await resolveAuthUserId(req);

      if (!isCronAuthorized && !userId) {
        return NextResponse.json({ success: false, error: 'Unauthorized: Invalid CRON_SECRET or missing authentication.' }, { status: 401 });
      }

      const summary = await processDueScheduledPosts();
      return NextResponse.json({ success: true, summary });
    }

    const userId = await resolveAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Authentication required to schedule posts.' }, { status: 401 });
    }

    // Action 2: Schedule a new post
    const body = await req.json().catch(() => ({}));
    const {
      projectId,
      accountId,
      platform,
      title,
      caption,
      mediaUrl,
      scheduledFor,
    } = body;

    if (!accountId || !platform || !title || !caption || !mediaUrl || !scheduledFor) {
      return NextResponse.json(
        { error: 'accountId, platform, title, caption, mediaUrl, and scheduledFor are required.' },
        { status: 400 }
      );
    }

    const scheduled = await scheduleSocialPost({
      userId,
      projectId,
      accountId,
      platform,
      title,
      caption,
      mediaUrl,
      scheduledFor,
    });

    return NextResponse.json({
      success: true,
      jobId: scheduled.id,
      scheduledFor: scheduled.scheduled_for,
      status: scheduled.status,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Scheduling operation failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await resolveAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }
    const url = new URL(req.url);
    const jobId = url.searchParams.get('id');

    if (!jobId) {
      return NextResponse.json({ error: 'Scheduled post id is required.' }, { status: 400 });
    }

    const cancelled = await cancelScheduledPost(jobId, userId);
    if (!cancelled) {
      return NextResponse.json({ error: 'Scheduled post not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, jobId, message: 'Post schedule cancelled.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Cancellation failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
