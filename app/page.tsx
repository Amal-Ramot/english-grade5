'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'motion/react';
import { LEVELS, VOCAB } from '@/lib/data';
import { sfx, speak, useSave } from '@/lib/store';

const XP_PER_RANK = 200;
const RANKS = ['Explorer', 'Ranger', 'Champion', 'Hero', 'Legend'];

export default function Home() {
  const { save, ready, update } = useSave();
  const totalStars = Object.values(save.stars).reduce((a, b) => a + b, 0);
  const rank = Math.floor(save.xp / XP_PER_RANK);
  const next = LEVELS.find((l) => !save.stars[l.id]) ?? LEVELS[0];

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      {/* top bar */}
      <header className="flex items-center justify-between gap-3 py-5">
        <div dir="ltr" className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight">
          <span className="chunk chunk-sm grid h-11 w-11 place-items-center text-lg" style={{ '--c': '#FFD84D' } as React.CSSProperties}>Aa</span>
          <span className="hidden sm:inline">English Quest</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold sm:text-base" style={{ visibility: ready ? 'visible' : 'hidden' }}>
          <Pill label="ימים ברצף">🔥 {save.streak}</Pill>
          <Pill label="כוכבים">⭐ {totalStars}<span className="text-ink-soft">/18</span></Pill>
          <Pill label="נקודות">💎 {save.xp}</Pill>
          <button
            aria-label={save.muted ? 'הפעלת צלילים' : 'השתקת צלילים'}
            onClick={() => update((s) => ({ ...s, muted: !s.muted }))}
            className="chunk chunk-sm grid h-10 w-10 place-items-center bg-white"
          >
            {save.muted ? '🔇' : '🔊'}
          </button>
        </div>
      </header>

      {/* hero */}
      <section
        className="chunk relative mt-2 overflow-hidden px-6 py-10 sm:px-12 sm:py-14"
        style={{ '--c': '#2b2440', borderRadius: 36 } as React.CSSProperties}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 select-none text-5xl sm:text-6xl">
          <span className="float absolute left-[6%] top-[12%]">⛰️</span>
          <span className="float absolute left-[24%] bottom-[8%]" style={{ animationDelay: '-1.5s' }}>🚲</span>
          <span className="float absolute left-[40%] top-[10%] hidden sm:block" style={{ animationDelay: '-3s' }}>🌲</span>
          <span className="float absolute left-[8%] bottom-[14%] hidden sm:block" style={{ animationDelay: '-2.2s' }}>🐶</span>
        </div>
        <div className="relative max-w-xl text-white">
          <p dir="ltr" className="mb-3 inline-block rounded-full bg-white/15 px-4 py-1 font-display text-sm font-semibold tracking-wide text-[#FFD84D]">
            GRADE 5 · {RANKS[Math.min(rank, RANKS.length - 1)].toUpperCase()}
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.1] sm:text-6xl">
            אנגלית זה <span className="text-[#FFD84D]">משחק</span>.
            <br />
            בואו נשחק!
          </h1>
          <p className="mt-4 max-w-md text-lg text-white/80">
            שישה משחקים קצרים שמכינים אתכם למבחן: סיפור, מילים חדשות ו־
            <span dir="ltr" className="font-display font-semibold">am / is / are</span>.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href={`/play/${next.id}`}
              onClick={() => sfx.tap()}
              className="chunk inline-flex items-center gap-2 px-7 py-4 font-display text-xl font-bold text-ink"
              style={{ '--c': '#FFD84D', boxShadow: '0 6px 0 #D9A800', borderColor: '#D9A800' } as React.CSSProperties}
            >
              {totalStars ? 'ממשיכים' : 'מתחילים'} <span aria-hidden>◀</span>
            </Link>
            <div className="min-w-40 flex-1 sm:max-w-56">
              <div className="mb-1 flex justify-between text-xs font-semibold text-white/70">
                <span>רמה {rank + 1}</span>
                <span dir="ltr">{save.xp % XP_PER_RANK} / {XP_PER_RANK} XP</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/15">
                <motion.div
                  className="h-full rounded-full bg-[#4FE0A6]"
                  initial={false}
                  animate={{ width: `${((save.xp % XP_PER_RANK) / XP_PER_RANK) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* levels */}
      <h2 className="mb-5 mt-14 font-display text-3xl font-bold">המשחקים</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LEVELS.map((l, i) => {
          const stars = save.stars[l.id] ?? 0;
          return (
            <motion.div key={l.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, type: 'spring', bounce: 0.4 }}>
              <Link
                href={`/play/${l.id}`}
                onClick={() => sfx.tap()}
                className="chunk group flex h-full flex-col p-5"
                style={{ '--c': l.c } as React.CSSProperties}
              >
                <div className="flex items-start justify-between">
                  <span className="wiggle grid h-16 w-16 place-items-center rounded-2xl border-[2.5px] border-ink bg-white text-4xl">{l.emoji}</span>
                  <span dir="ltr" className="rounded-full bg-ink px-3 py-1 font-display text-xs font-semibold tracking-wide text-white">
                    {l.n} · {l.en.toUpperCase()}
                  </span>
                </div>
                <h3 dir="auto" className="mt-4 font-display text-2xl font-bold">{l.title}</h3>
                <p className="mt-1 flex-1 text-[15px] font-medium text-ink/75">{l.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl tracking-wider" aria-label={`${stars} מתוך 3 כוכבים`}>
                    {[1, 2, 3].map((n) => (
                      <span key={n} style={{ opacity: n <= stars ? 1 : 0.25, filter: n <= stars ? 'none' : 'grayscale(1)' }}>⭐</span>
                    ))}
                  </span>
                  <span className="rounded-full border-[2.5px] border-ink bg-white px-4 py-1.5 text-sm font-bold transition-transform group-hover:-translate-x-1">
                    {stars ? 'שוב!' : 'שחקו'} ◀
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* vocabulary */}
      <h2 className="mb-1 mt-16 font-display text-3xl font-bold">המילים שלי</h2>
      <p className="mb-5 font-medium text-ink-soft">לחצו על כרטיס כדי לשמוע את המילה ולראות את הפירוש.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {VOCAB.map((v) => (
          <WordCard key={v.en} {...v} />
        ))}
      </div>

      <footer className="mt-16 text-center text-sm font-medium text-ink-soft">
        ההתקדמות נשמרת במכשיר הזה בלבד · Grade 5 English Home Practice
      </footer>
    </main>
  );
}

function Pill({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <span title={label} className="chunk chunk-sm flex h-10 items-center gap-1 bg-white px-3" dir="ltr">
      {children}
    </span>
  );
}

function WordCard({ en, he, emoji }: { en: string; he: string; emoji: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      className="flip h-28 text-center"
      data-on={on}
      onClick={() => {
        if (!on) speak(en);
        setOn(!on);
      }}
    >
      <div className="flip-inner relative h-full w-full">
        <div className="flip-face chunk chunk-sm absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white">
          <span className="text-3xl">{emoji}</span>
          <span dir="ltr" className="font-display text-lg font-semibold">{en}</span>
        </div>
        <div className="flip-face flip-back chunk chunk-sm absolute inset-0 flex flex-col items-center justify-center gap-1 px-2" style={{ '--c': '#FFD84D' } as React.CSSProperties}>
          <span className="text-lg font-bold leading-tight">{he}</span>
          <span dir="ltr" className="font-display text-sm text-ink/60">{en}</span>
        </div>
      </div>
    </button>
  );
}
