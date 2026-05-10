import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Zap, Brain, Star, Flame, Rocket, Pencil, RotateCcw, ArrowRight } from "lucide-react";
import { useState } from "react";
import {
  useProfile,
  levelInfo,
  ALL_BADGES,
  AVATAR_OPTIONS,
  setProfile,
  resetProfile,
  getCompletedCount,
  getTotalModules,
  getNextModule,
  type Badge,
} from "@/lib/profile-store";
import { grades, getModule } from "@/data/curriculum";
import { GlassCard } from "@/components/GlassCard";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — iSchool" },
      { name: "description", content: "Track your XP, badges, streaks and learning progress." },
    ],
  }),
  component: ProfilePage,
});

const ICONS = { trophy: Trophy, zap: Zap, brain: Brain, star: Star, flame: Flame, rocket: Rocket };

function ProfilePage() {
  const { profile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const lvl = levelInfo(profile.xp);
  const total = getTotalModules();
  const done = getCompletedCount(profile);
  const next = getNextModule(profile);

  const earnedIds = new Set(profile.badges.map((b) => b.id));

  return (
    <div className="py-12 sm:py-20">
      {/* HEADER CARD */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl glass p-6 shadow-elegant sm:p-10"
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-primary text-5xl shadow-glow-blue">
            {profile.avatar}
          </div>
          <div className="flex-1 text-center sm:text-left">
            {editing ? (
              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 24))}
                  className="rounded-xl border border-border bg-white/5 px-3 py-2 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setProfile({ name: name.trim() || "Cadet" });
                    setEditing(false);
                  }}
                  className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{profile.name}</h1>
                <button
                  onClick={() => setEditing(true)}
                  aria-label="Edit name"
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="mt-1 text-sm text-muted-foreground">
              Level {lvl.level} · {profile.xp} XP total
            </div>

            {/* Level progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Level {lvl.level}</span>
                <span>
                  {lvl.intoLevel} / {lvl.need} XP
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${lvl.percent}%` }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-gradient-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* avatar picker */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 sm:justify-start">
          {AVATAR_OPTIONS.map((a) => (
            <button
              key={a}
              onClick={() => setProfile({ avatar: a })}
              aria-label={`Choose avatar ${a}`}
              className={`grid h-10 w-10 place-items-center rounded-xl border text-xl transition-all hover:scale-110 ${
                profile.avatar === a
                  ? "border-neon bg-neon/10 shadow-glow-blue"
                  : "border-border bg-white/5"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </motion.div>

      {/* STATS */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat icon={Zap} label="Total XP" value={profile.xp} accent="glow" />
        <Stat icon={Flame} label="Day streak" value={profile.streak} accent="orange" />
        <Stat icon={Trophy} label="Badges" value={profile.badges.length} accent="violet" />
        <Stat icon={Star} label="Modules" value={`${done}/${total}`} accent="neon" />
      </div>

      {/* CONTINUE */}
      {next && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <GlassCard glow="blue" className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-glow">
                Continue learning
              </div>
              <h2 className="mt-2 text-xl font-bold">
                {getModule(next.grade.id, next.moduleId)?.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {next.grade.title} · {next.grade.ageRange}
              </p>
            </div>
            <Link
              to="/quiz/$gradeId/$moduleId"
              params={{ gradeId: next.grade.id, moduleId: next.moduleId }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow-blue transition-transform hover:scale-105"
            >
              Resume <ArrowRight className="h-4 w-4" />
            </Link>
          </GlassCard>
        </motion.div>
      )}

      {/* BADGES */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Badges</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile.badges.length} of {ALL_BADGES.length} unlocked
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {ALL_BADGES.map((b) => {
            const Icon = ICONS[b.icon];
            const earned = earnedIds.has(b.id);
            const earnedBadge = profile.badges.find((x) => x.id === b.id) as Badge | undefined;
            return (
              <motion.div
                key={b.id}
                whileHover={{ y: -4 }}
                className={`rounded-2xl border p-5 text-center transition-all ${
                  earned
                    ? "border-glow/40 bg-glow/10 shadow-glow-orange"
                    : "border-border bg-white/[0.02] opacity-60 grayscale"
                }`}
              >
                <div
                  className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${
                    earned ? "bg-glow/20 text-glow animate-pop-in" : "bg-white/5 text-muted-foreground"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-3 text-sm font-bold">{b.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{b.desc}</div>
                {earnedBadge && (
                  <div className="mt-2 text-[10px] uppercase tracking-wider text-glow">Unlocked</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* COMPLETED MODULES */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Module progress</h2>
        <div className="mt-6 grid gap-3">
          {grades.flatMap((g) =>
            g.modules.map((m) => {
              const r = profile.modules[`${g.id}/${m.id}`];
              const pct = r ? Math.round(r.bestScore * 100) : 0;
              return (
                <Link
                  key={`${g.id}/${m.id}`}
                  to="/quiz/$gradeId/$moduleId"
                  params={{ gradeId: g.id, moduleId: m.id }}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-2xl">
                    {m.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-semibold">{m.title}</div>
                      <div className="text-xs text-muted-foreground">{g.title}</div>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full bg-gradient-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="w-12 text-right text-xs tabular-nums text-muted-foreground">
                        {pct}%
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }),
          )}
        </div>
      </section>

      <div className="mt-12 text-center">
        <button
          onClick={() => {
            if (confirm("Reset all progress?")) resetProfile();
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/5 px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset progress
        </button>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  accent: "glow" | "neon" | "violet" | "orange";
}) {
  const tone =
    accent === "glow" || accent === "orange"
      ? "text-glow bg-glow/15"
      : accent === "violet"
        ? "text-violet bg-violet/15"
        : "text-neon bg-neon/15";
  return (
    <GlassCard className="flex items-center gap-4">
      <div className={`grid h-12 w-12 place-items-center rounded-xl ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </GlassCard>
  );
}
