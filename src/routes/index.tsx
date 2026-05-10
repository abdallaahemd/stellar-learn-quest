import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Trophy, Rocket, Code2, Brain, Zap, ArrowRight, Star } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "iSchool — Learn. Play. Level up." },
      {
        name: "description",
        content:
          "Cinematic, gamified learning for ages 8–18. Quizzes, XP, badges and an experience kids actually love.",
      },
      { property: "og:title", content: "iSchool — Learn. Play. Level up." },
      {
        property: "og:description",
        content: "Cinematic, gamified learning for ages 8–18.",
      },
    ],
  }),
  component: Landing,
});

const stats = [
  { label: "Active learners", value: 24500, suffix: "+" },
  { label: "Quizzes completed", value: 980000, suffix: "+" },
  { label: "Badges earned", value: 156000, suffix: "+" },
  { label: "Avg. mastery score", value: 92, suffix: "%" },
];

const achievements = [
  {
    icon: Trophy,
    title: "Streak Master",
    desc: "7-day learning streak",
    glow: "orange" as const,
  },
  {
    icon: Brain,
    title: "Logic Wizard",
    desc: "Aced 10 logic quizzes",
    glow: "violet" as const,
  },
  {
    icon: Zap,
    title: "Speed Coder",
    desc: "Quiz under 60 seconds",
    glow: "blue" as const,
  },
  {
    icon: Star,
    title: "Perfect Score",
    desc: "100% on any module",
    glow: "orange" as const,
  },
];

const testimonials = [
  {
    quote: "My son begs to do another quiz every night. iSchool turned coding into his favorite game.",
    name: "Sara, parent",
  },
  {
    quote: "It feels like a video game but I'm actually learning Python. The result screen is so satisfying!",
    name: "Adam, age 12",
  },
  {
    quote: "Finally an EdTech platform that respects how kids think. Beautiful, fast, and rewarding.",
    name: "Mr. Khaled, teacher",
  },
];

const floatingIcons = [
  { Icon: Code2, x: "8%", y: "12%", delay: 0 },
  { Icon: Brain, x: "85%", y: "18%", delay: 0.6 },
  { Icon: Sparkles, x: "12%", y: "70%", delay: 1.1 },
  { Icon: Rocket, x: "82%", y: "72%", delay: 0.4 },
  { Icon: Zap, x: "50%", y: "8%", delay: 0.9 },
];

function Landing() {
  return (
    <div className="pt-10 sm:pt-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl">
        {floatingIcons.map(({ Icon, x, y, delay }, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute hidden text-neon/40 sm:block"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, y: [0, -16, 0] }}
            transition={{
              opacity: { duration: 0.8, delay },
              scale: { duration: 0.8, delay },
              y: { duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay },
            }}
          >
            <Icon className="h-10 w-10" strokeWidth={1.5} />
          </motion.div>
        ))}

        <div className="relative z-10 mx-auto max-w-4xl py-16 text-center sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-glow" />
            New season — earn 2× XP this week
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl"
          >
            Learn to code.
            <br />
            <span className="text-gradient-primary">Level up your mind.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            A cinematic, game-like platform built for ages 8–18. Take quizzes, earn XP,
            unlock badges, and master programming — one level at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              to="/grades"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-glow-blue transition-transform hover:scale-[1.04] active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start your journey
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white/5 px-7 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-white/10"
            >
              How it works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="mt-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <GlassCard glow="blue" className="text-center">
                <div className="text-3xl font-bold text-gradient-primary sm:text-4xl">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-xs text-muted-foreground sm:text-sm">{s.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="mt-24">
        <SectionHeader
          eyebrow="Achievements"
          title="Unlock badges as you grow"
          subtitle="Every quiz, every streak, every win — celebrated."
        />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
        >
          {achievements.map(({ icon: Icon, title, desc, glow }) => (
            <motion.div
              key={title}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <GlassCard glow={glow} className="flex flex-col items-center text-center">
                <div
                  className={`grid h-14 w-14 place-items-center rounded-2xl ${
                    glow === "orange"
                      ? "bg-glow/20 text-glow"
                      : glow === "violet"
                        ? "bg-violet/20 text-violet"
                        : "bg-neon/20 text-neon"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-4 text-sm font-semibold">{title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mt-24">
        <SectionHeader
          eyebrow="Loved by families"
          title="Kids stay. Parents smile."
          subtitle="Real words from real learners."
        />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="mt-10 grid gap-5 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <GlassCard glow="violet" className="h-full">
                <div className="flex gap-0.5 text-glow">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 text-xs font-medium text-muted-foreground">— {t.name}</div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="mt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl glass p-10 text-center shadow-elegant sm:p-16"
        >
          <div className="absolute inset-0 bg-gradient-primary opacity-10" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Ready to <span className="text-gradient-accent">level up?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              Pick a grade. Crush a quiz. Watch your XP soar.
            </p>
            <Link
              to="/grades"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-accent px-7 py-3.5 text-base font-semibold text-glow-foreground shadow-glow-orange transition-transform hover:scale-[1.04]"
            >
              Choose your grade
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neon">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{subtitle}</p>
    </motion.div>
  );
}
