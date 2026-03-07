import { motion } from "framer-motion";
import { TrendingUp, BarChart3, ArrowUpRight, ArrowRight } from "lucide-react";
import { OQR_DATA } from "@/lib/oqrData";
import type { BriefingDocument } from "@/lib/briefingData";

interface InlineOQRProps {
  doc: BriefingDocument;
}

const InlineOQR = ({ doc }: InlineOQRProps) => {
  const data = OQR_DATA;
  const savingsPct = Math.round((doc.saving / data.totalSavings) * 100);

  // Simulate before/after maturity impact
  const maturityBefore = data.orgMaturity;
  const maturityAfter = Math.min(100, maturityBefore + 4); // This project adds ~4 points
  const affectedDepts = data.departments.filter(d => 
    doc.system.departments.some(sd => sd.name === d.name)
  );

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

        {/* Savings breakdown */}
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

        <p className="text-xs text-foreground/60 leading-relaxed border-l-2 border-foreground/10 pl-4 mt-6">
          {data.cfoSummary}
        </p>
      </div>

      {/* Before / After: Org AI Maturity */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-4 h-4 text-foreground/50" strokeWidth={1.5} />
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-foreground/60">
            Projected Impact on Org AI Maturity
          </h3>
        </div>

        {/* Before / After gauges */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="border border-border p-5">
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-4">Before this project</p>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="hsl(var(--foreground))"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - maturityBefore / 100) }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ opacity: 0.4 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg text-foreground/50 font-sans">{maturityBefore}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Current maturity</p>
                <p className="text-xs text-muted-foreground">{data.departmentsCrossed} depts AI-augmented</p>
              </div>
            </div>
          </div>

          <div className="border border-foreground/20 p-5 relative">
            <div className="absolute -left-5 top-1/2 -translate-y-1/2">
              <ArrowRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-4">After this project</p>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="hsl(var(--foreground))"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - maturityAfter / 100) }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg text-foreground font-sans">{maturityAfter}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-foreground">Projected maturity</p>
                <p className="text-xs text-muted-foreground">+{maturityAfter - maturityBefore} points from this initiative</p>
              </div>
            </div>
          </div>
        </div>

        {/* Department-level impact */}
        <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/60 mb-4">
          Department impact from this project
        </p>
        <div className="space-y-3 mb-6">
          {affectedDepts.map((dept) => {
            const boost = dept.name === "Engineering" ? 6 : dept.name === "Infrastructure" ? 5 : 3;
            const after = Math.min(100, dept.score + boost);
            return (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground/70">{dept.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">{dept.score}%</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/50" strokeWidth={1.5} />
                    <span className="text-[10px] text-foreground font-medium">{after}%</span>
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
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.score}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-full bg-foreground/15 absolute top-0 left-0"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${after}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full rounded-full bg-foreground/30 absolute top-0 left-0"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Other departments */}
        <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/60 mb-4">
          Other departments
        </p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {data.departments
            .filter(d => !affectedDepts.some(ad => ad.name === d.name))
            .map((dept) => (
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
