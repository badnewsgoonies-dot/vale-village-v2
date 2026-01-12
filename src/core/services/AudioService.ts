
import { Howl, Howler } from 'howler';

// Sound categories
export type SoundCategory = 'BGM' | 'SFX' | 'UI';

// Track IDs
export type BGMTrack = 'overworld' | 'battle' | 'victory' | 'title' | 'shop';
export type SFXTrack = 'menu_move' | 'menu_select' | 'cancel' | 'attack' | 'hit' | 'magic' | 'level_up';

class AudioService {
  private bgm: Record<BGMTrack, Howl | null> = {
    overworld: null,
    battle: null,
    victory: null,
    title: null,
    shop: null
  };

  private sfx: Record<SFXTrack, Howl | null> = {
    menu_move: null,
    menu_select: null,
    cancel: null,
    attack: null,
    hit: null,
    magic: null,
    level_up: null
  };

  private currentBGM: Howl | null = null;
  private currentBGMId: BGMTrack | null = null;
  private muted: boolean = false;
  private volume: number = 0.5;

  constructor() {
    // Initialize standard sounds (placeholders for now)
    // Real implementation would load from assets/audio/...
    this.loadPlaceholders();
  }

  private loadPlaceholders() {
    // In a real app, these would be paths to .mp3/.webm files
    // For now, we mock them or use empty Howls if files missing
    // console.log('AudioService initialized (placeholders)');
  }

  public playBGM(track: BGMTrack, fade: boolean = true) {
    if (this.muted) return;
    if (this.currentBGMId === track) return; // Already playing

    if (this.currentBGM && fade) {
      this.currentBGM.fade(this.volume, 0, 1000);
      setTimeout(() => {
        this.currentBGM?.stop();
        this.startBGM(track, fade);
      }, 1000);
    } else {
      if (this.currentBGM) this.currentBGM.stop();
      this.startBGM(track, fade);
    }
  }

  private startBGM(track: BGMTrack, fade: boolean) {
    // Lazy load logic would go here
    // this.bgm[track]?.play();
    this.currentBGMId = track;
    this.currentBGM = this.bgm[track];
    if (this.currentBGM) {
      this.currentBGM.volume(fade ? 0 : this.volume);
      this.currentBGM.play();
      if (fade) {
        this.currentBGM.fade(0, this.volume, 1000);
      }
    }
    console.log(`[Audio] Playing BGM: ${track}`);
  }

  public playSFX(track: SFXTrack) {
    if (this.muted) return;
    // this.sfx[track]?.play();
    console.log(`[Audio] SFX: ${track}`);
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    Howler.volume(this.volume);
  }

  public toggleMute() {
    this.muted = !this.muted;
    Howler.mute(this.muted);
  }
}

export const audio = new AudioService();
