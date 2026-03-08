import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { DeliveryStatus } from "@/lib/briefingData";

export interface ImpactLedgerData {
  predictedSaving: number;
  actualSaving: number | null;
  confidenceScore: number;
  timeToValue: string;
  metrics: {
    metric: string;
    predicted: string;
    actual: string | null;
    status: "exceeded" | "met" | "below" | "pending";
  }[];
}

interface Props {
  data: ImpactLedgerData;
}

const STATUS_LABEL: Record<string, { text: string; className: string; icon: typeof TrendingUp }> = {
  exceeded: { text: "Exceeded", className: "text-[hsl(var(--status-positive))]", icon: TrendingUp },
  met: { text: "Met", className: "text-[hsl(var(--status-positive))]", icon: Minus },
  below: { text: "Below target", className: "text-[hsl(var(--status-warning))]", icon: TrendingDown },
  pending: { text: "Pending", className: "text-muted-foreground", icon: Minus },
};

const ImpactLedger = ({ data }: Props) => {
  const savingDelta = data.actualSaving !== null
    ? ((data.actualSaving - data.predictedSaving) / data.predictedSaving * 100).toFixed(0)
    : null;

  return (
    <div>
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Predicted saving</p>
          <p className="text-xl font-sans tabular-nums text-foreground">£{data.predictedSaving.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Actual saving</p>
          <p className="text-xl font-sans tabular-nums text-foreground">
            {data.actualSaving !== null ? `£${data.actualSaving.toLocaleString()}` : "—"}
          </p>
          {savingDelta && (
            <p className={`text-[10px] tabular-nums ${Number(savingDelta) >= 0 ? "text-[hsl(var(--status-positive))]" : "text-[hsl(var(--status-warning))]"}`}>
              {Number(savingDelta) >= 0 ? "+" : ""}{savingDelta}% vs predicted
            </p>
          )}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Swarm confidence</p>
          <p className="text-xl font-sans tabular-nums text-foreground">{data.confidenceScore}%</p>
          <p className="text-[10px] text-muted-foreground">based on prediction accuracy</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Time to value</p>
          <p className="text-xl font-sans tabular-nums text-foreground">{data.timeToValue}</p>
        </div>
      </div>

      {/* Metrics comparison table */}
      <div className="border border-border overflow-hidden">
        <div className="grid grid-cols-4 border-b border-border">
          <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Metric</div>
          <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border">Predicted</div>
          <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border">Actual</div>
          <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border">Status</div>
        </div>
        {data.metrics.map((row, i) => {
          const status = STATUS_LABEL[row.status];
          const Icon = status.icon;
          return (
            <div key={i} className={`grid grid-cols-4 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="p-3 text-xs text-foreground font-medium">{row.metric}</div>
              <div className="p-3 text-xs text-muted-foreground border-l border-border">{row.predicted}</div>
              <div className="p-3 text-xs text-foreground border-l border-border">{row.actual ?? "—"}</div>
              <div className="p-3 text-xs border-l border-border flex items-center gap-1.5">
                <Icon className={`w-3 h-3 ${status.className}`} />
                <span className={status.className}>{status.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImpactLedger;
