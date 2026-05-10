import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Trophy, Check } from "lucide-react";
import { getGrade, type Grade } from "@/data/curriculum";
import { GlassCard } from "@/components/GlassCard";
import { useProfile } from "@/lib/profile-store";

export const Route = createFileRoute("/grades/$gradeId")({
  loader: ({ params }) => {
    const grade = getGrade(params.gradeId);
    if (!grade) throw notFound();
    return { grade };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.grade.title ?? "Grade"} — iSchool` },
      {
        name: "description",
        content: loaderData?.grade.tagline ?? "iSchool learning module.",
      },
    ],
  }),
  component: ModulesPage,
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <h1 className="text-3xl font-bold">Grade not found</h1>
      <Link to="/grades" className="mt-4 inline-block text-neon underline">
        Back to grades
      </Link>
    </div>
  ),
});

function ModulesPage() {
  const { grade } = Route.useLoaderData() as { grade: Grade };
  const { profile } = useProfile();

  return (
    <div className="py-12 sm:py-20">
      <Link
        to="/grades"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All grades
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-glow">
            {grade.ageRange} · Step 2 of 3
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="mr-3">{grade.emoji}</span>
            {grade.title}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            {grade.tagline}
          </p>
        </div>
        <div className="glass flex items-center gap-3 rounded-2xl px-5 py-3">
          <Trophy className="h-5 w-5 text-glow" />
          <div className="text-sm">
            <div className="font-semibold">
              {grade.modules.reduce((a, m) => a + m.xp, 0)} XP
            </div>
            <div className="text-xs text-muted-foreground">total available</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        className="mt-12 grid gap-6 md:grid-cols-2"
      >
        {grade.modules.map((m, i) => {
          const result = profile.modules[`${grade.id}/${m.id}`];
          const pct = result ? Math.round(result.bestScore * 100) : 0;
          const completed = pct >= 60;
          return (
          <motion.div
            key={m.id}
            variants={{
              hidden: { opacity: 0, y: 28 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
          >
            <Link
              to="/quiz/$gradeId/$moduleId"
              params={{ gradeId: grade.id, moduleId: m.id }}
              className="block"
            >
              <GlassCard glow={grade.accent} className="h-full">
                <div className="flex items-start justify-between">
                  <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-2xl">
                    {m.emoji}
                    {completed && (
                      <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-success text-success-foreground shadow-[0_0_18px_-2px_var(--success)]">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <span className="rounded-full bg-glow/15 px-3 py-1 text-xs font-semibold text-glow">
                    +{m.xp} XP
                  </span>
                </div>
                <div className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Module {i + 1} {result && `· ${pct}%`}
                </div>
                <h2 className="mt-1 text-2xl font-bold">{m.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>

                <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                    className="h-full bg-gradient-primary"
                  />
                </div>

                <div className="mt-6 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{m.questions.length} questions</span>
                  <span className="flex items-center gap-1 font-semibold">
                    {result ? "Replay" : "Start"} <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
