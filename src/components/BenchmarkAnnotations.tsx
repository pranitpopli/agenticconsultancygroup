import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { BenchmarkAnnotation } from "@/lib/benchmarkData";

interface Props {
  annotations: BenchmarkAnnotation[];
}

const COMPARISON_ICON: Record<string, { icon: typeof TrendingUp; className: string }> = {
  above: { icon: TrendingUp, className: "text-[hsl(var(--status-warning))]" },
  below: { icon: TrendingDown, className: "text-[hsl(var(--status-positive))]" },
  inline: { icon: Minus, className: "text-muted-foreground" },
};

const BenchmarkAnnotations = ({ annotations }: Props) => {
  if (!annotations.length) return null;

  return (
    <div className="border border-dashed border-border/60 bg-muted/20 p-4 space-y-3">
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2">
        <span className="w-3 h-px bg-muted-foreground/30" />
        Swarm benchmarks
        <span className="w-3 h-px bg-muted-foreground/30" />
      </p>
      {annotations.map((ann, i) => {
        const { icon: Icon, className } = COMPARISON_ICON[ann.comparison];
        return (
          <div key={i} className="flex items-start gap-2.5">
            <Icon className={`w-3 h-3 mt-0.5 flex-shrink-0 ${className}`} strokeWidth={1.5} />
            <p className="text-[11px] text-foreground/60 leading-relaxed">{ann.narrative}</p>
          </div>
        );
      })}
    </div>
  );
};

export default BenchmarkAnnotations;
