import { useState, useRef, useCallback, useEffect } from "react";
import * as Tone from "tone";
import { Play, Square, Download, RefreshCw, Music2 } from "lucide-react";
import logoFull from "@/assets/logo-full.png";
import { Link } from "@tanstack/react-router";

const STEPS = 16;
const ROOT = 48; // C3

const GENRES = {
  trap:      { name: "Trap",      defaultBpm: 140 },
  lofi:      { name: "Lo-Fi",     defaultBpm: 85  },
  drill:     { name: "Drill",     defaultBpm: 145 },
  afrobeats: { name: "Afrobeats", defaultBpm: 100 },
  hiphop:    { name: "Hip-Hop",   defaultBpm: 90  },
} as const;

type Genre = keyof typeof GENRES;

const SCALES: Record<Genre, number[]> = {
  trap:      [0, 3, 5, 7, 10],
  lofi:      [0, 2, 3, 5, 7, 9, 10],
  drill:     [0, 2, 3, 5, 7, 8, 10],
  afrobeats: [0, 2, 4, 7, 9],
  hiphop:    [0, 3, 5, 6, 7, 10],
};

const DRUM_PATTERNS: Record<Genre, { kick: boolean[]; snare: boolean[]; hat: boolean[] }> = {
  trap: {
    kick:  [1,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0].map(Boolean),
    snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(Boolean),
    hat:   [1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1].map(Boolean),
  },
  lofi: {
    kick:  [1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0].map(Boolean),
    snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(Boolean),
    hat:   [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1].map(Boolean),
  },
  drill: {
    kick:  [1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0].map(Boolean),
    snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1].map(Boolean),
    hat:   [1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1].map(Boolean),
  },
  afrobeats: {
    kick:  [1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0].map(Boolean),
    snare: [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0].map(Boolean),
    hat:   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map(Boolean),
  },
  hiphop: {
    kick:  [1,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0].map(Boolean),
    snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(Boolean),
    hat:   [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1].map(Boolean),
  },
};

