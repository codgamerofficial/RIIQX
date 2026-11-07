'use client';

// =============================================================================
// RIIQX Creator Studio 2.0 — Captions, Metadata & Pre-Publish Quality Gate
// Multi-Platform Fields • AI Hashtag Generator • 10-Point Algorithm Checklist
// Full Obsidian Dark Styling • Zero Mock Data Policy
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  CreatorProject,
  PrePublishCheck,
  CreatorStudioTab,
} from '@/lib/riiqx/creator-types';
import { generatePrePublishChecklist, generateStoryboard } from '@/lib/riiqx/creator-engine';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Youtube,
  Instagram,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  Copy,
  Check,
  Wand2,
  Plus,
  X,
  Info,
} from 'lucide-react';

interface CaptionsMetadataTabProps {
  project: CreatorProject | null;
  onUpdateProject: (updated: CreatorProject) => void;
  onTabChange: (tab: CreatorStudioTab) => void;
}

export function CaptionsMetadataTab({
  project,
  onUpdateProject,
  onTabChange,
}: CaptionsMetadataTabProps) {
  const [checks, setChecks] = useState<PrePublishCheck[]>(() => {
    if (project?.prePublishChecks && project.prePublishChecks.length > 0) {
      return project.prePublishChecks;
    }
    return project ? generatePrePublishChecklist(project) : [];
  });

  const [activePlatformTab, setActivePlatformTab] = useState<'both' | 'youtube' | 'instagram'>('both');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // Editable fields
  const [title, setTitle] = useState(project?.name || '');
  const [caption, setCaption] = useState(project?.storyboard?.caption || '');
  const [hashtags, setHashtags] = useState<string[]>(
    project?.storyboard?.hashtags || ['#AI', '#Shorts', '#ViralReels', '#Automation', '#RIIQX']
  );

  useEffect(() => {
    if (project) {
      setTitle(project.name || '');
      setCaption(project.storyboard?.caption || '');
      setHashtags(project.storyboard?.hashtags || ['#AI', '#Shorts', '#ViralReels', '#Automation', '#RIIQX']);
      setChecks(generatePrePublishChecklist(project));
    }
  }, [project?.id, project?.name, project?.renderedVideoBlobUrl]);

  if (!project) {
    return (
      <div className="flex h-96 flex-col items-center justify-center p-8 text-center text-zinc-500">
        <CheckCircle2 className="h-10 w-10 text-zinc-700 mb-3" />
        <h3 className="text-base font-bold text-white">No Project Selected</h3>
        <p className="text-xs text-zinc-500 mt-1">Select or create a project from Overview to review metadata.</p>
      </div>
    );
  }

  const syncMetadata = (newTitle: string, newCaption: string, newTags: string[]) => {
    const updatedStoryboard = project.storyboard
      ? { ...project.storyboard, caption: newCaption, hashtags: newTags }
      : { ...generateStoryboard(project.brief), caption: newCaption, hashtags: newTags };

    onUpdateProject({
      ...project,
      name: newTitle,
      storyboard: updatedStoryboard,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    syncMetadata(val, caption, hashtags);
  };

  const handleCaptionChange = (val: string) => {
    setCaption(val);
    syncMetadata(title, val, hashtags);
  };

  const handleAddHashtag = (tagToAdd?: string) => {
    let raw = (tagToAdd !== undefined ? tagToAdd : newTagInput).trim();
    if (!raw) return;
    if (!raw.startsWith('#')) raw = `#${raw}`;
    if (!hashtags.includes(raw)) {
      const updated = [...hashtags, raw];
      setHashtags(updated);
      syncMetadata(title, caption, updated);
    }
    setNewTagInput('');
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    const updated = hashtags.filter((t) => t !== tagToRemove);
    setHashtags(updated);
    syncMetadata(title, caption, updated);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleAIGenerateMetadata = () => {
    setIsGeneratingCaptions(true);
    setTimeout(() => {
      const generated = generateStoryboard(project.brief);
      const newTitle = project.name || generated.title || 'Viral Short Reel';
      const newCaption = generated.caption;
      const newTags = generated.hashtags;

      setTitle(newTitle);
      setCaption(newCaption);
      setHashtags(newTags);
      syncMetadata(newTitle, newCaption, newTags);
      setIsGeneratingCaptions(false);
    }, 400);
  };

  const passCount = checks.filter((c) => c.status === 'pass').length;
  const isReadyToPublish = passCount >= 8;

  const handleProceedToQueue = () => {
    const updatedStoryboard = project.storyboard
      ? { ...project.storyboard, caption, hashtags }
      : { ...generateStoryboard(project.brief), caption, hashtags };

    onUpdateProject({
      ...project,
      name: title,
      status: 'ready_to_publish',
      storyboard: updatedStoryboard,
      prePublishChecks: checks,
      updatedAt: new Date().toISOString(),
    });
    onTabChange('queue');
  };

  const suggestedTags = ['#Shorts', '#Reels', '#AI', '#Tech', '#Viral', '#Automation', '#Productivity'];

  const hasShortsTagInTitle = title.toLowerCase().includes('#shorts');

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFD43B] text-black font-black shadow-md shadow-[#FFD43B]/20">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Captions, Metadata &amp; Pre-Publish Review
            </h1>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
              {passCount} / {checks.length} Checks Passed
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            {project.name} • Verify platform-specific titles, captions, hashtags, and thumbnail safe zones before dispatching to the publishing queue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAIGenerateMetadata}
            disabled={isGeneratingCaptions}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-3.5 py-2 text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <Wand2 className={`h-3.5 w-3.5 text-[#FFD43B] ${isGeneratingCaptions ? 'animate-spin' : ''}`} />
            <span>AI Generate Captions</span>
          </button>
          <button
            onClick={handleProceedToQueue}
            className="flex items-center gap-1.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-black px-4 py-2 text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span>Proceed to Publishing Queue</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Cols): Platform Metadata Editors */}
        <div className="lg:col-span-7 space-y-5">
          {/* Platform Tab Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePlatformTab('both')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activePlatformTab === 'both'
                  ? 'bg-[#FFD43B] text-black shadow-sm'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Unified Metadata
            </button>
            <button
              onClick={() => setActivePlatformTab('youtube')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activePlatformTab === 'youtube'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Youtube className="h-3.5 w-3.5" />
              <span>YouTube Shorts</span>
            </button>
            <button
              onClick={() => setActivePlatformTab('instagram')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activePlatformTab === 'instagram'
                  ? 'bg-gradient-to-r from-amber-500 to-[#FF6B5E] text-white shadow-sm'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Instagram className="h-3.5 w-3.5" />
              <span>Instagram Reels</span>
            </button>
          </div>

          {/* YouTube Shorts Specific Advisory */}
          {activePlatformTab === 'youtube' && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Youtube className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-red-200">YouTube Shorts Optimization Notice</div>
                  <p className="text-[11px] text-zinc-300 mt-0.5">
                    YouTube recommends including <code className="text-[#FFD43B] font-mono">#Shorts</code> in your title or description so the algorithm tags it as a vertical short.
                  </p>
                </div>
              </div>
              {!hasShortsTagInTitle && (
                <button
                  onClick={() => handleTitleChange(`${title} #Shorts`)}
                  className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold shrink-0 cursor-pointer transition-colors"
                >
                  + Add #Shorts
                </button>
              )}
            </div>
          )}

          {/* Instagram Reels Specific Advisory */}
          {activePlatformTab === 'instagram' && (
            <div className="rounded-xl border border-pink-500/20 bg-pink-500/10 p-3 flex items-start gap-2.5">
              <Instagram className="h-4 w-4 text-pink-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-pink-200">Instagram Reels Feed Hook Preview</div>
                <p className="text-[11px] text-zinc-300 mt-0.5">
                  Only the first <span className="text-[#FFD43B] font-bold">125 characters</span> appear in the feed before the &apos;...more&apos; expansion fold. Ensure your hook is placed upfront.
                </p>
              </div>
            </div>
          )}

          {/* Title Editor */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-white">
                Video Title
              </label>
              <span className={`text-[10px] font-mono ${title.length > 90 ? 'text-amber-400' : 'text-zinc-500'}`}>
                {title.length} / 100 characters {title.length <= 60 && '• Optimal Length'}
              </span>
            </div>
            <input
              type="text"
              value={title}
              maxLength={100}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:border-[#FFD43B] font-bold"
              placeholder="e.g. 3 Prompt Hacks That 10x Claude Sonnet Output #Shorts"
            />
            <p className="text-[10px] text-zinc-500">
              Tip: Keep titles punchy (under 60 characters) so they are fully visible on mobile feeds without clipping.
            </p>
          </div>

          {/* Caption / Description Editor */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-white">
                Post Caption &amp; Description
              </label>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-500 font-mono">
                  {caption.length} {activePlatformTab === 'instagram' ? '/ 2200 chars' : 'characters'}
                </span>
                <button
                  onClick={handleCopyCaption}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#FFD43B] hover:underline cursor-pointer"
                >
                  {copiedCaption ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedCaption ? 'Copied' : 'Copy Caption'}</span>
                </button>
              </div>
            </div>
            <textarea
              rows={6}
              value={caption}
              onChange={(e) => handleCaptionChange(e.target.value)}
              className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:border-[#FFD43B] resize-none font-sans leading-relaxed"
              placeholder="Write an engaging description or click AI Generate Captions above..."
            />
          </div>

          {/* Hashtag Stack & Management */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-[#FFD43B]" />
                Targeted Hashtags
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">{hashtags.length} Tags Selected</span>
            </div>

            {/* Selected Hashtags */}
            <div className="flex flex-wrap gap-2 min-h-8">
              {hashtags.map((tag) => (
                <span
                  key={tag}
                  className="group inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 border border-zinc-700 px-2.5 py-1 text-xs font-bold text-[#FFD43B] transition-colors"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveHashtag(tag)}
                    className="text-zinc-500 hover:text-red-400 cursor-pointer"
                    title={`Remove ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Custom Tag Form */}
            <div className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">#</span>
                <input
                  type="text"
                  value={newTagInput.replace(/^#/, '')}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHashtag();
                    }
                  }}
                  placeholder="Add custom hashtag..."
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 pl-7 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                />
              </div>
              <button
                onClick={() => handleAddHashtag()}
                disabled={!newTagInput.trim()}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-zinc-800/60">
              <span className="text-[10px] text-zinc-500 font-semibold mr-1">Suggestions:</span>
              {suggestedTags
                .filter((t) => !hashtags.includes(t))
                .map((st) => (
                  <button
                    key={st}
                    onClick={() => handleAddHashtag(st)}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-[#FFD43B] hover:border-[#FFD43B]/40 transition-colors cursor-pointer"
                  >
                    + {st}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Pre-Publish Quality Checklist */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Pre-Publish Quality Gate</h3>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isReadyToPublish
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {isReadyToPublish ? 'Algorithm Ready' : 'Review Needed'}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {checks.map((chk) => (
              <div
                key={chk.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white truncate max-w-[220px]">{chk.label}</span>
                  {chk.status === 'pass' ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-extrabold uppercase shrink-0">
                      <CheckCircle2 className="h-3 w-3" /> PASS
                    </span>
                  ) : chk.status === 'warn' ? (
                    <span className="flex items-center gap-1 text-amber-400 text-[10px] font-extrabold uppercase shrink-0">
                      <AlertTriangle className="h-3 w-3" /> WARN
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 text-[10px] font-extrabold uppercase shrink-0">
                      <AlertCircle className="h-3 w-3" /> FAIL
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal">{chk.detail}</p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={handleProceedToQueue}
              className="w-full rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] py-2.5 text-xs font-black text-black shadow-sm transition-all text-center cursor-pointer active:scale-95"
            >
              Lock Metadata &amp; Schedule Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
