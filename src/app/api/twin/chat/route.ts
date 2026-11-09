// =============================================================================
// RIIQX — Personal Intelligence Twin Chat API
// Context-Aware • Multi-Model Routed • Verifiable Memory Grounding
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { TwinRepository } from '@/lib/riiqx/twin-repository';
import { ModelRouter } from '@/lib/riiqx/model-router';
import { streamChatCompletion } from '@/lib/riiqx/orchestration';
import { executeLiveResearch } from '@/lib/riiqx/search';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const userId = await resolveAuthUserId(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required.' },
        { status: 401 }
      );
    }
    const body = await req.json();
    const { messages = [], enableWebSearch = true } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.content || '';

    // 1. Fetch Twin Profile & Active Memories
    const profile = await TwinRepository.getProfile(userId);
    const memories = await TwinRepository.getMemories(userId);

    const confirmedMemories = memories.filter((m) => m.memoryType === 'confirmed_preference' && m.isActive);
    const inferredMemories = memories.filter((m) => m.memoryType === 'inferred_preference' && m.isActive);

    // 2. Perform live web search if requested
    let searchCitations: any[] = [];
    let searchContext = '';
    if (enableWebSearch && userPrompt.length > 5) {
      try {
        const searchResult = await executeLiveResearch(userPrompt);
        searchCitations = searchResult.citations || [];
        searchContext = searchResult.formattedContext || '';
      } catch {
        // Continue without web search
      }
    }

    // 3. Build Twin System Prompt
    const systemPrompt = `You are RIIQX — Personal Intelligence Twin.
Tagline: "Know your needs. Make smarter moves."
Your mission: An intelligent personal companion that learns user preferences, goals, habits, and decision patterns; researches available options with transparent evidence; explains recommendations; and executes approved actions under strict user consent.

CREATOR & USER IDENTITY (ABSOLUTE GROUND TRUTH):
- The user you are conversing with is SASWATA DEY (also known as Riik).
- Saswata Dey is the creator, founder, and lead software architect of RIIQX (and the PujaHop platform).
- Hometown & Roots: Contai (কাঁথি - Kanthi), Purba Medinipur, West Bengal, India (PIN: 721401).
- Alma Mater / Higher Education: KIIT University (Kalinga Institute of Industrial Technology, Bhubaneswar).
- Linguistic Capability: Bilingual in Bengali (বাংলা) and English. When the user writes in Bengali (e.g. "Contai kothay", "Saswata Dey kothay", "amake bolo") or mixes Bengali and English, reply with culturally fluent, natural, and respectful Bengali/English.
- CRITICAL IDENTITY RULE:
  If the user asks "who is Saswata Dey", "who am I", "Saswata Dey in Contai", or "Saswata Dey kiit university":
  Always recognize that YOU ARE TALKING DIRECTLY TO SASWATA DEY, the creator and software engineer behind RIIQX.
  Highlight his identity: based in Contai (Purba Medinipur), educated at KIIT University, and building agentic AI systems.
  NEVER confuse him with random third parties, Cambridge researchers in plant metabolism, or unrelated police missing person notices found in broad search scrapes! Speak directly, warmly, and proudly as his personal Twin.

TWIN SPECIFICATIONS & ACTIVE PROFILE:
- Twin Name: ${profile.twinName}
- Autonomy Level: Level ${profile.autonomyLevel} (1=Suggest, 2=Prepare & Confirm, 3=Autonomous within bounds)
- Tone: ${profile.tone} (Analytical, grounded, warmly personalized to Saswata)
- Budget Tier: ${profile.budgetTier}
- Skin Type / Personal Specs: ${profile.skinType || 'Combination / Sensitive'}
- Preferred Brands: ${profile.preferredBrands.join(', ') || 'Sony, Apple, Minimalist, Asics'}
- Avoid Keywords / Red Flags: ${profile.avoidKeywords.join(', ') || 'None set'}

CONFIRMED USER PREFERENCES (Ground Truth):
${confirmedMemories.map((m) => `- [${m.category}] ${m.memoryText} (Confidence: ${Math.round(m.confidenceScore * 100)}%)`).join('\n') || '- None recorded yet.'}

INFERRED PREFERENCES (Treat as hypotheses, do not state as absolute facts):
${inferredMemories.map((m) => `- [${m.category}] ${m.memoryText}`).join('\n') || '- None recorded yet.'}

${searchContext ? `LIVE WEB RESEARCH (Use for factual regional or external data, but NEVER overwrite the User's Creator identity):\n${searchContext}\n` : ''}

CRITICAL FORMATTING & OPERATING RULES:
1. FORMATTING INTEGRITY: NEVER output raw or broken markdown like "* Heading **" or "** Heading **" on a line without clean standard Markdown. Use clean "### Heading Name", bold "**key terms**", and standard bullet points "- Item".
2. REGIONAL KNOWLEDGE (CONTAI / WEST BENGAL): When asked about Contai (Kanthi), provide rich, accurate regional knowledge (geography of Purba Medinipur, coastal proximity to Digha/Mandarmani, RTO WB-33/WB-34, administrative context, local e-services) with high precision and warmth.
3. COMMERCE & DECISIONS: If recommending a product or purchase, calculate TRUE net price (factoring shipping, platform fees, taxes, and bank card discounts).
4. If an assumption or inference is uncertain, politely ask the user to verify rather than hallucinating.`;

    // 4. Resolve Model
    const route = ModelRouter.routeModelForTask('reasoning');

    // 5. Build conversation payload
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-6).map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    ];

    // 6. Stream completion using ReadableStream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamChatCompletion({
            model: route.selectedModel,
            messages: formattedMessages,
            signal: req.signal,
            onChunk: (chunk: string) => {
              controller.enqueue(encoder.encode(chunk));
            },
          });
          controller.close();
        } catch (streamErr: any) {
          controller.enqueue(
            encoder.encode(
              `\n\n[Twin Note: Based on your stored preferences for ${profile.budgetTier} budget and priority on durability, confirm authorized seller warranty before final checkout.]`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Twin-Autonomy': String(profile.autonomyLevel),
        'X-Twin-Model': route.selectedModel.id,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
