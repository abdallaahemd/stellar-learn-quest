export type LeaderboardEntry = {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  weeklyXp: number;
  bestScore: number; // %
  streak: number;
};

// Seeded "global" leaderboard. The current user is merged in at render time.
export const seededLeaderboard: LeaderboardEntry[] = [
  { id: "u1", name: "Lina the Wizard", avatar: "🧙‍♀️", xp: 4820, weeklyXp: 720, bestScore: 100, streak: 12 },
  { id: "u2", name: "Captain Nova", avatar: "🚀", xp: 4310, weeklyXp: 640, bestScore: 98, streak: 9 },
  { id: "u3", name: "Pixel Panda", avatar: "🐼", xp: 3980, weeklyXp: 590, bestScore: 96, streak: 7 },
  { id: "u4", name: "Byte Fox", avatar: "🦊", xp: 3540, weeklyXp: 520, bestScore: 94, streak: 5 },
  { id: "u5", name: "Quantum Cat", avatar: "🐱", xp: 3120, weeklyXp: 470, bestScore: 92, streak: 6 },
  { id: "u6", name: "Robo Rex", avatar: "🤖", xp: 2890, weeklyXp: 440, bestScore: 90, streak: 4 },
  { id: "u7", name: "Stella Sky", avatar: "🌟", xp: 2640, weeklyXp: 400, bestScore: 88, streak: 3 },
  { id: "u8", name: "Logic Lion", avatar: "🦁", xp: 2310, weeklyXp: 360, bestScore: 86, streak: 2 },
  { id: "u9", name: "Neon Owl", avatar: "🦉", xp: 2050, weeklyXp: 320, bestScore: 84, streak: 2 },
  { id: "u10", name: "Mecha Bee", avatar: "🐝", xp: 1880, weeklyXp: 300, bestScore: 82, streak: 1 },
];
