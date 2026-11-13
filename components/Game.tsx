'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { GLOSSARY, LEVELS, buildRound, shuffle, type LevelId, type Q, type Round, type Vocab } from '@/lib/data';
import { finishLevel, sfx, speak, useSave } from '@/lib/store';

type Css = React.CSSProperties;

export default function Game({ id }: { id: LevelId }) {
  const level = LEVELS.find((l) => l.id === id)!;
  const { save, ready, update } = useSave();
  const [round, setRound] = useState<Round | null>(null);
  const [seed, setSeed] = useState(0);
  const [phase, setPhase] = useState<'story' | 'play' | 'done'>('play');
  const [i, setI] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [combo, setCombo] = useState(0);
  const [result, setResult] = useState<{ stars: number; xp: number } | null>(null);

  useEffect(() => {
    if (!ready) return;
    const r = buildRound(id, !save.stars[id]);
    setRound(r);
    setPhase(r.story ? 'story' : 'play');
    setI(0);
    setMistakes(0);
    setCombo(0);
    setResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, id, seed]);

  const total = round ? (round.pairs ? round.pairs.flat().length : round.qs.length) : 1;
  const progress = phase === 'done' ? 1 : (round?.pairs ? i : i) / total;

  function onAnswer(ok: boolean) {
    if (ok) {
      setCombo((c) => c + 1);
      sfx.correct();
    } else {
      setCombo(0);
      setMistakes((m) => m + 1);
      sfx.wrong();
    }
  }

  function finish(m = mistakes) {
    const ratio = Math.max(0, 1 - m / total);
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1;
    const xp = total * 10 - m * 4 + stars * 10;
    setResult({ stars, xp });
    update((s) => finishLevel(s, id, stars, xp));
    setPhase('done');
    sfx.win();
    const colors = [level.c, '#FFD84D', '#FF8CC6', '#4FE0A6', '#5CC8FF'];
    confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 }, colors });
    setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0 }, colors }), 250);
    setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1 }, colors }), 400);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 pb-10 sm:px-6" style={{ '--lc': level.c, '--lcd': level.cd } as Css}>
      {/* top bar */}
      <header className="flex items-center gap-3 py-5">
        <Link href="/" aria-label="חזרה למסך הבית" onClick={() => sfx.tap()} className="chunk chunk-sm grid h-11 w-11 shrink-0 place-items-center bg-white text-xl font-bold">
          ✕
        </Link>
        <div className="relative h-5 flex-1 overflow-hidden rounded-full border-[2.5px] border-ink bg-white">
          <motion.div
            className="absolute inset-y-0 right-0 rounded-full"
            style={{ background: level.c }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: 'spring', bounce: 0.3 }}
          />
          <div className="absolute inset-x-2 top-[3px] h-1 rounded-full bg-white/50" />
        </div>
        <AnimatePresence>
          {combo >= 3 && phase === 'play' && (
            <motion.span
              key={combo}
              initial={{ scale: 0.4, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              className="chunk chunk-sm shrink-0 px-3 py-1.5 font-display text-sm font-bold"
              style={{ '--c': '#FFD84D' } as Css}
              dir="ltr"
            >
              🔥 x{combo}
            </motion.span>
          )}
        </AnimatePresence>
      </header>

      <div className="mb-2 flex items-center gap-2">
        <span className="text-2xl">{level.emoji}</span>
        <h1 className="font-display text-xl font-bold">{level.title}</h1>
      </div>

      {!round ? null : phase === 'story' ? (
        <StoryView round={round} onGo={() => { sfx.tap(); setPhase('play'); }} />
      ) : phase === 'done' && result ? (
        <Done stars={result.stars} xp={result.xp} mistakes={mistakes} total={total} onAgain={() => setSeed((s) => s + 1)} levelIdx={level.n} />
      ) : round.pairs ? (
        <MatchView
          pairs={round.pairs}
          onAnswer={(ok) => { onAnswer(ok); if (ok) setI((n) => n + 1); }}
          onDone={() => finish()}
        />
      ) : (
        <QuizView
          key={seed}
          round={round}
          i={i}
          onAnswer={onAnswer}
          onNext={() => (i + 1 >= round.qs.length ? finish() : setI(i + 1))}
        />
      )}
    </main>
  );
}

