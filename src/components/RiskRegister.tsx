import type { RiskRow } from "@/lib/briefingData";

interface Props {
  risks: RiskRow[];
}

function levelClass(level: "high" | "medium" | "low") {
  return level === "high"
    ? "text-destructive"
    : level === "medium"
      ? "text-[hsl(var(--status-warning))]"
      : "text-[hsl(var(--status-positive))]";
}

const RiskRegister = ({ risks }: Props) => {
  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="border border-border overflow-hidden min-w-[540px]">
        {/* Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_2fr] border-b border-border">
          <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Risk</div>
          <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border">Likelihood</div>
          <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border">Impact</div>
          <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border">Mitigation</div>
        </div>
        {/* Rows */}
        {risks.map((row, i) => (
          <div key={i} className={`grid grid-cols-[2fr_1fr_1fr_2fr] ${i > 0 ? "border-t border-border" : ""}`}>
            <div className="p-3 text-xs text-foreground">{row.risk}</div>
            <div className={`p-3 text-xs capitalize border-l border-border ${levelClass(row.likelihood)}`}>{row.likelihood}</div>
            <div className={`p-3 text-xs capitalize border-l border-border ${levelClass(row.impact)}`}>{row.impact}</div>
            <div className="p-3 text-xs text-foreground/80 border-l border-border">{row.mitigation}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskRegister;
