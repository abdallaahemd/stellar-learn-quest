import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { grades } from "@/data/curriculum";
import { GlassCard } from "@/components/GlassCard";

export const Route = createFileRoute("/grades")({
  head: () => ({
    meta: [
      { title: "Choose your grade — iSchool" },
      {
        name: "description",
        content: "Pick your learning track. Three grades from Explorer (8–10) to Innovator (15–18).",
      },
      { property: "og:title", content: "Choose your grade — iSchool" },
    ],
  }),
  component: GradesPage,
});

function GradesPage() {
  return (
    <div className="py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-glow">
          Step 1 of 3
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Pick your <span className="text-gradient-primary">grade</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          Each grade unlocks a different universe — handpicked modules, quizzes, and rewards.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        className="mt-14 grid gap-6 md:grid-cols-3"
      >
        {grades.map((g) => (
          <motion.div
            key={g.id}
            variants={{
              hidden: { opacity: 0, y: 32 },
              show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            <Link
              to="/grades/$gradeId"
              params={{ gradeId: g.id }}
              className="block focus:outline-none"
            >
              <GlassCard glow={g.accent} className="h-full">
                <div className="flex items-start justify-between">
                  <div
                    className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl ${
                      g.accent === "blue"
                        ? "bg-neon/20"
                        : g.accent === "orange"
                          ? "bg-glow/20"
                          : "bg-violet/20"
                    }`}
                  >
                    {g.emoji}
                  </div>
                  <span className="rounded-full border border-border bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {g.ageRange}
                  </span>
                </div>
                <h2 className="mt-6 text-2xl font-bold">{g.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{g.tagline}</p>

                <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{g.modules.length} modules</span>
                  <span>{g.modules.reduce((a, m) => a + m.questions.length, 0)} questions</span>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-foreground">
                  Begin
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
