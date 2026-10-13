import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const chunky = cva(
  "btn-press inline-flex items-center justify-center gap-2 rounded-2xl font-display font-bold tracking-wide disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
  {
    variants: {
      tone: {
        primary: "bg-primary text-primary-foreground border-primary-deep",
        secondary: "bg-secondary text-secondary-foreground border-secondary-deep",
        accent: "bg-accent text-accent-foreground border-accent-deep",
        sun: "bg-sun text-foreground border-sun-deep",
        ghost: "bg-card text-foreground border-border border-2 border-b-[5px]",
      },
      size: { sm: "h-10 px-4 text-sm", md: "h-12 px-6 text-base", lg: "h-14 px-8 text-lg" },
    },
    defaultVariants: { tone: "primary", size: "md" },
  },
);

export const ChunkyButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof chunky>>(
  ({ className, tone, size, ...p }, ref) => <button ref={ref} className={cn(chunky({ tone, size }), className)} {...p} />,
);
ChunkyButton.displayName = "ChunkyButton";

export function DemoBadge({ children = "Demo mode" }: { children?: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-sun/50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground">{children}</span>;
}
