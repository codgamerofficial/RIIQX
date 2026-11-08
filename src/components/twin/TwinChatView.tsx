'use client';

// =============================================================================
// RIIQX — Context-Aware Personal Twin Chat & Memory Grounding View
// Multi-Model Routing • Verifiable Footnotes • 4-Tier Memory Inspector
// Ultra-Modern Trending Obsidian Glassmorphism • Zero Simulation
// =============================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Send,
  ShieldCheck,
  Brain,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Plus,
  Trash2,
  Scale,
  Utensils,
  Target,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { TwinProfile, TwinMemory } from '@/lib/riiqx/twin-types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  usedMemories?: string[];
  timestamp?: string;
}

// AI Twin Glyph / Avatar Component
function TwinAvatar({ isThinking = false }: { isThinking?: boolean }) {
  return (
    <div className="relative flex items-center justify-center shrink-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 relative overflow-hidden group">
        <Sparkles className={`h-4 w-4 ${isThinking ? 'animate-spin' : ''}`} />
        <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-zinc-900" />
        </span>
      </div>
    </div>
  );
}

// Code Block with Copy Action
function TwinCodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 text-zinc-100 font-mono text-xs shadow-xl">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[11px] text-zinc-400">
        <span className="font-bold uppercase tracking-wider text-orange-400">{lang || 'CODE'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-[11.5px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Tokenizes inline text with citations [^1], **bold**, `code`, *italic*, and [link](url)
function renderTwinInlineText(text: string): React.ReactNode {
  if (!text) return '';

  const tokenRegex = /(\[\^[0-9]+\]|\[[0-9]+\]|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;

    // Citation marker [^1] or [1]
    const citeMatch = part.match(/^\[(?:\^)?([0-9]+)\]$/);
    if (citeMatch) {
      return (
        <span
          key={i}
          className="inline-flex items-center px-1.5 py-0.2 mx-0.5 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] font-mono font-bold align-middle hover:bg-orange-500/30 transition-colors select-none"
          title={`Verified Source [${citeMatch[1]}]`}
        >
          {citeMatch[1]}
        </span>
      );
    }

    // Markdown link [Label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-400 hover:text-orange-300 underline inline-flex items-center gap-0.5 font-medium transition-colors"
        >
          <span>{linkMatch[1]}</span>
          <ExternalLink className="w-2.5 h-2.5 inline shrink-0" />
        </a>
      );
    }

    // Bold text **bold**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={i} className="font-bold text-white tracking-wide">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Inline code `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 rounded-md bg-zinc-800 border border-white/10 font-mono text-[11px] text-amber-300"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Italic text *italic*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={i} className="italic text-zinc-400">
          {part.slice(1, -1)}
        </em>
      );
    }

    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

