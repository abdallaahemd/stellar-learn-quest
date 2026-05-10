import { useEffect, useState, useCallback } from "react";
import { grades, type Grade } from "@/data/curriculum";

/**
 * Local-only gamification store.
 * SSR-safe: all reads/writes guarded by typeof window check.
 * Subscribers re-render on a custom "ischool:profile" event so any
 * component can stay in sync without prop drilling.
 */

export type ModuleResult = {
  gradeId: string;
  moduleId: string;
  bestScore: number; // 0..1
  bestXp: number;
  attempts: number;
  lastPlayedAt: number;
};

export type Badge = {
  id: string;
  title: string;
  desc: string;
  icon: "trophy" | "zap" | "brain" | "star" | "flame" | "rocket";
  unlockedAt: number;
};

export type Profile = {
  name: string;
  avatar: string; // emoji
  xp: number;
  streak: number;
  lastActiveDay: string | null; // YYYY-MM-DD
  weeklyXp: { isoWeek: string; xp: number };
  modules: Record<string, ModuleResult>; // key: gradeId/moduleId
  badges: Badge[];
  draftAnswers: Record<string, { index: number; answers: (number | null)[] }>; // quiz auto-save
};

const KEY = "ischool:profile:v1";
const EVT = "ischool:profile";

const AVATARS = ["🦊", "🐼", "🐯", "🦁", "🐸", "🐙", "🦄", "🐲", "🤖", "👾", "🧠", "🚀"];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function isoWeek() {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((+d - +onejan) / 86400000 + onejan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

const DEFAULT: Profile = {
  name: "Cadet",
  avatar: AVATARS[0],
  xp: 0,
  streak: 0,
  lastActiveDay: null,
  weeklyXp: { isoWeek: isoWeek(), xp: 0 },
  modules: {},
  badges: [],
  draftAnswers: {},
};

function read(): Profile {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Profile;
    return { ...DEFAULT, ...parsed, weeklyXp: parsed.weeklyXp ?? DEFAULT.weeklyXp };
  } catch {
    return DEFAULT;
  }
}

function write(p: Profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function getProfile() {
  return read();
}

export function updateProfile(updater: (p: Profile) => Profile) {
  const next = updater(read());
  write(next);
  return next;
}

export function setProfile(patch: Partial<Profile>) {
  return updateProfile((p) => ({ ...p, ...patch }));
}

export const AVATAR_OPTIONS = AVATARS;

/* ------------- LEVELS ------------- */
// Level grows: each level needs ~level * 100 XP.
export function levelInfo(xp: number) {
  let level = 1;
  let need = 100;
  let acc = 0;
  while (xp >= acc + need) {
    acc += need;
    level += 1;
    need = level * 100;
  }
  const intoLevel = xp - acc;
  return { level, intoLevel, need, percent: Math.min(100, Math.round((intoLevel / need) * 100)) };
}

/* ------------- BADGES ------------- */
const BADGE_DEFS: Record<string, Omit<Badge, "unlockedAt">> = {
  first_steps: { id: "first_steps", title: "First Steps", desc: "Complete your first module", icon: "rocket" },
  perfect_score: { id: "perfect_score", title: "Perfect Score", desc: "100% on any module", icon: "star" },
  speed_coder: { id: "speed_coder", title: "Speed Coder", desc: "Finish a quiz in under 60s", icon: "zap" },
  streak_3: { id: "streak_3", title: "On Fire", desc: "3-day learning streak", icon: "flame" },
  streak_7: { id: "streak_7", title: "Streak Master", desc: "7-day learning streak", icon: "flame" },
  brainiac: { id: "brainiac", title: "Brainiac", desc: "Complete 5 modules", icon: "brain" },
  champion: { id: "champion", title: "Champion", desc: "Reach level 5", icon: "trophy" },
};

export const ALL_BADGES = Object.values(BADGE_DEFS);

function unlock(p: Profile, id: keyof typeof BADGE_DEFS): Profile {
  if (p.badges.some((b) => b.id === id)) return p;
  return { ...p, badges: [...p.badges, { ...BADGE_DEFS[id], unlockedAt: Date.now() }] };
}

/* ------------- ACTIONS ------------- */
export function recordQuizCompletion(args: {
  gradeId: string;
  moduleId: string;
  scorePct: number; // 0..100
  earnedXp: number;
  durationSec: number;
}) {
  return updateProfile((p) => {
    const key = `${args.gradeId}/${args.moduleId}`;
    const prev = p.modules[key];
    const ratio = args.scorePct / 100;
    const next: ModuleResult = {
      gradeId: args.gradeId,
      moduleId: args.moduleId,
      bestScore: Math.max(prev?.bestScore ?? 0, ratio),
      bestXp: Math.max(prev?.bestXp ?? 0, args.earnedXp),
      attempts: (prev?.attempts ?? 0) + 1,
      lastPlayedAt: Date.now(),
    };

    // XP only awards the delta over previous best (no farming the same quiz).
    const xpDelta = Math.max(0, args.earnedXp - (prev?.bestXp ?? 0));

    // Streak
    const today = todayStr();
    let streak = p.streak;
    if (p.lastActiveDay !== today) {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yest = y.toISOString().slice(0, 10);
      streak = p.lastActiveDay === yest ? p.streak + 1 : 1;
    }

    // Weekly XP
    const week = isoWeek();
    const weeklyXp =
      p.weeklyXp.isoWeek === week
        ? { isoWeek: week, xp: p.weeklyXp.xp + xpDelta }
        : { isoWeek: week, xp: xpDelta };

    let updated: Profile = {
      ...p,
      xp: p.xp + xpDelta,
      streak,
      lastActiveDay: today,
      weeklyXp,
      modules: { ...p.modules, [key]: next },
      draftAnswers: Object.fromEntries(
        Object.entries(p.draftAnswers).filter(([k]) => k !== key),
      ),
    };

    // Badge checks
    if (Object.keys(updated.modules).length >= 1) updated = unlock(updated, "first_steps");
    if (args.scorePct === 100) updated = unlock(updated, "perfect_score");
    if (args.durationSec > 0 && args.durationSec < 60) updated = unlock(updated, "speed_coder");
    if (updated.streak >= 3) updated = unlock(updated, "streak_3");
    if (updated.streak >= 7) updated = unlock(updated, "streak_7");
    if (Object.keys(updated.modules).length >= 5) updated = unlock(updated, "brainiac");
    if (levelInfo(updated.xp).level >= 5) updated = unlock(updated, "champion");

    return updated;
  });
}

export function saveDraft(gradeId: string, moduleId: string, index: number, answers: (number | null)[]) {
  updateProfile((p) => ({
    ...p,
    draftAnswers: { ...p.draftAnswers, [`${gradeId}/${moduleId}`]: { index, answers } },
  }));
}

export function loadDraft(gradeId: string, moduleId: string) {
  return read().draftAnswers[`${gradeId}/${moduleId}`] ?? null;
}

export function clearDraft(gradeId: string, moduleId: string) {
  updateProfile((p) => {
    const next = { ...p.draftAnswers };
    delete next[`${gradeId}/${moduleId}`];
    return { ...p, draftAnswers: next };
  });
}

export function resetProfile() {
  write({ ...DEFAULT });
}

/* ------------- HOOK ------------- */
export function useProfile() {
  const [profile, setLocal] = useState<Profile>(DEFAULT);
  useEffect(() => {
    setLocal(read());
    const onChange = () => setLocal(read());
    window.addEventListener(EVT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const update = useCallback((patch: Partial<Profile>) => setProfile(patch), []);
  return { profile, update };
}

/* ------------- DERIVED ------------- */
export function getCompletedCount(p: Profile) {
  return Object.keys(p.modules).length;
}

export function getTotalModules() {
  return grades.reduce((a, g) => a + g.modules.length, 0);
}

export function getNextModule(p: Profile): { grade: Grade; moduleId: string } | null {
  for (const g of grades) {
    for (const m of g.modules) {
      const k = `${g.id}/${m.id}`;
      const r = p.modules[k];
      if (!r || r.bestScore < 1) return { grade: g, moduleId: m.id };
    }
  }
  return null;
}
