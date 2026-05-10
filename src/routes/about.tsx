import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, GamepadIcon, Sparkles, Trophy } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "How iSchool works" },
      {
        name: "description",
        content: "Learn how iSchool turns programming into an immersive, rewarding experience.",
      },
      { property: "og:title", content: "How iSchool works" },
    ],
  }),
  component: About,
});

const steps = [
  {
    icon: BookOpen,
    title: "Pick a grade",
    desc: "Three tracks tailored to age and skill — from Explorer to Innovator.",
    glow: "blue" as const,
  },
  {
    icon: GamepadIcon,
    title: "Take a quiz",
    desc: "Bite-size questions, instant feedback, animated reactions.",
    glow: "orange" as const,
  },
  {
    icon: Trophy,
    title: "Earn XP & badges",
    desc: "Unlock rewards, build streaks, see your mind grow.",
    glow: "violet" as const,
  },
];

function About() {
  return (
    <div className="py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-glow" />
          The iSchool way
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Learning that <span className="text-gradient-primary">feels like a game</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          Three simple steps. Endless curiosity. Real mastery.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        className="mt-14 grid gap-6 md:grid-cols-3"
      >
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
          >
            <GlassCard glow={s.glow} className="h-full">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Step {i + 1}
              </div>
              <div
                className={`mt-4 grid h-14 w-14 place-items-center rounded-2xl ${
                  s.glow === "blue"
                    ? "bg-neon/20 text-neon"
                    : s.glow === "orange"
                      ? "bg-glow/20 text-glow"
                      : "bg-violet/20 text-violet"
                }`}
              >
                <s.icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-16 text-center"
      >
        <Link
          to="/grades"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-accent px-7 py-3.5 text-base font-semibold text-glow-foreground shadow-glow-orange transition-transform hover:scale-[1.04]"
        >
          Pick your grade
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  );
}
