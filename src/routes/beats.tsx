import { useState, useRef, useCallback, useEffect } from "react";
import * as Tone from "tone";
import { Play, Square, Download, RefreshCw, Music2, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logoFull from "@/assets/logo-full.png";

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

const DRUM_PRESETS: Record<Genre, { kick: boolean[]; snare: boolean[]; hat: boolean[] }> = {
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

const NOTE_ROWS = 13;
const DISPLAY_NOTES = Array.from({ length: NOTE_ROWS }, (_, i) => ROOT + NOTE_ROWS - 1 - i);

function midiToNoteName(midi: number): string {
  const names = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  return names[midi % 12] + Math.floor(midi / 12 - 1);
}

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function emptyMelodyGrid(): boolean[][] {
  return Array.from({ length: STEPS }, () => Array(NOTE_ROWS).fill(false));
}

function generateMelodyGrid(genre: Genre, seed: number): boolean[][] {
  const rand = seededRandom(seed);
  const scale = SCALES[genre];
  const grid = emptyMelodyGrid();
  const density = genre === "lofi" ? 0.35 : genre === "trap" ? 0.28 : 0.38;
  for (let step = 0; step < STEPS; step++) {
    if (rand() < density) {
      const octaveOffset = rand() < 0.3 ? 12 : 0;
      const semitone = scale[Math.floor(rand() * scale.length)] + octaveOffset;
      const rowIdx = NOTE_ROWS - 1 - (semitone); // map midi offset to row
      // find the row that matches ROOT + semitone
      const targetMidi = ROOT + semitone;
      const rowIndex = DISPLAY_NOTES.indexOf(targetMidi);
      if (rowIndex !== -1) grid[step][rowIndex] = true;
    }
  }
  return grid;
}

function cloneDrums(d: typeof DRUM_PRESETS.trap) {
  return { kick: [...d.kick], snare: [...d.snare], hat: [...d.hat] };
}

export function BeatsPage() {
  const [genre, setGenre]       = useState<Genre>("trap");
  const [bpm, setBpm]           = useState(140);
  const [melodyGrid, setMelodyGrid] = useState<boolean[][]>(() => generateMelodyGrid("trap", 42));
  const [drums, setDrums]       = useState(() => cloneDrums(DRUM_PRESETS.trap));
  const [playing, setPlaying]   = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [downloading, setDownloading] = useState(false);

  const seqRef    = useRef<Tone.Sequence | null>(null);
  const kickRef   = useRef<Tone.MembraneSynth | null>(null);
  const snareRef  = useRef<Tone.NoiseSynth | null>(null);
  const hatRef    = useRef<Tone.MetalSynth | null>(null);
  const melodyRef = useRef<Tone.PolySynth | null>(null);

  function handleGenreChange(g: Genre) {
    setGenre(g);
    setBpm(GENRES[g].defaultBpm);
    setMelodyGrid(generateMelodyGrid(g, Math.floor(Math.random() * 9999)));
    setDrums(cloneDrums(DRUM_PRESETS[g]));
  }

  function handleGenerate() {
    setMelodyGrid(generateMelodyGrid(genre, Math.floor(Math.random() * 9999)));
    setDrums(cloneDrums(DRUM_PRESETS[genre]));
  }

  function handleClear() {
    setMelodyGrid(emptyMelodyGrid());
    setDrums({ kick: Array(STEPS).fill(false), snare: Array(STEPS).fill(false), hat: Array(STEPS).fill(false) });
  }

  function toggleMelodyCell(step: number, rowIdx: number) {
    setMelodyGrid(prev => {
      const next = prev.map(r => [...r]);
      next[step][rowIdx] = !next[step][rowIdx];
      return next;
    });
  }

  function toggleDrumCell(drum: "kick" | "snare" | "hat", step: number) {
    setDrums(prev => ({ ...prev, [drum]: prev[drum].map((v, i) => i === step ? !v : v) }));
  }

  const stopPlayback = useCallback(() => {
    seqRef.current?.stop(); seqRef.current?.dispose(); seqRef.current = null;
    kickRef.current?.dispose(); snareRef.current?.dispose();
    hatRef.current?.dispose(); melodyRef.current?.dispose();
    Tone.getTransport().stop();
    setPlaying(false); setCurrentStep(-1);
  }, []);

  const startPlayback = useCallback(async () => {
    await Tone.start();
    Tone.getTransport().bpm.value = bpm;

    const kick  = new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 6, envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 } }).toDestination();
    const snare = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 } }).toDestination();
    const hat   = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.05, release: 0.01 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination();
    hat.volume.value = -12;
    const mel = new Tone.PolySynth(Tone.Synth, { oscillator: { type: genre === "lofi" ? "triangle" : "sawtooth" }, envelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.5 } }).toDestination();
    mel.volume.value = -6;

    kickRef.current = kick; snareRef.current = snare; hatRef.current = hat; melodyRef.current = mel;

    // Capture current state for the sequence
    const snapMelody = melodyGrid.map(r => [...r]);
    const snapDrums  = { kick: [...drums.kick], snare: [...drums.snare], hat: [...drums.hat] };

    let step = 0;
    const seq = new Tone.Sequence((time) => {
      const s = step % STEPS;
      setCurrentStep(s);
      if (snapDrums.kick[s])  kick.triggerAttackRelease("C1", "8n", time);
      if (snapDrums.snare[s]) snare.triggerAttackRelease("8n", time);
      if (snapDrums.hat[s])   hat.triggerAttackRelease("32n", time);
      const notes = snapMelody[s]
        .map((on, rowIdx) => on ? midiToNoteName(DISPLAY_NOTES[rowIdx]) : null)
        .filter(Boolean) as string[];
      if (notes.length > 0) mel.triggerAttackRelease(notes, "8n", time);
      step++;
    }, undefined, "16n");

    seqRef.current = seq;
    seq.start(0);
    Tone.getTransport().start();
    setPlaying(true);
  }, [bpm, genre, melodyGrid, drums]);

  async function handleDownload() {
    setDownloading(true);
    const bars = 2;
    const duration = (bars * 4 * 60) / bpm;
    const snapMelody = melodyGrid.map(r => [...r]);
    const snapDrums  = { kick: [...drums.kick], snare: [...drums.snare], hat: [...drums.hat] };

    const buffer = await Tone.Offline(async ({ transport }) => {
      transport.bpm.value = bpm;
      const kick  = new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 6, envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 } }).toDestination();
      const snare = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 } }).toDestination();
      const hat   = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.05, release: 0.01 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination();
      hat.volume.value = -12;
      const mel = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "sawtooth" }, envelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.5 } }).toDestination();
      mel.volume.value = -6;

      let step = 0;
      const seq = new Tone.Sequence((time) => {
        const s = step % STEPS;
        if (snapDrums.kick[s])  kick.triggerAttackRelease("C1", "8n", time);
        if (snapDrums.snare[s]) snare.triggerAttackRelease("8n", time);
        if (snapDrums.hat[s])   hat.triggerAttackRelease("32n", time);
        const notes = snapMelody[s].map((on, rowIdx) => on ? midiToNoteName(DISPLAY_NOTES[rowIdx]) : null).filter(Boolean) as string[];
        if (notes.length > 0) mel.triggerAttackRelease(notes, "8n", time);
        step++;
      }, undefined, "16n");
      seq.start(0);
      transport.start();
    }, duration);

    const wav = audioBufferToWav(buffer.get()!);
    const blob = new Blob([wav], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `beat-${genre}-${bpm}bpm.wav`; a.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
  }

  useEffect(() => { return () => { stopPlayback(); }; }, [stopPlayback]);

  const drumColors = { kick: "oklch(0.65 0.18 25)", snare: "oklch(0.68 0.16 168)", hat: "oklch(0.75 0.12 280)" };

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "oklch(0.13 0.04 280)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/"><img src={logoFull} alt="Liam Bakke Studios" className="h-7 opacity-80" style={{ filter: "invert(1)" }} /></Link>
          <div className="flex items-center gap-2 text-xs" style={{ color: "oklch(0.55 0.04 265)" }}>
            <Music2 className="h-3.5 w-3.5" style={{ color: "oklch(0.68 0.16 168)" }} />
            Beat Maker
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-1" style={{ color: "oklch(0.92 0.02 265)" }}>Beat Maker</h1>
        <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.04 265)" }}>Klikk på cellene for å lage din egen beat</p>

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Genre */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(GENRES) as Genre[]).map(g => (
              <button key={g} onClick={() => handleGenreChange(g)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: genre === g ? "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))" : "oklch(0.20 0.05 280)",
                  color: genre === g ? "oklch(0.97 0.01 240)" : "oklch(0.65 0.04 265)",
                  border: `1px solid ${genre === g ? "transparent" : "oklch(0.32 0.06 280 / 0.4)"}`,
                }}
              >{GENRES[g].name}</button>
            ))}
          </div>

          {/* BPM */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs font-semibold" style={{ color: "oklch(0.68 0.16 168)" }}>{bpm} BPM</span>
            <input type="range" min={60} max={180} value={bpm} onChange={e => setBpm(Number(e.target.value))}
              className="w-24 accent-purple-500" />
          </div>
        </div>

        {/* Sequencer */}
        <div className="rounded-2xl border overflow-hidden mb-5" style={{ background: "oklch(0.15 0.05 280 / 0.9)", borderColor: "oklch(0.32 0.06 280 / 0.5)" }}>

          {/* Step numbers */}
          <div className="flex pl-12 pr-2 pt-3 pb-1 border-b" style={{ borderColor: "oklch(0.22 0.05 280)" }}>
            {Array.from({ length: STEPS }).map((_, i) => (
              <div key={i} className="flex-1 text-center text-xs select-none"
                style={{ color: currentStep === i ? "oklch(0.90 0.10 280)" : i % 4 === 0 ? "oklch(0.55 0.04 265)" : "oklch(0.30 0.04 265)" }}>
                {i % 4 === 0 ? i / 4 + 1 : "·"}
              </div>
            ))}
          </div>

          {/* Melody grid */}
          <div className="px-2 pt-2 pb-1">
            {DISPLAY_NOTES.map((note, rowIdx) => {
              const isBlack = [1,3,6,8,10].includes(note % 12);
              const isC = note % 12 === 0;
              return (
                <div key={note} className="flex items-center gap-0 mb-0.5">
                  <div className="w-10 text-right pr-2 text-xs flex-shrink-0 select-none"
                    style={{ color: isC ? "oklch(0.75 0.10 280)" : isBlack ? "oklch(0.40 0.04 265)" : "oklch(0.55 0.04 265)", fontSize: "10px", fontWeight: isC ? 700 : 400 }}>
                    {midiToNoteName(note)}
                  </div>
                  <div className="flex flex-1 gap-0.5">
                    {Array.from({ length: STEPS }).map((_, step) => {
                      const active = melodyGrid[step][rowIdx];
                      const isCurrent = currentStep === step;
                      return (
                        <button key={step}
                          onClick={() => toggleMelodyCell(step, rowIdx)}
                          className="flex-1 rounded-sm transition-all hover:opacity-80"
                          style={{
                            height: "15px",
                            background: active
                              ? isCurrent ? "oklch(0.90 0.15 280)" : "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))"
                              : isCurrent ? "oklch(0.28 0.06 280)"
                              : isBlack ? "oklch(0.17 0.04 280)" : "oklch(0.22 0.05 280)",
                            border: active ? "none" : "1px solid oklch(0.25 0.05 280 / 0.5)",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Drum grid */}
          <div className="border-t px-2 py-2" style={{ borderColor: "oklch(0.22 0.05 280)" }}>
            {(["kick", "snare", "hat"] as const).map(drum => (
              <div key={drum} className="flex items-center gap-0 mb-1">
                <div className="w-10 text-right pr-2 text-xs flex-shrink-0 capitalize select-none"
                  style={{ color: drumColors[drum], fontSize: "10px", fontWeight: 600 }}>{drum}</div>
                <div className="flex flex-1 gap-0.5">
                  {Array.from({ length: STEPS }).map((_, step) => {
                    const active = drums[drum][step];
                    const isCurrent = currentStep === step;
                    return (
                      <button key={step}
                        onClick={() => toggleDrumCell(drum, step)}
                        className="flex-1 rounded-sm transition-all hover:opacity-80"
                        style={{
                          height: "13px",
                          background: active
                            ? isCurrent ? "white" : drumColors[drum]
                            : isCurrent ? "oklch(0.28 0.06 280)" : "oklch(0.20 0.05 280)",
                          border: active ? "none" : "1px solid oklch(0.25 0.05 280 / 0.5)",
                          opacity: active ? 1 : 0.5,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <button onClick={playing ? stopPlayback : startPlayback}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))", color: "oklch(0.97 0.01 240)" }}>
            {playing ? <><Square className="h-4 w-4" /> Stop</> : <><Play className="h-4 w-4" /> Play</>}
          </button>
          <button onClick={handleGenerate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all hover:opacity-90"
            style={{ background: "oklch(0.22 0.05 280)", color: "oklch(0.80 0.04 265)", border: "1px solid oklch(0.32 0.06 280 / 0.5)" }}>
            <RefreshCw className="h-4 w-4" /> Auto-fill
          </button>
          <button onClick={handleClear}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all hover:opacity-90"
            style={{ background: "oklch(0.22 0.05 280)", color: "oklch(0.80 0.04 265)", border: "1px solid oklch(0.32 0.06 280 / 0.5)" }}>
            <Trash2 className="h-4 w-4" /> Tøm
          </button>
          <button onClick={handleDownload} disabled={downloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "oklch(0.22 0.05 280)", color: "oklch(0.80 0.04 265)", border: "1px solid oklch(0.32 0.06 280 / 0.5)" }}>
            {downloading ? "Eksporterer…" : "Last ned WAV"}
          </button>
        </div>
      </div>
    </div>
  );
}

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length * numChannels * 2;
  const ab = new ArrayBuffer(44 + length);
  const view = new DataView(ab);
  const write = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
  write(0, "RIFF"); view.setUint32(4, 36 + length, true); write(8, "WAVE"); write(12, "fmt ");
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true); view.setUint16(34, 16, true);
  write(36, "data"); view.setUint32(40, length, true);
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const s = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true); offset += 2;
    }
  }
  return ab;
}
