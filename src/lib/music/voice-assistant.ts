// =============================================================================
// RIIQX MUSIC — AI Voice Assistant & Speech Search Engine
// Recognizes voice commands in English & Bengali (Bangla/Banglish)
// =============================================================================

export type VoiceIntentType =
  | 'play'
  | 'search'
  | 'pause'
  | 'resume'
  | 'next'
  | 'prev'
  | 'volume_up'
  | 'volume_down'
  | 'mute'
  | 'toggle_lyrics'
  | 'bass_boost'
  | 'light_mode'
  | 'dark_mode'
  | 'open_offline';

export interface ParsedVoiceCommand {
  intent: VoiceIntentType;
  query?: string;
  rawText: string;
}

export function parseVoiceCommand(transcript: string): ParsedVoiceCommand {
  const clean = transcript.trim().toLowerCase();

  // 1. Playback controls
  if (
    clean === 'pause' ||
    clean === 'stop' ||
    clean.includes('pause koro') ||
    clean.includes('gaan thamo') ||
    clean.includes('ruk jao')
  ) {
    return { intent: 'pause', rawText: transcript };
  }

  if (
    clean === 'resume' ||
    clean === 'chalu koro' ||
    clean === 'play music' ||
    clean === 'baja'
  ) {
    return { intent: 'resume', rawText: transcript };
  }

  if (
    clean === 'next' ||
    clean === 'skip' ||
    clean.includes('next song') ||
    clean.includes('porer gaan') ||
    clean.includes('agla gana')
  ) {
    return { intent: 'next', rawText: transcript };
  }

  if (
    clean === 'previous' ||
    clean === 'back' ||
    clean.includes('previous song') ||
    clean.includes('ager gaan') ||
    clean.includes('pichla gana')
  ) {
    return { intent: 'prev', rawText: transcript };
  }

  // 2. Volume & Audio Effects
  if (clean.includes('volume up') || clean.includes('sound barao') || clean.includes('awaj barao')) {
    return { intent: 'volume_up', rawText: transcript };
  }
  if (clean.includes('volume down') || clean.includes('sound komao') || clean.includes('awaj komao')) {
    return { intent: 'volume_down', rawText: transcript };
  }
  if (clean === 'mute' || clean.includes('mute koro')) {
    return { intent: 'mute', rawText: transcript };
  }
  if (clean.includes('bass boost') || clean.includes('bass barao') || clean.includes('high bass')) {
    return { intent: 'bass_boost', rawText: transcript };
  }

  // 3. UI and Tab Navigation
  if (clean.includes('lyrics') || clean.includes('lyric dakhao') || clean.includes('show lyrics')) {
    return { intent: 'toggle_lyrics', rawText: transcript };
  }
  if (clean.includes('light mode') || clean.includes('shada mode')) {
    return { intent: 'light_mode', rawText: transcript };
  }
  if (clean.includes('dark mode') || clean.includes('kalo mode')) {
    return { intent: 'dark_mode', rawText: transcript };
  }
  if (clean.includes('offline') || clean.includes('downloaded') || clean.includes('offline gaan')) {
    return { intent: 'open_offline', rawText: transcript };
  }

  // 4. Play specific song or artist
  const playPrefixes = [
    'play ',
    'play song ',
    'play music ',
    'chalao ',
    'bajao ',
    'shunao ',
    'gana bajao ',
    'listen to ',
  ];

  for (const prefix of playPrefixes) {
    if (clean.startsWith(prefix)) {
      const songQuery = clean.replace(prefix, '').trim();
      if (songQuery.length > 0) {
        return { intent: 'play', query: songQuery, rawText: transcript };
      }
    }
  }

  const playSuffixes = [
    ' gaan ta chalao',
    ' gaan ta bajao',
    ' er gaan chalao',
    ' er gaan bajao',
    ' ka gana bajao',
    ' song play koro',
  ];

  for (const suffix of playSuffixes) {
    if (clean.endsWith(suffix)) {
      const songQuery = clean.replace(suffix, '').trim();
      if (songQuery.length > 0) {
        return { intent: 'play', query: songQuery, rawText: transcript };
      }
    }
  }

  // Default fallback: treat entire text as search & play
  return { intent: 'play', query: transcript.trim(), rawText: transcript };
}

export class VoiceRecognitionController {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-IN'; // Multi-accent English & Indian recognition
      }
    }
  }

  public isSupported(): boolean {
    return Boolean(this.recognition);
  }

  public startListening(
    onResult: (command: ParsedVoiceCommand) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      if (transcript) {
        const cmd = parseVoiceCommand(transcript);
        onResult(cmd);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      onError(event.error || 'Voice input error');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (e: any) {
      this.isListening = false;
      onError(e.message || 'Failed to start speech listener');
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
      this.isListening = false;
    }
  }
}