// ---------------- story ----------------
function StoryView({ round, onGo }: { round: Round; onGo: () => void }) {
  const s = round.story!;
  const [word, setWord] = useState<{ en: string; he: string } | null>(null);
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col">
      <p className="mb-4 font-medium text-ink-soft">קראו את הסיפור. 💡 לחצו על מילה כדי לראות מה היא אומרת.</p>
      <article dir="ltr" className="chunk bg-white p-6 text-left sm:p-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{s.emoji} {s.title}</h2>
          <button onClick={() => speak(s.paragraphs.join(' '))} className="chunk chunk-sm shrink-0 bg-[#E3F5FF] px-3 py-2 text-sm font-bold" aria-label="Listen to the story">
            🔊 Listen
          </button>
        </div>
        <div className="space-y-3 text-lg leading-relaxed sm:text-xl">
          {s.paragraphs.map((p, pi) => (
            <p key={pi}>
              {p.split(/(\s+)/).map((tok, ti) => {
                const clean = tok.toLowerCase().replace(/[^a-z']/g, '').replace(/'s$/, '');
                const he = GLOSSARY[clean];
                if (!he) return <span key={ti}>{tok}</span>;
                return (
                  <button
                    key={ti}
                    onClick={() => { setWord({ en: clean, he }); speak(clean); }}
                    className="rounded-md decoration-[#5CC8FF] decoration-2 underline-offset-4 hover:bg-[#E3F5FF] hover:underline"
                  >
                    {tok}
                  </button>
                );
              })}
            </p>
          ))}
        </div>
      </article>
      <div className="h-16 py-3 text-center">
        <AnimatePresence mode="wait">
          {word && (
            <motion.div key={word.en} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
              className="chunk chunk-sm inline-flex items-center gap-3 px-4 py-2 text-lg font-bold" style={{ '--c': '#FFD84D' } as Css}>
              <span dir="ltr" className="font-display">{word.en}</span> = <span>{word.he}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BigButton onClick={onGo}>קראתי! לשאלות ◀</BigButton>
    </motion.section>
  );
}

// ---------------- quiz ----------------
function QuizView({ round, i, onAnswer, onNext }: { round: Round; i: number; onAnswer: (ok: boolean) => void; onNext: () => void }) {
  const q = round.qs[i];
  const [picked, setPicked] = useState<string | null>(null);
  const [wrongs, setWrongs] = useState<string[]>([]);
  const [used, setUsed] = useState<string[]>([]);
  const [shakeKey, setShakeKey] = useState(0);
  const solved = picked === q.answer;
  const firstTry = wrongs.length === 0;

  useEffect(() => { setPicked(null); setWrongs([]); }, [i]);

  // word bank: options = unused bank words
  const options = round.bank ? round.bank : q.options;

  function choose(o: string) {
    if (solved || wrongs.includes(o)) return;
    if (o === q.answer) {
      setPicked(o);
      if (firstTry) onAnswer(true); else sfx.correct();
      if (round.bank) setUsed((u) => [...u, o]);
      if (q.kind !== 'word') speak(q.prompt.replace('___', o));
    } else {
      if (firstTry) onAnswer(false); else sfx.wrong();
      setWrongs((w) => [...w, o]);
      setShakeKey((k) => k + 1);
    }
  }

  // keyboard: 1-4 / Enter
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (solved && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onNext(); return; }
      const n = Number(e.key);
      if (!round.bank && n >= 1 && n <= options.length) choose(options[n - 1]);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  const parts = q.prompt.split('___');

  return (
    <div className="flex flex-1 flex-col">
      <p className="mb-4 font-medium text-ink-soft">{q.he}</p>
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 60, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.35, duration: 0.45 }}
          className="flex flex-1 flex-col"
        >
          {/* question card */}
          <div key={shakeKey} className={`chunk relative bg-white p-6 sm:p-8 ${shakeKey ? 'shake' : ''}`}>
            <button onClick={() => speak(q.kind === 'word' ? q.prompt : q.prompt.replace('___', '...'))} aria-label="Listen"
              className="chunk chunk-sm absolute left-4 top-4 grid h-10 w-10 place-items-center bg-[#E3F5FF] text-lg">🔊</button>
            {q.kind === 'word' ? (
              <div className="py-4 text-center" dir="ltr">
                <div className="text-6xl">{q.emoji}</div>
                <div className="mt-3 font-display text-4xl font-bold sm:text-5xl">{q.prompt}</div>
              </div>
            ) : (
              <p dir="ltr" className="pr-2 pt-8 text-left font-display text-2xl font-medium leading-snug sm:pt-2 sm:pl-14 sm:text-3xl">
                {q.kind === 'tf' ? (
                  q.prompt
                ) : (
                  <>
                    {parts[0]}
                    <span
                      className="mx-1 inline-block min-w-24 rounded-xl border-b-4 px-2 text-center transition-colors"
                      style={{ borderColor: solved ? 'var(--color-ok)' : 'var(--color-line)', color: solved ? 'var(--color-ok)' : undefined, background: solved ? '#E4F8EC' : '#F7F1E5' }}
                    >
                      {solved ? picked : ' '}
                    </span>
                    {parts[1]}
                  </>
                )}
              </p>
            )}
          </div>

          {/* options */}
          <div
            dir={q.rtl ? 'rtl' : 'ltr'}
            className={`mt-6 grid gap-3 ${round.bank ? 'grid-cols-2 sm:grid-cols-5' : options.length === 2 ? 'grid-cols-2' : options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}
          >
            {options.map((o, k) => {
              const isUsed = round.bank && used.includes(o) && o !== picked;
              const wrong = wrongs.includes(o);
              const right = solved && o === q.answer;
              const bg = right ? '#4FE0A6' : wrong ? '#FFD3D3' : '#fff';
              return (
                <motion.button
                  key={o}
                  layout
                  whileTap={{ scale: 0.96 }}
                  disabled={!!isUsed || wrong || solved}
                  onClick={() => choose(o)}
                  className={`chunk ${round.bank ? 'chunk-sm px-2 py-3 text-lg' : 'px-4 py-5 text-xl sm:text-2xl'} font-display font-semibold`}
                  style={{ '--c': bg, opacity: isUsed ? 0.3 : wrong ? 0.6 : 1, textDecoration: isUsed || wrong ? 'line-through' : 'none' } as Css}
                >
                  {!round.bank && <span className="ml-2 mr-2 align-middle text-xs text-ink/40">{k + 1}</span>}
                  {o === 'True' ? '✅ True' : o === 'False' ? '❌ False' : o}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* feedback bar */}
      <div className="mt-auto pt-6">
        <AnimatePresence>
          {solved && (
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="chunk flex flex-wrap items-center justify-between gap-3 p-4"
              style={{ '--c': firstTry ? '#DDF9EA' : '#FFF3D1' } as Css}>
              <span dir="auto" className="font-display text-xl font-bold">{firstTry ? praise() : 'בסדר! בפעם הבאה בפעם הראשונה 😉'}</span>
              <BigButton onClick={onNext} small>המשך ◀</BigButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const PRAISE = ['מעולה! 🎉', 'כל הכבוד! ⭐', 'Great job! 🙌', 'יפה מאוד! 💪', 'Awesome! 🚀', 'Perfect! ✨'];
const praise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];

// ---------------- match ----------------
function MatchView({ pairs, onAnswer, onDone }: { pairs: Vocab[][]; onAnswer: (ok: boolean) => void; onDone: () => void }) {
  const [board, setBoard] = useState(0);
  const set = pairs[board];
  const right = useMemo(() => shuffle(set), [set]);
  const [selEn, setSelEn] = useState<string | null>(null);
  const [selHe, setSelHe] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [bad, setBad] = useState<string[]>([]);

  useEffect(() => { setDone([]); setSelEn(null); setSelHe(null); }, [board]);

  useEffect(() => {
    if (!selEn || !selHe) return;
    if (selEn === selHe) {
      onAnswer(true);
      const nd = [...done, selEn];
      setDone(nd);
      setSelEn(null); setSelHe(null);
      if (nd.length === set.length) {
        setTimeout(() => (board + 1 < pairs.length ? setBoard(board + 1) : onDone()), 500);
      }
    } else {
      onAnswer(false);
      setBad([selEn, selHe]);
      const t = setTimeout(() => { setBad([]); setSelEn(null); setSelHe(null); }, 550);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selEn, selHe]);

  const tile = (key: string, active: boolean, isDone: boolean, isBad: boolean): Css => ({
    '--c': isDone ? '#4FE0A6' : isBad ? '#FFD3D3' : active ? '#B79CFF' : '#fff',
    opacity: isDone ? 0.45 : 1,
  } as Css);

  return (
    <div className="flex flex-1 flex-col">
      <p className="mb-4 font-medium text-ink-soft">בחרו מילה באנגלית ואת הפירוש שלה בעברית. לוח {board + 1} מתוך {pairs.length}</p>
      <AnimatePresence mode="wait">
        <motion.div key={board} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3" dir="ltr">
            {set.map((v) => (
              <button key={v.en} disabled={done.includes(v.en)}
                onClick={() => { sfx.tap(); speak(v.en); setSelEn(v.en); }}
                className={`chunk chunk-sm px-3 py-4 font-display text-lg font-semibold sm:text-xl ${bad.includes(v.en) && bad[0] === v.en ? 'shake' : ''}`}
                style={tile(v.en, selEn === v.en, done.includes(v.en), bad[0] === v.en)}>
                {v.emoji} {v.en}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {right.map((v) => (
              <button key={v.en} disabled={done.includes(v.en)}
                onClick={() => { sfx.tap(); setSelHe(v.en); }}
                className={`chunk chunk-sm px-3 py-4 text-lg font-bold sm:text-xl ${bad[1] === v.en ? 'shake' : ''}`}
                style={tile(v.en, selHe === v.en, done.includes(v.en), bad[1] === v.en)}>
                {v.he}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ---------------- done ----------------
function Done({ stars, xp, mistakes, total, onAgain, levelIdx }: { stars: number; xp: number; mistakes: number; total: number; onAgain: () => void; levelIdx: number }) {
  const next = LEVELS[levelIdx % LEVELS.length];
  const title = stars === 3 ? 'מושלם!' : stars === 2 ? 'כל הכבוד!' : 'סיימתם!';
  return (
    <motion.section initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
      className="chunk mt-4 flex flex-col items-center bg-white p-8 text-center">
      <div className="flex gap-2 text-6xl sm:text-7xl">
        {[1, 2, 3].map((n) => (
          <motion.span key={n} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.25 + n * 0.2, type: 'spring', bounce: 0.6 }}
            style={{ filter: n <= stars ? 'none' : 'grayscale(1)', opacity: n <= stars ? 1 : 0.3, display: 'inline-block' }}>
            ⭐
          </motion.span>
        ))}
      </div>
      <h2 className="mt-4 font-display text-4xl font-bold">{title}</h2>
      <p className="mt-2 text-lg font-medium text-ink-soft">
        {total - Math.min(mistakes, total)} מתוך {total} בניסיון הראשון
      </p>
      <div dir="ltr" className="chunk chunk-sm mt-5 px-5 py-2 font-display text-2xl font-bold" style={{ '--c': '#EFE8FF' } as Css}>
        +{xp} 💎
      </div>
      {stars < 3 && <p className="mt-4 font-medium">💡 נסו שוב כדי להשיג 3 כוכבים — השאלות מתחלפות!</p>}
      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <BigButton onClick={onAgain} alt>🔄 שוב</BigButton>
        <Link href={`/play/${next.id}`} onClick={() => sfx.tap()} className="chunk flex-1 px-6 py-4 font-display text-xl font-bold"
          style={{ '--c': next.c } as Css}>
          {next.emoji} המשחק הבא ◀
        </Link>
      </div>
      <Link href="/" className="mt-5 font-bold text-ink-soft underline underline-offset-4">למסך הבית</Link>
    </motion.section>
  );
}

function BigButton({ children, onClick, small, alt }: { children: React.ReactNode; onClick: () => void; small?: boolean; alt?: boolean }) {
  return (
    <button onClick={onClick}
      className={`chunk font-display font-bold ${small ? 'px-6 py-3 text-lg' : 'flex-1 px-6 py-4 text-xl'}`}
      style={{ '--c': alt ? '#fff' : 'var(--lc)' } as Css}>
      {children}
    </button>
  );
}
