import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const userId = await resolveAuthUserId(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
  }

  const exportData = {
    exportedAt: new Date().toISOString(),
    system: 'RIIQX Agentic Platform',
    version: '2.0.0',
    userId,
    projects: [
      {
        id: 'prj_starter_intel',
        title: 'Enterprise AI Strategy',
        description: 'Online agent execution, AWS Bedrock integration, and autonomous content generation.',
      },
    ],
    conversations: [],
    tasks: [],
  };

  return NextResponse.json(exportData);
}
