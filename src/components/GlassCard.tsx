import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = HTMLMotionProps<"div"> & {
  glow?: "blue" | "orange" | "violet" | "none";
};

export function GlassCard({ className, glow = "none", children, ...rest }: Props) {
  const glowClass =
    glow === "blue"
      ? "hover:shadow-glow-blue"
      : glow === "orange"
        ? "hover:shadow-glow-orange"
        : glow === "violet"
          ? "hover:shadow-[0_0_40px_-8px_var(--violet)]"
          : "";
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className={cn(
        "relative overflow-hidden rounded-2xl glass p-6 transition-shadow duration-500",
        glowClass,
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
