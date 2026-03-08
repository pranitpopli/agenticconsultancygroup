import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, AlertTriangle, Users, TrendingDown, Zap, ChevronDown, ChevronUp } from "lucide-react";
import BriefingNav from "@/components/BriefingNav";
import { SWARM_INSIGHTS, INSIGHT_SUMMARY } from "@/lib/insightsData";
import type { SwarmInsight, InsightCategory } from "@/lib/insightsData";

const CATEGORY_META: Record<InsightCategory, { label: string; icon: typeof Brain }> = {
  "skill-gap": { label: "Skill Gap", icon: TrendingDown },
  "collaboration": { label: "Collaboration", icon: Users },
  "failure-pattern": { label: "Failure Pattern", icon: AlertTriangle },
  "flight-risk": { label: "Flight Risk", icon: AlertTriangle },
  "efficiency": { label: "Efficiency", icon: Zap },
};

const SEVERITY_BAR: Record<string, string> = {
  critical: "bg-[hsl(var(--status-danger))]",
  high: "bg-[hsl(var(--status-warning))]",
  medium: "bg-[hsl(var(--status-info))]",
  low: "bg-foreground/20",
};

const Insights = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<InsightCategory | "all">("all");

  const filtered = filterCategory === "all"
    ? SWARM_INSIGHTS
    : SWARM_INSIGHTS.filter((i) => i.category === filterCategory);

  const categories: (InsightCategory | "all")[] = ["all", "skill-gap", "collaboration", "failure-pattern", "flight-risk", "efficiency"];

  return (
    <div className="min-h-screen bg-background">
      <BriefingNav activeTab="insights" />

      <main className="max-w-[900px] mx-auto px-4 sm:px-8 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight mb-3">
            Organisational Insights
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[600px]">
            Patterns the swarm detects by analysing your entire organisation simultaneously — skill gaps, collaboration blind spots, recurring failure modes, and talent risks no single consultant would see.
          </p>
          <div className="w-12 h-px bg-foreground/20 mt-4" />
        </motion.div>

        {/* Summary strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
        >
          {[
            { label: "Patterns detected", value: INSIGHT_SUMMARY.totalInsights },
            { label: "Critical", value: INSIGHT_SUMMARY.criticalCount },
            { label: "Est. annual impact", value: INSIGHT_SUMMARY.totalEstimatedSaving },
            { label: "Avg confidence", value: `${INSIGHT_SUMMARY.avgConfidence}%` },
          ].map((card) => (
            <div key={card.label} className="border border-border p-4">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1">{card.label}</p>
              <p className="text-xl font-sans tabular-nums text-foreground">{card.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`text-[10px] uppercase tracking-[0.12em] px-3 py-1.5 border transition-colors ${
                filterCategory === cat
                  ? "border-foreground text-foreground bg-foreground/5"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
              }`}
            >
              {cat === "all" ? "All patterns" : CATEGORY_META[cat].label}
            </button>
          ))}
        </motion.div>

        {/* Insight cards */}
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((insight, i) => (
              <motion.div
                key={insight.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: i * 0.05 }}
              >
                <InsightCard
                  insight={insight}
                  expanded={expandedId === insight.id}
                  onToggle={() => setExpandedId(expandedId === insight.id ? null : insight.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Swarm note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-14 border-t border-border pt-6"
        >
          <div className="flex items-start gap-3">
            <Brain className="w-4 h-4 text-muted-foreground mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                These patterns are detected by analysing {INSIGHT_SUMMARY.totalInsights} signals across your organisation's project history, team structures, and skill distributions.
                Last scan: {INSIGHT_SUMMARY.lastScanDate}. Confidence scores reflect data completeness and historical validation.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

function InsightCard({ insight, expanded, onToggle }: { insight: SwarmInsight; expanded: boolean; onToggle: () => void }) {
  const meta = CATEGORY_META[insight.category];
  const Icon = meta.icon;

  return (
    <button
      onClick={onToggle}
      className="w-full text-left border border-border p-5 transition-colors hover:bg-muted/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <div className="min-w-0 flex-1">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[9px] uppercase tracking-[0.12em] px-1.5 py-0.5 border border-border text-muted-foreground">
                {meta.label}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${SEVERITY_BAR[insight.severity]}`} />
              <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{insight.severity}</span>
            </div>
            <p className="text-sm text-foreground font-medium mt-2">{insight.title}</p>

            {/* Expanded content */}
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 space-y-4"
              >
                <p className="text-xs text-foreground/70 leading-relaxed">{insight.detail}</p>

                {/* Evidence */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">Evidence</p>
                  <ul className="space-y-1">
                    {insight.evidence.map((e, i) => (
                      <li key={i} className="text-xs text-foreground/70 flex items-start gap-2">
                        <span className="text-muted-foreground/40 mt-0.5">·</span>
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendation */}
                <div className="border-t border-border pt-3">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1">Recommendation</p>
                  <p className="text-xs text-foreground/80 leading-relaxed">{insight.recommendation}</p>
                </div>

                {/* Impact + Confidence */}
                <div className="flex items-center gap-6 text-[10px] text-muted-foreground">
                  <span>Impact: <span className="text-foreground">{insight.estimatedImpact}</span></span>
                  <span>Confidence: <span className="text-foreground tabular-nums">{Math.round(insight.confidence * 100)}%</span></span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
        )}
      </div>
    </button>
  );
}

export default Insights;
