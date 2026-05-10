import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, X, Trophy, Zap, RotateCcw, Sparkles, Save } from "lucide-react";
import confetti from "canvas-confetti";
import { getModule, getGrade, type Grade, type Module } from "@/data/curriculum";
import { cn } from "@/lib/utils";
import { sfx } from "@/lib/sound";
import { recordQuizCompletion, saveDraft, loadDraft, clearDraft } from "@/lib/profile-store";

export const Route = createFileRoute("/quiz/$gradeId/$moduleId")({
  loader: ({ params }) => {
    const grade = getGrade(params.gradeId);
    const mod = getModule(params.gradeId, params.moduleId);
    if (!grade || !mod) throw notFound();
    return { grade, module: mod };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.module.title ?? "Quiz"} — iSchool` },
      { name: "description", content: loaderData?.module.description ?? "iSchool quiz." },
    ],
  }),
  component: QuizPage,
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <h1 className="text-3xl font-bold">Quiz not found</h1>
      <Link to="/grades" className="mt-4 inline-block text-neon underline">
        Back to grades
      </Link>
    </div>
  ),
});

const TIME_PER_QUESTION = 30; // seconds

function QuizPage() {
  const { grade, module: mod } = Route.useLoaderData() as { grade: Grade; module: Module };
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [finished, setFinished] = useState(false);
  const [shake, setShake] = useState(false);
  const [resumed, setResumed] = useState(false);
  const startedAtRef = useRef<number>(Date.now());

  const total = mod.questions.length;
  const q = mod.questions[index];

  // Restore draft on mount (client-only)
  useEffect(() => {
    const draft = loadDraft(grade.id, mod.id);
    if (draft && draft.index < total) {
      setIndex(draft.index);
      setAnswers(draft.answers);
      setResumed(true);
      const t = setTimeout(() => setResumed(false), 2400);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (finished) return;
    saveDraft(grade.id, mod.id, index, answers);
  }, [index, answers, finished, grade.id, mod.id]);

  // Timer
  useEffect(() => {
    if (locked || finished) return;
    if (timeLeft <= 0) {
      handleSubmit(null);
      return;
    }
    if (timeLeft <= 5) sfx.tick();
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, locked, finished]);

  // Keyboard 1-4 to choose
  useEffect(() => {
    if (locked || finished) return;
    function onKey(e: KeyboardEvent) {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= q.options.length) handleSubmit(n - 1);
      if (e.key === "Enter" && locked) handleNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, locked, finished]);

  function handleSubmit(choice: number | null) {
    if (locked) return;
    setLocked(true);
    setSelected(choice);
    const correct = choice === q.answer;
    setAnswers((prev) => [...prev, correct ? choice : choice ?? -1]);
    if (correct) {
      sfx.correct();
    } else {
      sfx.wrong();
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  function handleNext() {
    sfx.click();
    if (index + 1 >= total) {
      finishQuiz();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setLocked(false);
    setTimeLeft(TIME_PER_QUESTION);
  }

  function finishQuiz() {
    const correctCount = answers.reduce<number>(
      (acc, ans, i) => (ans === mod.questions[i].answer ? acc + 1 : acc),
      0,
    );
    const pct = Math.round((correctCount / total) * 100);
    const earnedXp = Math.round(mod.xp * (correctCount / total));
    const durationSec = Math.round((Date.now() - startedAtRef.current) / 1000);
    recordQuizCompletion({
      gradeId: grade.id,
      moduleId: mod.id,
      scorePct: pct,
      earnedXp,
      durationSec,
    });
    clearDraft(grade.id, mod.id);
    setFinished(true);
  }

  function handleRetry() {
    sfx.click();
    setIndex(0);
    setSelected(null);
    setLocked(false);
    setAnswers([]);
    setTimeLeft(TIME_PER_QUESTION);
    setFinished(false);
    startedAtRef.current = Date.now();
  }

  if (finished) {
    const correct = answers.reduce<number>(
      (acc, ans, i) => (ans === mod.questions[i].answer ? acc + 1 : acc),
      0,
    );
    return (
      <ResultScreen
        score={correct}
        total={total}
        xp={mod.xp}
        moduleTitle={mod.title}
        onRetry={handleRetry}
        onBack={() => navigate({ to: "/grades/$gradeId", params: { gradeId: grade.id } })}
      />
    );
  }

  const progress = ((index + (locked ? 1 : 0)) / total) * 100;
  const timePct = (timeLeft / TIME_PER_QUESTION) * 100;

  return (
    <div className="py-8 sm:py-12">
      <AnimatePresence>
        {resumed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-neon/15 px-4 py-1.5 text-xs text-neon"
          >
            <Save className="h-3.5 w-3.5" />
            Resumed where you left off
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/grades/$gradeId"
          params={{ gradeId: grade.id }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit
        </Link>
        <div className="text-xs font-medium text-muted-foreground">
          Question <span className="text-foreground">{index + 1}</span> / {total}
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full bg-gradient-primary"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Timer */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-glow" />
          {mod.title}
        </div>
        <div
          className={cn(
            "rounded-full px-3 py-1 font-mono font-semibold tabular-nums",
            timeLeft <= 5 ? "bg-destructive/20 text-destructive" : "bg-white/5 text-foreground",
          )}
        >
          {timeLeft}s
        </div>
      </div>
      <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className={cn(
            "h-full",
            timeLeft <= 5 ? "bg-destructive" : "bg-gradient-accent",
          )}
          initial={false}
          animate={{ width: `${timePct}%` }}
          transition={{ duration: 0.4, ease: "linear" }}
        />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "mt-8 rounded-3xl glass p-6 shadow-elegant sm:p-10",
            shake && "animate-shake",
          )}
        >
          <h2 className="text-2xl font-bold leading-snug sm:text-3xl">{q.prompt}</h2>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = locked && i === q.answer;
              const isWrong = locked && isSelected && i !== q.answer;
              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => handleSubmit(i)}
                  disabled={locked}
                  whileHover={locked ? undefined : { scale: 1.02 }}
                  whileTap={locked ? undefined : { scale: 0.98 }}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border p-5 text-left transition-all",
                    "border-border bg-white/5 hover:border-neon/60 hover:bg-white/10",
                    isSelected && !locked && "border-neon bg-neon/10",
                    isCorrect && "border-success bg-success/15 shadow-[0_0_30px_-6px_var(--success)]",
                    isWrong && "border-destructive bg-destructive/15",
                    locked && "cursor-not-allowed",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-sm font-bold",
                        "border-border bg-white/5",
                        isCorrect && "border-success bg-success text-success-foreground",
                        isWrong && "border-destructive bg-destructive text-destructive-foreground",
                      )}
                    >
                      {isCorrect ? (
                        <Check className="h-4 w-4" />
                      ) : isWrong ? (
                        <X className="h-4 w-4" />
                      ) : (
                        String.fromCharCode(65 + i)
                      )}
                    </div>
                    <span className="text-base font-medium">{opt}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {locked && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex items-center justify-end"
            >
              <button
                onClick={handleNext}
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow-blue transition-transform hover:scale-105"
              >
                {index + 1 >= total ? "See result" : "Next"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* -------------------- RESULT SCREEN -------------------- */

function ResultScreen({
  score,
  total,
  xp,
  moduleTitle,
  onRetry,
  onBack,
}: {
  score: number;
  total: number;
  xp: number;
  moduleTitle: string;
  onRetry: () => void;
  onBack: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const earnedXp = Math.round(xp * (score / total));
  const passed = pct >= 60;
  const perfect = pct === 100;

  // Animated score number
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const dur = 1400;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      setDisplayed(Math.round(p * pct));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [pct]);

  // Confetti for great results — client-only via useEffect (SSR-safe)
  useEffect(() => {
    if (!passed) return;
    const burst = () =>
      confetti({
        particleCount: perfect ? 220 : 120,
        spread: 90,
        startVelocity: 45,
        origin: { y: 0.55 },
        colors: ["#3b82f6", "#a855f7", "#f97316", "#22d3ee"],
      });
    burst();
    if (perfect) {
      const t1 = setTimeout(burst, 350);
      const t2 = setTimeout(burst, 800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [passed, perfect]);

  const message = perfect
    ? "Flawless. You're a legend."
    : passed
      ? "Great work — you leveled up!"
      : "Close one. Try again and crush it.";

  // Score circle math
  const R = 70;
  const C = 2 * Math.PI * R;

  return (
    <div className="py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-2xl rounded-3xl glass p-8 text-center shadow-elegant sm:p-12"
      >
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-glow">
          {moduleTitle} · Result
        </div>

        {/* Animated score circle */}
        <div className="relative mx-auto mt-8 h-44 w-44">
          <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.72 0.22 250)" />
                <stop offset="100%" stopColor="oklch(0.65 0.24 305)" />
              </linearGradient>
            </defs>
            <circle
              cx="80"
              cy="80"
              r={R}
              stroke="oklch(1 0 0 / 10%)"
              strokeWidth="12"
              fill="none"
            />
            <motion.circle
              cx="80"
              cy="80"
              r={R}
              stroke="url(#scoreGrad)"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C - (C * pct) / 100 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div>
              <div className="text-5xl font-bold text-gradient-primary tabular-nums">
                {displayed}%
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {score} / {total} correct
              </div>
            </div>
          </div>
        </div>

        <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">{message}</h1>

        {/* XP + badge */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 rounded-2xl bg-glow/15 px-5 py-3 text-glow"
          >
            <Zap className="h-5 w-5" />
            <span className="font-semibold">+{earnedXp} XP</span>
          </motion.div>
          {passed && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="inline-flex items-center gap-2 rounded-2xl bg-violet/15 px-5 py-3 text-violet"
            >
              <Trophy className="h-5 w-5" />
              <span className="font-semibold">
                {perfect ? "Perfect Score Badge" : "Module Cleared"}
              </span>
            </motion.div>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white/5 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" />
            Replay
          </button>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow-blue transition-transform hover:scale-105"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
