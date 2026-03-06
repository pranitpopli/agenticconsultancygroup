import { motion } from "framer-motion";
import { TrendingUp, BarChart3, ArrowUpRight } from "lucide-react";
import { OQR_DATA } from "@/lib/oqrData";
import type { BriefingDocument } from "@/lib/briefingData";

interface InlineOQRProps {
  doc: BriefingDocument;
}

const InlineOQR = ({ doc }: InlineOQRProps) => {
  const data = OQR_DATA;
  const savingsPct = Math.round((doc.saving / data.totalSavings) * 100);

  return (
    <div className="space-y-10">
      {/* Financial Impact */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-4 h-4 text-foreground/50" strokeWidth={1.5} />
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-foreground/60">
            Financial Impact on Org
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* This project's contribution */}
          <div className="border border-border p-5 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/60 mb-1">
              This project's saving
            </p>
            <p className="text-3xl text-foreground font-sans">
              £{doc.saving.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 text-foreground/60">
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="text-xs">
                {savingsPct}% of total quarterly AI savings
              </span>
            </div>
          </div>

          {/* Org total */}
          <div className="border border-border p-5 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/60 mb-1">
              Org quarterly savings
            </p>
            <p className="text-3xl text-foreground/40 font-sans">
              £{data.totalSavings.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 text-foreground/60">
              <TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="text-xs">
                +{Math.round(((data.totalSavings - data.previousQuarterSavings) / data.previousQuarterSavings) * 100)}% vs {data.previousQuarter}
              </span>
            </div>
          </div>
        </div>

        {/* Savings breakdown with this project highlighted */}
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/60">
            Savings breakdown across org
          </p>
          {data.financialBreakdown.map((item) => {
            const pct = (item.amount / data.totalSavings) * 100;
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-foreground/70">{item.label}</span>
                  <span className="text-xs text-foreground">£{item.amount.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="h-full bg-foreground/20 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-foreground/60 leading-relaxed border-l-2 border-foreground/10 pl-4 mt-6 italic">
          {data.cfoSummary}
        </p>
      </div>

      {/* Org Shift Index */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-4 h-4 text-foreground/50" strokeWidth={1.5} />
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-foreground/60">
            Org Shift Index
          </h3>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-8 items-start mb-6">
          {/* Maturity gauge */}
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke="hsl(var(--foreground))"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - data.orgMaturity / 100) }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl text-foreground font-sans">{data.orgMaturity}%</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <p className="text-sm text-foreground font-medium">Org AI Maturity</p>
            <p className="text-xs text-foreground/60">
              +{data.maturityDelta} points this quarter · {data.departmentsCrossed} departments crossed into AI-Augmented
            </p>
          </div>
        </div>

        {/* Department scores — show relevant departments for this briefing */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {data.departments.map((dept) => (
            <div key={dept.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/70">{dept.name}</span>
                <span className={`text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 border ${
                  dept.stage === "ai-led"
                    ? "text-foreground border-foreground/20"
                    : dept.stage === "ai-augmented"
                    ? "status-green"
                    : "text-foreground/50 border-border bg-muted"
                }`}>
                  {dept.stage.replace("-", " ")}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dept.score}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full rounded-full bg-foreground/20"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InlineOQR;
