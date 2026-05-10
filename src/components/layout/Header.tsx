import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Zap, Flame, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/ischool-logo.png";
import { useProfile, levelInfo } from "@/lib/profile-store";
import { getMuted, setMuted, sfx } from "@/lib/sound";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/grades", label: "Grades" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/profile", label: "Profile" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  const { profile } = useProfile();
  const [muted, setMutedState] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMutedState(getMuted());
    const onChange = () => setMutedState(getMuted());
    window.addEventListener("ischool:muted-changed", onChange);
    return () => window.removeEventListener("ischool:muted-changed", onChange);
  }, []);

  const lvl = levelInfo(profile.xp);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-40 w-full"
    >
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between gap-3 rounded-2xl glass px-3 py-2.5 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="iSchool" className="h-9 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-foreground bg-white/10" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* XP / Level pill */}
          <Link
            to="/profile"
            className="hidden items-center gap-2 rounded-xl border border-border bg-white/5 px-2.5 py-1.5 text-xs sm:inline-flex"
            aria-label={`Level ${lvl.level}, ${profile.xp} XP`}
          >
            <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-primary text-[10px] font-bold text-primary-foreground">
              {lvl.level}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-glow">
              <Zap className="h-3.5 w-3.5" />
              {profile.xp}
            </span>
            {profile.streak > 0 && (
              <span className="inline-flex items-center gap-0.5 text-orange-300">
                <Flame className="h-3.5 w-3.5" />
                {profile.streak}
              </span>
            )}
          </Link>

          {/* Sound toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !muted;
              setMuted(next);
              setMutedState(next);
              if (!next) sfx.click();
            }}
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <Link
            to="/grades"
            className="hidden items-center justify-center overflow-hidden rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-blue transition-transform hover:scale-[1.03] active:scale-[0.98] sm:inline-flex"
          >
            Start Learning
          </Link>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Open menu"
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-white/5 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl glass transition-all lg:hidden",
          open ? "max-h-96 p-2" : "max-h-0 p-0 border-0",
        )}
      >
        <div className="flex flex-col">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              activeProps={{ className: "text-foreground bg-white/10" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.header>
  );
}
