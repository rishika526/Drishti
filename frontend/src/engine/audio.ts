/**
 * Pure WebAudio procedural synthesizer for military radar, EW, and threat audio.
 * Requires 0 external audio files; works 100% offline and in all desktop browsers.
 */

class TacticalSoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private droneHumGain: GainNode | null = null;
  private droneHumOsc1: OscillatorNode | null = null;
  private droneHumOsc2: OscillatorNode | null = null;

  constructor() {
    try {
      const saved = localStorage.getItem('drishti_sound_enabled');
      if (saved !== null) {
        this.soundEnabled = saved === 'true';
      }
    } catch {
      this.soundEnabled = true;
    }
  }

  private initContext(): AudioContext | null {
    if (!this.soundEnabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem('drishti_sound_enabled', String(enabled));
    } catch {}
    if (!enabled && this.ctx) {
      this.stopAcousticDroneHum();
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  /** Radar sweep blip when beam intersects contact */
  public playRadarBlip(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  /** Urgent warning tone for incoming strike drone or critical event */
  public playThreatAlarm(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now + i * 0.12);
      osc.frequency.setValueAtTime(1600, now + i * 0.12 + 0.05);

      gain.gain.setValueAtTime(0.12, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.1);
    }
  }

  /** EW Electronic Warfare pulse sound */
  public playEWJamPulse(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.4);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  /** Kinetic hard-kill intercept explosion sound */
  public playHardKillSplash(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    // Buffer noise for explosion
    const bufferSize = ctx.sampleRate * 0.6;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.6);
  }

  /** Tactical UI click / select sound */
  public playUIClick(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  /** Continuous acoustic cue for nearby drone motor whine */
  public updateAcousticDroneHum(closestDistance: number): void {
    if (!this.soundEnabled || closestDistance > 1200) {
      this.stopAcousticDroneHum();
      return;
    }

    const ctx = this.initContext();
    if (!ctx) return;

    if (!this.droneHumOsc1) {
      this.droneHumOsc1 = ctx.createOscillator();
      this.droneHumOsc2 = ctx.createOscillator();
      this.droneHumGain = ctx.createGain();

      this.droneHumOsc1.type = 'sawtooth';
      this.droneHumOsc1.frequency.setValueAtTime(220, ctx.currentTime);

      this.droneHumOsc2.type = 'triangle';
      this.droneHumOsc2.frequency.setValueAtTime(440, ctx.currentTime);

      this.droneHumGain.gain.setValueAtTime(0.001, ctx.currentTime);

      this.droneHumOsc1.connect(this.droneHumGain);
      this.droneHumOsc2.connect(this.droneHumGain);
      this.droneHumGain.connect(ctx.destination);

      this.droneHumOsc1.start();
      this.droneHumOsc2.start();
    }

    // Volume scales with proximity
    const proximity = Math.max(0, 1 - closestDistance / 1200);
    const targetVolume = proximity * 0.05;
    if (this.droneHumGain) {
      this.droneHumGain.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + 0.1);
    }
  }

  public stopAcousticDroneHum(): void {
    if (this.droneHumOsc1) {
      try {
        this.droneHumOsc1.stop();
        this.droneHumOsc2?.stop();
        this.droneHumOsc1.disconnect();
        this.droneHumOsc2?.disconnect();
      } catch {}
      this.droneHumOsc1 = null;
      this.droneHumOsc2 = null;
      this.droneHumGain = null;
    }
  }
}

export const soundEngine = new TacticalSoundEngine();
