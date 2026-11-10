import { NextRequest, NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';
import { Track } from '@/types/music';

// =============================================================================
// RIIQX MUSIC — AI DJ & Music Intelligence Copilot API
// Powered by Groq Ultra-Fast LLM (qwen/qwen3.8-27b) & OpenRouter Multi-Model
// =============================================================================

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const DES_KEY = '38346591';

function decryptSaavnUrl(enc?: string | null): string | null {
  if (!enc) return null;
  try {
    const key = CryptoJS.enc.Utf8.parse(DES_KEY);
    const d = CryptoJS.DES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(enc) }, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    const s = d.toString(CryptoJS.enc.Utf8);
    if (!s || !s.startsWith('http')) return null;
    return s.replace('_96.mp4', '_320.mp4').replace('_160.mp4', '_320.mp4');
  } catch {
    return null;
  }
}

async function searchTrackOnline(query: string): Promise<Track | null> {
  try {
    const url = `https://www.jiosaavn.com/api.php?__call=search.getResults&q=${encodeURIComponent(
      query
    )}&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=3&p=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return null;
    const data = await res.json();
    const item = data.results?.[0];
    if (!item) return null;

    const stream = decryptSaavnUrl(item.more_info?.encrypted_media_url);
    if (!stream) return null;

    const img = (item.image || '').replace('150x150', '500x500');

    return {
      id: `saavn_${item.id}`,
      title: (item.title || 'Unknown').replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
      artist: (item.subtitle || item.more_info?.music || 'Artist').replace(/&amp;/g, '&'),
      album: (item.more_info?.album || 'Single').replace(/&amp;/g, '&'),
      durationMs: parseInt(item.more_info?.duration || '200', 10) * 1000,
      audioUrl: stream,
      artworkUrl: img || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      year: parseInt(item.year || '2026', 10),
      bitrateKbps: 320,
      format: '320kbps AI Pick',
      isFavorite: false,
    };
  } catch {
    return null;
  }
}

async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  // 1. Try Groq (Ultra-fast 200ms)
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
    }
  } catch (e) {
    console.warn('Groq AI DJ fallback:', e);
  }

  // 2. Fallback to OpenRouter Llama 3.3 70B
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content || '';
    }
  } catch (e) {
    console.warn('OpenRouter fallback failed:', e);
  }

  return 'Sorry, AI DJ is currently tuning its synthesizers. Please try again in a moment!';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, mode = 'playlist', currentTrackTitle, currentTrackArtist, lyricsText } = body;

    if (!prompt && mode !== 'lyrics' && mode !== 'radio_host') {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    // MODE 1: LYRICS EXPLANATION & TRANSLATION
    if (mode === 'lyrics') {
      const systemPrompt = `You are RIIQX AI Music Scholar. Analyze the provided song lyrics. 
Explain the story, mood, emotional depth, and provide a clear translation (if Hindi/Punjabi/Spanish/Bengali, translate into English and natural Bengali). 
Format cleanly with markdown sections:
### 🌟 Song Story & Meaning
### 🎭 Emotional Vibe
### 📝 Key Lines Breakdown & Translation`;

      const userMsg = `Track: "${currentTrackTitle}" by ${currentTrackArtist}\nLyrics:\n${lyricsText || 'No lyrics provided'}`;
      const response = await callAI(systemPrompt, userMsg);
      return NextResponse.json({ success: true, mode: 'lyrics', explanation: response });
    }

    // MODE 2: AI RADIO HOST INTRO (LIVE DJ VOICE)
    if (mode === 'radio_host') {
      const systemPrompt = `You are "DJ Riiqx", an energetic, ultra-cool live radio host on RIIQX Music Radio (like Apple Music 1 or BBC Radio 1).
You are introducing the upcoming track.
Keep it punchy, charismatic, fun, and exactly 1 to 2 sentences (under 30 words).
Mention the track title and artist with excitement.
Do not use quotes or emojis, write plain spoken English so text-to-speech can read it naturally.`;

      const userMsg = `Upcoming song: "${currentTrackTitle}" by ${currentTrackArtist}. Introduce it with maximum hype!`;
      const hostVoiceScript = await callAI(systemPrompt, userMsg);
      return NextResponse.json({
        success: true,
        mode: 'radio_host',
        speechText: hostVoiceScript.replace(/["*]/g, '').trim(),
      });
    }

    // MODE 3: AI PLAYLIST & VIBE GENERATOR
    if (mode === 'playlist') {
      const systemPrompt = `You are RIIQX AI DJ, an elite music curator specializing in global, Bollywood, Punjabi, Pop, and Electronic tracks.
The user wants a playlist based on a vibe, mood, or request.
Recommend 4 to 6 unique real, iconic songs.
Return ONLY a valid JSON array of objects with keys: "title", "artist", and "vibe" (brief 1-sentence reason).
Do not include duplicate songs.
Do not include markdown or backticks in your output.`;

      const rawJson = await callAI(systemPrompt, prompt);
      let parsedSongs: { title: string; artist: string; vibe: string }[] = [];

      try {
        const cleaned = rawJson.replace(/```json/gi, '').replace(/```/g, '').trim();
        parsedSongs = JSON.parse(cleaned);
      } catch {
        // Fallback: simple text parsing
        parsedSongs = [
          { title: 'High Rated Gabru', artist: 'Guru Randhawa', vibe: 'High-energy party hit' },
          { title: 'Kesariya', artist: 'Arijit Singh', vibe: 'Soulful melody' },
          { title: 'Paris', artist: 'The Chainsmokers', vibe: 'Classic electropop feel' },
        ];
      }

      // Fetch real 320kbps streams for each recommended track with deduplication
      const tracks: Track[] = [];
      const seenTitles = new Set<string>();

      for (const s of parsedSongs) {
        const key = `${s.title.toLowerCase().trim()}_${s.artist.toLowerCase().trim()}`;
        if (seenTitles.has(key)) continue;
        seenTitles.add(key);

        const fullTrack = await searchTrackOnline(`${s.title} ${s.artist}`);
        if (fullTrack) {
          const trackKey = fullTrack.title.toLowerCase().trim();
          if (!seenTitles.has(trackKey)) {
            seenTitles.add(trackKey);
            tracks.push(fullTrack);
          }
        }
      }

      return NextResponse.json({
        success: true,
        mode: 'playlist',
        userQuery: prompt,
        commentary: `Here is your custom curated AI DJ mix: "${prompt}"`,
        tracks,
      });
    }

    // MODE 3: GENERAL AI DJ CHAT
    const systemPrompt = `You are RIIQX AI DJ, a charismatic, enthusiastic music producer and curator.
Help the user with music knowledge, artist discography, album history, and sound design. Respond concisely and warmly.`;

    const chatReply = await callAI(systemPrompt, prompt);
    return NextResponse.json({ success: true, mode: 'chat', reply: chatReply });
  } catch (error: any) {
    console.error('[API /api/music/ai-dj] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

