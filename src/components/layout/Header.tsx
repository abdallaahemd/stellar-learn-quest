import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import logo from "@/assets/ischool-logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/grades", label: "Grades" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-40 w-full"
    >
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between gap-4 rounded-2xl glass px-4 py-2.5 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="iSchool" className="h-9 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
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

        <Link
          to="/grades"
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-blue transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          <span className="relative z-10">Start Learning</span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-accent opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
        </Link>
      </div>
    </motion.header>
  );
}
