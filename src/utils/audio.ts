/**
 * Audio Engine - Monopoli Budaya Nusantara
 * Mendukung pemutaran file musik asli (.mp3, .ogg, .wav)
 * sekaligus synthesizer gamelan prosedural Web Audio API sebagai cadangan.
 */

// ============================================================================
// 🎵 LOKASI FILE MUSIK ANDA:
// Letakkan file musik Anda di folder: public/assets/audio/bgm.mp3
// Atau ganti path CUSTOM_BGM_URL di bawah ini ke lokasi file musik Anda:
// Contoh: '/assets/audio/lagu_daerah.mp3' atau '/assets/aistudio/musik_nusantara.mp3'
// ============================================================================
export let CUSTOM_BGM_URL: string = '/assets/audio/bgmmusic.mp3';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private sfxMuted: boolean = false;
  private musicVolume: number = 0.5; // 0.0 to 1.0 (50% default)
  private bgmInterval: number | null = null;
  private isBgmPlaying: boolean = false;
  private customAudio: HTMLAudioElement | null = null;
  private customAudioFailed: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSfx(): boolean {
    this.sfxMuted = !this.sfxMuted;
    return this.sfxMuted;
  }

  public getSfxMuted(): boolean {
    return this.sfxMuted;
  }

  public toggleMute(): boolean {
    const muted = !this.sfxMuted;
    this.sfxMuted = muted;
    if (muted) {
      this.setMusicVolume(0);
    } else {
      this.setMusicVolume(0.5);
    }
    return muted;
  }

  public getMuted(): boolean {
    return this.sfxMuted && this.musicVolume === 0;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.customAudio) {
      this.customAudio.volume = this.musicVolume;
    }
    if (this.musicVolume > 0) {
      if (!this.isBgmPlaying) {
        this.customAudioFailed = false;
        this.startBgm();
      } else if (this.customAudioFailed) {
        this.customAudioFailed = false;
        this.startBgm();
      }
    } else if (this.musicVolume === 0 && this.isBgmPlaying) {
      this.stopBgm();
    }
  }

  public setCustomBgmUrl(url: string) {
    CUSTOM_BGM_URL = url;
    this.customAudioFailed = false;
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    if (this.isBgmPlaying) {
      this.stopBgm();
      this.startBgm();
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public toggleMusic(): boolean {
    if (this.musicVolume > 0) {
      this.setMusicVolume(0);
      return false;
    } else {
      this.setMusicVolume(0.5);
      return true;
    }
  }

  public getMusicEnabled(): boolean {
    return this.musicVolume > 0;
  }

  // Soft wooden dice roll rattle
  public playDiceRoll() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const count = 7;
    for (let i = 0; i < count; i++) {
      const delay = i * 0.04 + Math.random() * 0.02;
      setTimeout(() => {
        if (!this.ctx || this.sfxMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140 + Math.random() * 260, this.ctx.currentTime);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
      }, delay * 1000);
    }
  }

  // Pawn footstep sound
  public playPawnStep() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.07);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Traditional Gamelan Gong / Bonang tone for building or passing Start
  public playGamelanChime() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const fundamental = 523.25; // C5
    [1, 2.04, 3.02, 4.2].forEach((ratio, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(fundamental * ratio, this.ctx.currentTime);

      const amp = 0.25 / (idx + 1);
      gain.gain.setValueAtTime(amp, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.3);
    });
  }

  // Coin purchase sound
  public playCoin() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [987.77, 1318.51]; // B5, E6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || this.sfxMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.26);
      }, idx * 75);
    });
  }

  // Card Flip Swoosh
  public playCardDraw() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // Quiz correct fanfare
  public playQuizSuccess() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const scale = [523.25, 587.33, 659.25, 783.99, 1046.5]; // C, D, E, G, C6
    scale.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || this.sfxMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.36);
      }, idx * 80);
    });
  }

  // Quiz wrong gong
  public playQuizFail() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [260, 240, 210];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || this.sfxMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.32);
      }, idx * 120);
    });
  }

  // Deep resonant Ageng Gong
  public playBigGong() {
    if (this.sfxMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(98, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(85, this.ctx.currentTime + 3.0);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(147, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.2);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    subOsc.start();
    osc.stop(this.ctx.currentTime + 3.3);
    subOsc.stop(this.ctx.currentTime + 3.3);
  }

  // Background Music loop with adjustable volume
  public startBgm() {
    if (this.isBgmPlaying || this.musicVolume <= 0) return;
    this.initCtx();
    this.isBgmPlaying = true;

    // 1. Coba putar file audio musik kustom (MP3 / WAV / OGG) jika ada
    if (CUSTOM_BGM_URL && !this.customAudioFailed) {
      if (!this.customAudio) {
        try {
          this.customAudio = new Audio(CUSTOM_BGM_URL);
          this.customAudio.loop = true;
          this.customAudio.volume = this.musicVolume;
          this.customAudio.addEventListener('error', () => {
            console.info('[Audio] File musik kustom tidak ditemukan atau belum dimuat, menggunakan musik gamelan bawaan.');
            this.customAudioFailed = true;
            if (this.customAudio) {
              this.customAudio = null;
            }
            if (this.isBgmPlaying && !this.bgmInterval) {
              this.startProceduralGamelan();
            }
          });
        } catch {
          this.customAudioFailed = true;
        }
      }

      if (this.customAudio && !this.customAudioFailed) {
        this.customAudio.volume = this.musicVolume;
        const playPromise = this.customAudio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (this.bgmInterval) {
                clearInterval(this.bgmInterval);
                this.bgmInterval = null;
              }
            })
            .catch(() => {
              // Browser autoplay restriction atau file gagal
              this.startProceduralGamelan();
            });
          return;
        }
      }
    }

    // 2. Jika file kustom belum ada, jalankan synthesizer gamelan bawaan
    this.startProceduralGamelan();
  }

  private startProceduralGamelan() {
    if (this.bgmInterval) return;
    const gamelanScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    let step = 0;

    this.bgmInterval = window.setInterval(() => {
      if (this.musicVolume <= 0 || !this.ctx || !this.isBgmPlaying) return;
      if (Math.random() > 0.35) {
        const note = gamelanScale[step % gamelanScale.length];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, this.ctx.currentTime);

        const vol = 0.04 * this.musicVolume;
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.85);
      }
      step = (step + Math.floor(Math.random() * 3) + 1) % gamelanScale.length;
    }, 700);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.customAudio) {
      try {
        this.customAudio.pause();
      } catch {
        // ignore
      }
    }
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const sound = new SoundEngine();