function midiToNoteName(midi: number): string {
  const names = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  return names[midi % 12] + Math.floor(midi / 12 - 1);
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateMelody(genre: Genre, seed: number): (number | null)[] {
  const rand = seededRandom(seed);
  const scale = SCALES[genre];
  const melody: (number | null)[] = Array(STEPS).fill(null);
  const density = genre === "lofi" ? 0.35 : genre === "trap" ? 0.3 : 0.4;
  for (let i = 0; i < STEPS; i++) {
    if (rand() < density) {
      const octave = rand() < 0.3 ? 12 : 0;
      const note = scale[Math.floor(rand() * scale.length)];
      melody[i] = ROOT + note + octave;
    }
  }
  return melody;
}

const NOTE_ROWS = 12; // display range

export function BeatsPage() {
  const [genre, setGenre] = useState<Genre>("trap");
  const [bpm, setBpm] = useState(140);
  const [seed, setSeed] = useState(42);
  const [melody, setMelody] = useState<(number | null)[]>(() => generateMelody("trap", 42));
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [downloading, setDownloading] = useState(false);

  const seqRef = useRef<Tone.Sequence | null>(null);
  const kickRef = useRef<Tone.MembraneSynth | null>(null);
  const snareRef = useRef<Tone.NoiseSynth | null>(null);
  const hatRef = useRef<Tone.MetalSynth | null>(null);
  const melodyRef = useRef<Tone.Synth | null>(null);

  const drumPattern = DRUM_PATTERNS[genre];

  // Note rows to display (melody range)
  const displayNotes = Array.from({ length: NOTE_ROWS }, (_, i) => ROOT + NOTE_ROWS - 1 - i);

  function handleGenreChange(g: Genre) {
    setGenre(g);
    setBpm(GENRES[g].defaultBpm);
    const newSeed = Math.floor(Math.random() * 9999);
    setSeed(newSeed);
    setMelody(generateMelody(g, newSeed));
  }

  function handleGenerate() {
    const newSeed = Math.floor(Math.random() * 9999);
    setSeed(newSeed);
    setMelody(generateMelody(genre, newSeed));
  }

  const stopPlayback = useCallback(() => {
    seqRef.current?.stop();
    seqRef.current?.dispose();
    seqRef.current = null;
    kickRef.current?.dispose();
    snareRef.current?.dispose();
    hatRef.current?.dispose();
    melodyRef.current?.dispose();
    Tone.getTransport().stop();
    setPlaying(false);
    setCurrentStep(-1);
  }, []);

  const startPlayback = useCallback(async () => {
    await Tone.start();
    Tone.getTransport().bpm.value = bpm;

    const kick = new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 6, envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 } }).toDestination();
    const snare = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 } }).toDestination();
    const hat = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.05, release: 0.01 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination();
    hat.volume.value = -12;
    const mel = new Tone.Synth({ oscillator: { type: genre === "lofi" ? "triangle" : "sawtooth" }, envelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.5 } }).toDestination();
    mel.volume.value = -6;

    kickRef.current = kick;
    snareRef.current = snare;
    hatRef.current = hat;
    melodyRef.current = mel;

    let step = 0;
    const seq = new Tone.Sequence((time) => {
      const s = step % STEPS;
      setCurrentStep(s);
      if (drumPattern.kick[s]) kick.triggerAttackRelease("C1", "8n", time);
      if (drumPattern.snare[s]) snare.triggerAttackRelease("8n", time);
      if (drumPattern.hat[s]) hat.triggerAttackRelease("32n", time);
      const note = melody[s];
      if (note !== null) mel.triggerAttackRelease(midiToNoteName(note), "8n", time);
      step++;
    }, undefined, "16n");

    seqRef.current = seq;
    seq.start(0);
    Tone.getTransport().start();
    setPlaying(true);
  }, [bpm, genre, melody, drumPattern]);

  async function handleDownload() {
    setDownloading(true);
    const bars = 2;
    const duration = (bars * 4 * 60) / bpm;

    const buffer = await Tone.Offline(async ({ transport }) => {
      transport.bpm.value = bpm;
      const kick = new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 6, envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 } }).toDestination();
      const snare = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 } }).toDestination();
      const hat = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.05, release: 0.01 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination();
      hat.volume.value = -12;
      const mel = new Tone.Synth({ oscillator: { type: "sawtooth" }, envelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.5 } }).toDestination();
      mel.volume.value = -6;

      let step = 0;
      const seq = new Tone.Sequence((time) => {
        const s = step % STEPS;
        if (drumPattern.kick[s]) kick.triggerAttackRelease("C1", "8n", time);
        if (drumPattern.snare[s]) snare.triggerAttackRelease("8n", time);
        if (drumPattern.hat[s]) hat.triggerAttackRelease("32n", time);
        const note = melody[s];
        if (note !== null) mel.triggerAttackRelease(midiToNoteName(note), "8n", time);
        step++;
      }, undefined, "16n");
      seq.start(0);
      transport.start();
    }, duration);

    // Convert to WAV
    const wav = audioBufferToWav(buffer.get()!);
    const blob = new Blob([wav], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `liam-bakke-beat-${genre}-${bpm}bpm.wav`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
  }

  useEffect(() => {
    return () => { stopPlayback(); };
  }, [stopPlayback]);

  return (
    <div className="min-h-screen px-5 py-12" style={{ background: "oklch(0.13 0.04 280)" }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link to="/"><img src={logoFull} alt="Liam Bakke Studios" className="h-7 opacity-80" style={{ filter: "invert(1)" }} /></Link>
          <div className="flex items-center gap-2 text-xs" style={{ color: "oklch(0.55 0.04 265)" }}>
            <Music2 className="h-3.5 w-3.5" style={{ color: "oklch(0.68 0.16 168)" }} />
            Beat Generator
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-1" style={{ color: "oklch(0.92 0.02 265)" }}>Beat Generator</h1>
        <p className="text-sm mb-8" style={{ color: "oklch(0.55 0.04 265)" }}>Generer beats basert på sjanger og tempo</p>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {/* Genre */}
          <div className="rounded-2xl border p-5" style={{ background: "oklch(0.18 0.05 280 / 0.7)", borderColor: "oklch(0.32 0.06 280 / 0.5)" }}>
            <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "oklch(0.68 0.16 168)" }}>Sjanger</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(GENRES) as Genre[]).map(g => (
                <button key={g} onClick={() => handleGenreChange(g)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: genre === g ? "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))" : "oklch(0.24 0.05 280)",
                    color: genre === g ? "oklch(0.97 0.01 240)" : "oklch(0.65 0.04 265)",
                    border: `1px solid ${genre === g ? "transparent" : "oklch(0.32 0.06 280 / 0.5)"}`,
                  }}
                >
                  {GENRES[g].name}
                </button>
              ))}
            </div>
          </div>

          {/* BPM */}
          <div className="rounded-2xl border p-5" style={{ background: "oklch(0.18 0.05 280 / 0.7)", borderColor: "oklch(0.32 0.06 280 / 0.5)" }}>
            <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "oklch(0.68 0.16 168)" }}>
              Tempo — <span style={{ color: "oklch(0.90 0.02 265)" }}>{bpm} BPM</span>
            </p>
            <input type="range" min={60} max={180} value={bpm} onChange={e => setBpm(Number(e.target.value))}
              className="w-full accent-purple-500 h-2 rounded-full" />
            <div className="flex justify-between text-xs mt-1" style={{ color: "oklch(0.45 0.04 265)" }}>
              <span>60</span><span>180</span>
            </div>
          </div>
        </div>

        {/* Piano Roll */}
        <div className="rounded-2xl border overflow-hidden mb-6" style={{ background: "oklch(0.15 0.05 280 / 0.8)", borderColor: "oklch(0.32 0.06 280 / 0.5)" }}>
          <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "oklch(0.28 0.06 280 / 0.5)" }}>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.68 0.16 168)" }}>Piano Roll</span>
            <span className="text-xs" style={{ color: "oklch(0.45 0.04 265)" }}>Melodi</span>
          </div>

          {/* Step numbers */}
          <div className="flex pl-10 pr-3 pt-2">
            {Array.from({ length: STEPS }).map((_, i) => (
              <div key={i} className="flex-1 text-center text-xs" style={{ color: currentStep === i ? "oklch(0.90 0.06 280)" : "oklch(0.35 0.04 265)" }}>
                {i % 4 === 0 ? i / 4 + 1 : "·"}
              </div>
            ))}
          </div>

          {/* Melody rows */}
          <div className="px-3 pb-2">
            {displayNotes.map(note => {
              const isBlack = [1,3,6,8,10].includes(note % 12);
              const noteName = midiToNoteName(note);
              return (
                <div key={note} className="flex items-center gap-0 mb-0.5">
                  <div className="w-7 text-right pr-1 text-xs flex-shrink-0" style={{ color: isBlack ? "oklch(0.45 0.04 265)" : "oklch(0.60 0.04 265)", fontSize: "10px" }}>
                    {noteName}
                  </div>
                  <div className="flex flex-1 gap-0.5">
                    {Array.from({ length: STEPS }).map((_, step) => {
                      const active = melody[step] === note;
                      const isCurrent = currentStep === step;
                      return (
                        <div key={step} className="flex-1 rounded-sm transition-all"
                          style={{
                            height: "14px",
                            background: active
                              ? isCurrent
                                ? "oklch(0.85 0.18 280)"
                                : "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))"
                              : isCurrent
                              ? "oklch(0.28 0.06 280)"
                              : isBlack
                              ? "oklch(0.16 0.04 280)"
                              : "oklch(0.20 0.05 280)",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Drum rows */}
          <div className="border-t px-3 py-3" style={{ borderColor: "oklch(0.28 0.06 280 / 0.5)" }}>
            {(["kick", "snare", "hat"] as const).map((drum, di) => {
              const colors = ["oklch(0.65 0.18 25)", "oklch(0.68 0.16 168)", "oklch(0.75 0.12 280)"];
              return (
                <div key={drum} className="flex items-center gap-0 mb-1">
                  <div className="w-7 text-right pr-1 text-xs flex-shrink-0 capitalize" style={{ color: colors[di], fontSize: "10px" }}>{drum}</div>
                  <div className="flex flex-1 gap-0.5">
                    {Array.from({ length: STEPS }).map((_, step) => {
                      const active = drumPattern[drum][step];
                      const isCurrent = currentStep === step;
                      return (
                        <div key={step} className="flex-1 rounded-sm transition-all"
                          style={{
                            height: "12px",
                            background: active
                              ? isCurrent ? "white" : colors[di]
                              : isCurrent ? "oklch(0.28 0.06 280)" : "oklch(0.20 0.05 280)",
                            opacity: active ? 1 : 0.4,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={playing ? stopPlayback : startPlayback}
            className="flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))", color: "oklch(0.97 0.01 240)" }}
          >
            {playing ? <><Square className="h-4 w-4" /> Stop</> : <><Play className="h-4 w-4" /> Play</>}
          </button>

          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm transition-all hover:opacity-90"
            style={{ background: "oklch(0.24 0.05 280)", color: "oklch(0.80 0.04 265)", border: "1px solid oklch(0.32 0.06 280 / 0.6)" }}
          >
            <RefreshCw className="h-4 w-4" /> Generer ny
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "oklch(0.24 0.05 280)", color: "oklch(0.80 0.04 265)", border: "1px solid oklch(0.32 0.06 280 / 0.6)" }}
          >
            <Download className="h-4 w-4" /> {downloading ? "Eksporterer…" : "Last ned WAV"}
          </button>
        </div>
      </div>
    </div>
  );
}

// WAV encoder
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length * numChannels * 2;
  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);

  function write(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }
  function writeUint32(offset: number, v: number) { view.setUint32(offset, v, true); }
  function writeUint16(offset: number, v: number) { view.setUint16(offset, v, true); }

  write(0, "RIFF");
  writeUint32(4, 36 + length);
  write(8, "WAVE");
  write(12, "fmt ");
  writeUint32(16, 16);
  writeUint16(20, 1);
  writeUint16(22, numChannels);
  writeUint32(24, sampleRate);
  writeUint32(28, sampleRate * numChannels * 2);
  writeUint16(32, numChannels * 2);
  writeUint16(34, 16);
  write(36, "data");
  writeUint32(40, length);

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
  return arrayBuffer;
}
