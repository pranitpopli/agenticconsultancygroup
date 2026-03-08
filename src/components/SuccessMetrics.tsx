import type { SuccessMetric } from "@/lib/briefingData";

interface Props {
  metrics: SuccessMetric[];
}

const SuccessMetrics = ({ metrics }: Props) => {
  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="border border-border overflow-hidden min-w-[540px]">
        {/* Header */}
        <div className="grid grid-cols-4 border-b border-border">
          <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Metric</div>
          <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border">Baseline</div>
          <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border">Target</div>
          <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border">Measurement</div>
        </div>
        {/* Rows */}
        {metrics.map((row, i) => (
          <div key={i} className={`grid grid-cols-4 ${i > 0 ? "border-t border-border" : ""}`}>
            <div className="p-3 text-xs text-foreground font-medium">{row.metric}</div>
            <div className="p-3 text-xs text-muted-foreground border-l border-border">{row.baseline}</div>
            <div className="p-3 text-xs text-foreground border-l border-border">{row.target}</div>
            <div className="p-3 text-xs text-foreground/80 border-l border-border">{row.measurement}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessMetrics;
