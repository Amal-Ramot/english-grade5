'use client';
import { useCallback, useEffect, useState } from 'react';

export type Save = {
  xp: number;
  stars: Record<string, number>;
  streak: number;
  last: string;
  muted: boolean;
};

const KEY = 'english-quest-v1';
const EMPTY: Save = { xp: 0, stars: {}, streak: 0, last: '', muted: false };

let muted = false;
export const isMuted = () => muted;

const day = (offset = 0) => {
  const d = new Date(Date.now() + offset * 864e5);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export function useSave() {
  const [save, setSave] = useState<Save>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = { ...EMPTY, ...JSON.parse(raw) } as Save;
        muted = s.muted;
        setSave(s);
      }
    } catch {}
    setReady(true);
  }, []);

  const update = useCallback((fn: (s: Save) => Save) => {
    setSave((prev) => {
      const next = fn(prev);
      muted = next.muted;
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { save, ready, update };
}

export function finishLevel(s: Save, id: string, stars: number, xp: number): Save {
  const today = day();
  const streak = s.last === today ? s.streak : s.last === day(-1) ? s.streak + 1 : 1;
  return {
    ...s,
    xp: s.xp + xp,
    stars: { ...s.stars, [id]: Math.max(s.stars[id] ?? 0, stars) },
    streak,
    last: today,
  };
}

// ---------- sound ----------
let ctx: AudioContext | null = null;
function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.12) {
  if (muted || typeof window === 'undefined') return;
  try {
    ctx ??= new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    const t = ctx.currentTime + start;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur);
  } catch {}
}
export const sfx = {
  tap: () => tone(520, 0, 0.06, 'triangle', 0.06),
  correct: () => { tone(660, 0, 0.12, 'triangle'); tone(990, 0.1, 0.2, 'triangle'); },
  wrong: () => { tone(220, 0, 0.18, 'sawtooth', 0.06); tone(170, 0.12, 0.22, 'sawtooth', 0.06); },
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3, 'triangle')),
};

export function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/_+/g, ', ,'));
    u.lang = 'en-US';
    u.rate = 0.85;
    speechSynthesis.speak(u);
  } catch {}
}
