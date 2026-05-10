import { forwardRef, useState, type ButtonHTMLAttributes, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type Ripple = { id: number; x: number; y: number; size: number };

export const RippleButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, onClick, children, ...rest }, ref) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    function handleClick(e: MouseEvent<HTMLButtonElement>) {
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.4;
      const id = Date.now() + Math.random();
      const ripple = { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size };
      setRipples((r) => [...r, ripple]);
      setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 650);
      onClick?.(e);
    }

    return (
      <button
        ref={ref}
        {...rest}
        onClick={handleClick}
        className={cn("relative overflow-hidden", className)}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            className="pointer-events-none absolute rounded-full bg-white/30 animate-[ripple_0.65s_ease-out]"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          />
        ))}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </button>
    );
  },
);
RippleButton.displayName = "RippleButton";
