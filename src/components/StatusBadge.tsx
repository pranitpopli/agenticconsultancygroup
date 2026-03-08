import { cn } from "@/lib/utils";

type StatusVariant = "positive" | "warning" | "danger" | "info" | "neutral";

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  positive: "text-[hsl(var(--status-positive))] border-[hsl(var(--status-positive)/0.3)] bg-[hsl(var(--status-positive-bg))]",
  warning: "text-[hsl(var(--status-warning))] border-[hsl(var(--status-warning)/0.3)] bg-[hsl(var(--status-warning-bg))]",
  danger: "text-[hsl(var(--status-danger))] border-[hsl(var(--status-danger)/0.3)] bg-[hsl(var(--status-danger-bg))]",
  info: "text-[hsl(var(--status-info))] border-[hsl(var(--status-info)/0.3)] bg-[hsl(var(--status-info-bg))]",
  neutral: "text-muted-foreground border-border bg-muted",
};

const StatusBadge = ({ label, variant = "neutral", className }: StatusBadgeProps) => (
  <span
    className={cn(
      "text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 border inline-block",
      variantStyles[variant],
      className
    )}
  >
    {label}
  </span>
);

export default StatusBadge;