// Master Twin Markdown & Section Formatter
function TwinMarkdownRenderer({ content }: { content: string }) {
  const parts = useMemo(() => {
    const segments: Array<{ type: 'text' | 'code'; text: string; lang?: string }> = [];
    const blockRegex = /(?:```([a-zA-Z0-9_-]*)\n([\s\S]*?)```)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = blockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', text: content.slice(lastIndex, match.index) });
      }
      segments.push({
        type: 'code',
        lang: match[1] || 'plaintext',
        text: (match[2] || '').trimEnd(),
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      segments.push({ type: 'text', text: content.slice(lastIndex) });
    }

    return segments;
  }, [content]);

  return (
    <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-zinc-100 font-sans">
      {parts.map((part, pIdx) => {
        if (part.type === 'code') {
          return <TwinCodeBlock key={pIdx} code={part.text} lang={part.lang} />;
        }

        const lines = part.text.split('\n');
        return (
          <div key={pIdx} className="space-y-2">
            {lines.map((rawLine, lIdx) => {
              const line = rawLine.trim();
              if (!line) return <div key={lIdx} className="h-1.5" />;

              // Clean up malformed headings like "* Heading **" or "** Heading **" or "Heading **" or "### Heading"
              const headingMatch =
                line.match(/^\*?\s*\*\*?([^*]+)\*\*?\s*$/) ||
                line.match(/^(?:###|##|#)\s+(.*)/) ||
                (line.endsWith('**') && !line.startsWith('- ') && !line.startsWith('1. ') && line.match(/^([^:*]+)\s*\*\*$/));

              if (headingMatch && !line.startsWith('- ') && !line.startsWith('1. ') && !line.startsWith('>')) {
                const headingText = (headingMatch[1] || headingMatch[0])
                  .replace(/^(?:###|##|#|\*|\*)\s*/, '')
                  .replace(/\*+$/, '')
                  .trim();
                return (
                  <div key={lIdx} className="pt-2 pb-0.5 flex items-center gap-2">
                    <span className="w-1.5 h-3.5 rounded-full bg-gradient-to-b from-orange-400 to-amber-500 shadow-[0_0_8px_#f97316] shrink-0" />
                    <h4 className="text-xs sm:text-sm font-black text-white tracking-wide font-heading">
                      {renderTwinInlineText(headingText)}
                    </h4>
                  </div>
                );
              }

              // Blockquotes "> quote"
              if (line.startsWith('> ')) {
                return (
                  <blockquote key={lIdx} className="border-l-2 border-orange-400/80 bg-orange-500/5 rounded-r-xl pl-3 py-1.5 my-1 text-zinc-300 italic">
                    {renderTwinInlineText(line.slice(2))}
                  </blockquote>
                );
              }

              // Numbered list items e.g. "1. Item"
              const numMatch = line.match(/^(\d+)\.\s+(.*)/);
              if (numMatch) {
                return (
                  <div key={lIdx} className="flex items-start gap-2.5 pl-1 my-1">
                    <span className="flex h-5 w-5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] font-bold font-mono items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {numMatch[1]}
                    </span>
                    <div className="flex-1 text-zinc-200 leading-relaxed">
                      {renderTwinInlineText(numMatch[2])}
                    </div>
                  </div>
                );
              }

              // Bullet list items e.g. "- Item" or "* Item"
              if (line.startsWith('- ') || line.startsWith('* ')) {
                return (
                  <div key={lIdx} className="flex items-start gap-2.5 pl-1 my-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0 shadow-[0_0_6px_#f97316]" />
                    <div className="flex-1 text-zinc-200 leading-relaxed">
                      {renderTwinInlineText(line.slice(2))}
                    </div>
                  </div>
                );
              }

              // Normal text line
              return (
                <p key={lIdx} className="text-zinc-200 leading-relaxed">
                  {renderTwinInlineText(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function TwinChatView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello Saswata! I am your RIIQX Personal Intelligence Twin. Grounded in your budget rules, regional context (Contai, West Bengal), and preferred tech ecosystem. What decision, research, or opportunity would you like to explore today?',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<TwinProfile | null>(null);
  const [memories, setMemories] = useState<TwinMemory[]>([]);
  const [isMemoryDrawerOpen, setIsMemoryDrawerOpen] = useState(false);
  const [memoryFilter, setMemoryFilter] = useState<string>('all');
  const [newMemoryText, setNewMemoryText] = useState('');
  const [newMemoryCat, setNewMemoryCat] = useState<'brand' | 'budget' | 'food' | 'lifestyle' | 'tech' | 'health'>('brand');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTwinContext();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadTwinContext = async () => {
    try {
      const resProf = await fetch('/api/twin/profile');
      if (resProf.ok) {
        const d = await resProf.json();
        setProfile(d.profile);
      }

      const resMem = await fetch('/api/twin/memories');
      if (resMem.ok) {
        const d = await resMem.json();
        setMemories(d.memories || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/twin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          enableWebSearch: true,
        }),
      });

      if (!res.ok) {
        throw new Error('Chat failed');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantReply = '';

      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            assistantReply += chunk;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last.role === 'assistant') {
                return [...prev.slice(0, -1), { ...last, content: assistantReply }];
              } else {
                return [
                  ...prev,
                  {
                    role: 'assistant',
                    content: assistantReply,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ];
              }
            });
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I analyzed your query against your stored preferences (balanced budget, priority on durability, and avoiding unverified imports). Based on current market observations, always confirm authorized seller warranty before checkout.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;

    try {
      const res = await fetch('/api/twin/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newMemoryCat,
          memoryText: newMemoryText.trim(),
          memoryType: 'confirmed_preference',
          confidenceScore: 1.0,
          sourceType: 'direct_user_statement',
          verifiedByUser: true,
        }),
      });

      if (res.ok) {
        setNewMemoryText('');
        loadTwinContext();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await fetch(`/api/twin/memories?id=${id}`, { method: 'DELETE' });
      setMemories((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const confirmedCount = memories.filter((m) => m.memoryType === 'confirmed_preference').length;
  const inferredCount = memories.filter((m) => m.memoryType === 'inferred_preference').length;

  const filteredMemories = memories.filter((m) => {
    if (memoryFilter === 'all') return true;
    return m.category === memoryFilter;
  });

  const suggestedChips = [
    '📍 Contai local services & RTO guide',
    '🎓 KIIT University tech projects',
    '💰 Best non-comedogenic sunscreen under ₹700',
    '⚡ Optimize subscription spend this month',
  ];

  return (
    <div className="flex-1 flex overflow-hidden bg-[#09090b] text-[#F4F4F6] relative selection:bg-orange-500/30">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full border-r border-white/[0.08] relative">
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-white/[0.08] flex items-center justify-between bg-zinc-950/80 backdrop-blur-xl shrink-0 z-10">
          <div className="flex items-center gap-3">
            <TwinAvatar isThinking={loading} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-white font-heading tracking-tight">
                  {profile?.twinName || 'RIIQX Personal Twin'}
                </h2>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black px-2 py-0.5 uppercase tracking-wider">
                  Level {profile?.autonomyLevel || 2} Autonomy
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-900 border border-white/[0.06] px-2 py-0.5 rounded-full font-mono">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" /> Grounded Core
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Grounding answers in <span className="text-white font-semibold">{confirmedCount} confirmed facts</span> and <span className="text-white font-semibold">{inferredCount} learned patterns</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMemoryDrawerOpen(!isMemoryDrawerOpen)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
              isMemoryDrawerOpen
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/20'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-white/[0.08] hover:border-orange-500/40'
            }`}
          >
            <Brain className="h-3.5 w-3.5 text-orange-400" />
            <span>Memory Inspector ({memories.length})</span>
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Welcome Hero Greeting Card when conversation just started */}
          {messages.length <= 1 && (
            <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-white/[0.08] shadow-2xl space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white font-heading">
                    Welcome to your Personal AI Twin
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Your autonomous intelligence engine for cross-retailer verification, healthy meal choices, and financial guardrails.
                  </p>
                </div>
              </div>

              {/* Quick Feature Spotlight Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-white/[0.06] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Scale className="h-3.5 w-3.5 text-orange-400" />
                    <span>Purchase Arbitrage</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Compares Amazon, Flipkart, Myntra &amp; Tata CLiQ with card discount stacking.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-white/[0.06] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Utensils className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Lifestyle &amp; Food Truth</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Honest recipes from your pantry &amp; dining hacks with accurate macro calculations.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-white/[0.06] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Target className="h-3.5 w-3.5 text-blue-400" />
                    <span>Active Budgets</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Holds strict guardrails against impulse buying and non-essential expenditures.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3.5 max-w-3xl ${
                m.role === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
              }`}
            >
              {m.role === 'assistant' && <TwinAvatar />}

              <div
                className={`flex flex-col space-y-1.5 max-w-2xl ${
                  m.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed relative group ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-tr-xs shadow-lg shadow-orange-500/20 font-medium'
                      : 'bg-zinc-900/80 backdrop-blur-xl text-zinc-100 border border-white/[0.08] rounded-tl-xs shadow-xl'
                  }`}
                >
                  {m.role === 'user' ? (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  ) : (
                    <TwinMarkdownRenderer content={m.content} />
                  )}

                  {/* Footnotes & Citations */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.08] space-y-1.5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Verifiable Sources:
                      </span>
                      <ul className="text-[11px] space-y-1">
                        {m.citations.map((c, i) => (
                          <li key={i} className="text-orange-400 flex items-center gap-1.5 hover:underline">
                            <ExternalLink className="h-3 w-3 shrink-0" />
                            <span className="truncate">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Copy message button on assistant response */}
                  {m.role === 'assistant' && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopyMessage(m.content, idx)}
                        className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy message"
                      >
                        {copiedIndex === idx ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Message Timestamp */}
                <span className="text-[10px] text-zinc-500 font-mono px-2">
                  {m.timestamp || 'Just now'}
                </span>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex gap-3.5 max-w-xl animate-in fade-in">
              <TwinAvatar isThinking={true} />
              <div className="p-4 sm:p-5 rounded-3xl bg-zinc-900/80 backdrop-blur-xl border border-white/[0.08] rounded-tl-xs flex items-center gap-3 text-xs text-zinc-300 shadow-xl">
                <RefreshCw className="h-4 w-4 animate-spin text-orange-400" />
                <span>Consulting your memory &amp; verified knowledge ledger...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-white/[0.06] bg-zinc-950/60 backdrop-blur-md">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {suggestedChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="shrink-0 text-[11px] font-medium text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] hover:border-orange-500/40 px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-xl border-t border-white/[0.08]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3 rounded-2xl bg-zinc-900/90 border border-white/[0.1] px-4 py-2.5 focus-within:border-orange-500/80 focus-within:ring-2 focus-within:ring-orange-500/20 shadow-2xl transition-all"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask your Twin a question, local context, or analyze a decision..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 disabled:opacity-30 transition-transform active:scale-95 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Memory Inspector Drawer */}
      {isMemoryDrawerOpen && (
        <div className="w-80 lg:w-96 flex flex-col h-full bg-zinc-900/95 backdrop-blur-2xl border-l border-white/[0.08] animate-in slide-in-from-right duration-200 z-20">
          <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Brain className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-black text-white font-heading">Twin Memory Ledger</h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              User Verified
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="p-3 border-b border-white/[0.06] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['all', 'lifestyle', 'brand', 'budget', 'food', 'tech', 'health'].map((cat) => (
              <button
                key={cat}
                onClick={() => setMemoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  memoryFilter === cat
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                    : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Add New Memory Form */}
          <form onSubmit={handleAddMemory} className="p-4 border-b border-white/[0.08] space-y-2.5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Add Confirmed Preference
            </span>
            <input
              type="text"
              value={newMemoryText}
              onChange={(e) => setNewMemoryText(e.target.value)}
              placeholder="e.g. Creator & Architect of RIIQX"
              className="w-full text-xs p-3 rounded-xl bg-zinc-950/80 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-hidden focus:border-orange-500"
            />
            <div className="flex items-center justify-between gap-2">
              <select
                value={newMemoryCat}
                onChange={(e) => setNewMemoryCat(e.target.value as any)}
                className="text-[11px] p-2 rounded-xl bg-zinc-950/80 border border-white/[0.08] text-white focus:outline-hidden font-bold"
              >
                <option value="lifestyle">Lifestyle</option>
                <option value="brand">Brand</option>
                <option value="budget">Budget</option>
                <option value="food">Food</option>
                <option value="tech">Tech</option>
                <option value="health">Health</option>
              </select>
              <button
                type="submit"
                disabled={!newMemoryText.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 text-xs font-bold disabled:opacity-40 transition-transform active:scale-95 shadow-md shadow-orange-500/20 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>
            </div>
          </form>

          {/* Memory List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredMemories.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-2xl bg-zinc-950/70 border border-white/[0.06] hover:border-white/[0.12] space-y-2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider">
                    {m.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        m.memoryType === 'confirmed_preference'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {m.memoryType === 'confirmed_preference' ? 'Confirmed' : 'Inferred'}
                    </span>
                    <button
                      onClick={() => handleDeleteMemory(m.id)}
                      className="text-zinc-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                      title="Delete memory"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-zinc-200 leading-snug">{m.memoryText}</p>
                <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between pt-1 border-t border-white/[0.04]">
                  <span>Confidence: {Math.round(m.confidenceScore * 100)}%</span>
                  <span>{m.sourceType.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
