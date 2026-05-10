import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Zap, Flame } from "lucide-react";
import { useState } from "react";
import { useProfile } from "@/lib/profile-store";
import { seededLeaderboard, type LeaderboardEntry } from "@/data/leaderboard";
import { GlassCard } from "@/components/GlassCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — iSchool" },
      { name: "description", content: "See top learners, weekly rankings and best scores." },
    ],
  }),
  component: LeaderboardPage,
});

type Tab = "all" | "weekly" | "score";

function LeaderboardPage() {
  const { profile } = useProfile();
  const [tab, setTab] = useState<Tab>("all");

  const me: LeaderboardEntry = {
    id: "me",
    name: profile.name + " (you)",
    avatar: profile.avatar,
    xp: profile.xp,
    weeklyXp: profile.weeklyXp.xp,
    bestScore: Math.round(
      Math.max(0, ...Object.values(profile.modules).map((m) => m.bestScore * 100)),
    ),
    streak: profile.streak,
  };

  const list = [...seededLeaderboard, me];
  const sorted = [...list].sort((a, b) => {
    if (tab === "weekly") return b.weeklyXp - a.weeklyXp;
    if (tab === "score") return b.bestScore - a.bestScore;
    return b.xp - a.xp;
  });

  const myRank = sorted.findIndex((e) => e.id === "me") + 1;
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-glow">
          Hall of Champions
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="text-gradient-primary">Leaderboard</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Climb the ranks. You are currently <span className="font-bold text-foreground">#{myRank}</span>.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="mt-10 flex justify-center">
        <div className="inline-flex rounded-2xl glass p-1">
          {([
            { id: "all", label: "All-time XP" },
            { id: "weekly", label: "This week" },
            { id: "score", label: "Best score" },
          ] as { id: Tab; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab === t.id && (
                <motion.span
                  layoutId="lb-tab"
                  className="absolute inset-0 rounded-xl bg-gradient-primary shadow-glow-blue"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Podium */}
      <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-6">
        {[top3[1], top3[0], top3[2]].map((e, i) => {
          if (!e) return <div key={i} />;
          const placeIndex = i === 1 ? 0 : i === 0 ? 1 : 2; // visual order: 2nd, 1st, 3rd
          const place = placeIndex + 1;
          const heights = ["h-32 sm:h-40", "h-44 sm:h-56", "h-24 sm:h-32"];
          const colors = [
            "from-neon to-violet",
            "from-glow to-accent",
            "from-violet to-neon",
          ];
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center justify-end"
            >
              <div className="relative">
                <div
                  className={cn(
                    "grid h-16 w-16 place-items-center rounded-2xl text-3xl shadow-elegant sm:h-20 sm:w-20 sm:text-4xl",
                    place === 1 ? "ring-2 ring-glow shadow-glow-orange" : "ring-1 ring-border",
                    e.id === "me" && "ring-2 ring-neon shadow-glow-blue",
                  )}
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(1 0 0 / 10%), oklch(1 0 0 / 2%))",
                  }}
                >
                  {e.avatar}
                </div>
                {place === 1 && (
                  <Crown className="absolute -top-5 left-1/2 h-6 w-6 -translate-x-1/2 text-glow drop-shadow-[0_0_8px_var(--glow)]" />
                )}
              </div>
              <div className="mt-3 max-w-full truncate text-center text-xs font-semibold sm:text-sm">
                {e.name}
              </div>
              <div className="text-[10px] text-muted-foreground sm:text-xs">
                {tab === "score" ? `${e.bestScore}%` : `${tab === "weekly" ? e.weeklyXp : e.xp} XP`}
              </div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
                className={cn(
                  "mt-3 w-full rounded-t-2xl bg-gradient-to-b text-center font-bold text-2xl text-primary-foreground sm:text-4xl grid place-items-start pt-3",
                  heights[i],
                  colors[i],
                )}
              >
                {place}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Rest */}
      <div className="mt-10 space-y-2">
        {rest.map((e, i) => {
          const rank = i + 4;
          const isMe = e.id === "me";
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-4 transition-colors",
                isMe
                  ? "border-neon bg-neon/10 shadow-glow-blue"
                  : "border-border bg-white/[0.03] hover:bg-white/[0.06]",
              )}
            >
              <div className="w-8 text-center text-sm font-bold tabular-nums text-muted-foreground">
                #{rank}
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-xl">
                {e.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-semibold">{e.name}</div>
                <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Zap className="h-3 w-3 text-glow" />
                    {e.xp} XP
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-300" />
                    {e.streak}d
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Medal className="h-3 w-3 text-violet" />
                    {e.bestScore}%
                  </span>
                </div>
              </div>
              <div className="text-sm font-bold tabular-nums">
                {tab === "score" ? `${e.bestScore}%` : tab === "weekly" ? `${e.weeklyXp}` : `${e.xp}`}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/grades"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow-blue transition-transform hover:scale-105"
        >
          <Trophy className="h-4 w-4" />
          Earn more XP
        </Link>
      </div>
    </div>
  );
}
