import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, AlertTriangle, TrendingDown, CheckCircle2 } from "lucide-react";
import type { Scenario } from "@/lib/briefingData";

interface Props {
  scenarios: Scenario[];
  onSelectScenario?: (scenario: Scenario) => void;
  selectedScenarioId?: string | null;
  readOnly?: boolean;
}

function riskColor(level: "low" | "medium" | "high") {
  return level === "high"
    ? "text-destructive"
    : level === "medium"
      ? "text-[hsl(var(--status-warning))]"
      : "text-[hsl(var(--status-positive))]";
}

const ScenarioModelling = ({ scenarios, onSelectScenario, selectedScenarioId, readOnly }: Props) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <p className="text-sm text-foreground/80 leading-[1.8] mb-6">
        Three delivery options modelled below. Each balances scope, cost, timeline, and risk differently.
        The recommended option is highlighted.
      </p>

      {/* Scenario cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {scenarios.map((scenario) => {
          const isExpanded = expanded === scenario.id;
          const isRecommended = scenario.recommended;
          const isChosen = selectedScenarioId === scenario.id;

          return (
            <div key={scenario.id} className="relative">
              <motion.button
                onClick={() => setExpanded(isExpanded ? null : scenario.id)}
                whileTap={{ scale: 0.985 }}
                className={`w-full text-left border p-5 transition-all duration-200 relative group ${
                  isChosen
                    ? "border-foreground bg-secondary/80 ring-1 ring-foreground/20"
                    : isExpanded
                      ? "border-foreground bg-secondary/50"
                      : isRecommended
                        ? "border-foreground/30 bg-card"
                        : "border-border bg-card hover:border-foreground/20"
                }`}
              >
                {/* Recommended badge */}
                {isRecommended && !isChosen && (
                  <span className="absolute -top-2.5 left-4 text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 bg-foreground text-primary-foreground">
                    Recommended
                  </span>
                )}

                {/* Selected badge */}
                {isChosen && (
                  <span className="absolute -top-2.5 left-4 text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 bg-[hsl(var(--status-positive))] text-primary-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Selected
                  </span>
                )}

                {/* Scenario name */}
                <h4 className="text-sm font-medium text-foreground mb-1">{scenario.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-5">{scenario.description}</p>

                {/* Key metrics */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Cost</span>
                    <span className="text-sm text-foreground tabular-nums font-sans">£{scenario.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Timeline</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-foreground tabular-nums font-sans">{scenario.weeks} weeks</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Risk</span>
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className={`h-3 w-3 ${riskColor(scenario.risk)}`} />
                      <span className={`text-sm capitalize ${riskColor(scenario.risk)}`}>{scenario.risk}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Scope</span>
                    <span className="text-sm text-foreground tabular-nums font-sans">{scenario.scopePercent}%</span>
                  </div>
                </div>

                {/* Expand indicator */}
                <div className={`mt-4 pt-3 border-t border-border transition-colors ${isExpanded ? "" : "opacity-0 group-hover:opacity-100"}`}>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {isExpanded ? "Hide details" : "View trade-offs"}
                  </span>
                </div>
              </motion.button>

              {/* Select button */}
              {!readOnly && onSelectScenario && !isChosen && (
                <button
                  onClick={() => onSelectScenario(scenario)}
                  className="w-full mt-2 text-[10px] uppercase tracking-[0.12em] border border-border py-2 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  Select this option
                </button>
              )}
              {isChosen && (
                <div className="w-full mt-2 text-[10px] uppercase tracking-[0.12em] border border-[hsl(var(--status-positive)/0.3)] bg-[hsl(var(--status-positive-bg))] py-2 text-center text-[hsl(var(--status-positive))]">
                  ✓ Active selection
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded trade-off detail */}
      <AnimatePresence>
        {expanded && (() => {
          const scenario = scenarios.find((s) => s.id === expanded);
          if (!scenario) return null;
          return (
            <motion.div
              key={expanded}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 border border-border p-5"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <h4 className="text-sm font-medium text-foreground">{scenario.name}</h4>
                <span className="text-xs text-muted-foreground">— trade-off analysis</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">What's included</p>
                  <ul className="space-y-1.5">
                    {scenario.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                        <Check className="h-3 w-3 text-[hsl(var(--status-positive))] mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">What's deferred</p>
                  <ul className="space-y-1.5">
                    {scenario.deferred.length > 0 ? scenario.deferred.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <TrendingDown className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                        {item}
                      </li>
                    )) : (
                      <li className="text-xs text-muted-foreground italic">Nothing deferred — full scope</li>
                    )}
                  </ul>
                </div>
              </div>

              <p className="text-sm text-foreground/80 leading-[1.8]">{scenario.tradeOffNarrative}</p>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Comparison table */}
      <div className="mt-8 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="border border-border overflow-hidden min-w-[480px]">
          <div className={`grid grid-cols-[1.5fr_repeat(${scenarios.length},1fr)] border-b border-border`}>
            <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground" />
            {scenarios.map((s) => (
              <div key={s.id} className={`p-3 text-[10px] uppercase tracking-[0.12em] border-l border-border ${
                s.id === selectedScenarioId ? "text-foreground font-medium bg-secondary/50" :
                s.recommended ? "text-foreground font-medium" : "text-muted-foreground"
              }`}>
                {s.name}
                {s.id === selectedScenarioId ? " ✓" : s.recommended ? " ★" : ""}
              </div>
            ))}
          </div>
          {[
            { label: "Cost", render: (s: Scenario) => `£${s.cost.toLocaleString()}` },
            { label: "Timeline", render: (s: Scenario) => `${s.weeks} weeks` },
            { label: "Scope", render: (s: Scenario) => `${s.scopePercent}%` },
            { label: "Risk", render: (s: Scenario) => s.risk },
            { label: "Team size", render: (s: Scenario) => `${s.teamSize} people` },
          ].map((row, i) => (
            <div key={row.label} className={`grid grid-cols-[1.5fr_repeat(${scenarios.length},1fr)] ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="p-3 text-xs text-muted-foreground">{row.label}</div>
              {scenarios.map((s) => (
                <div key={s.id} className={`p-3 text-xs border-l border-border capitalize ${
                  s.id === selectedScenarioId ? "text-foreground bg-secondary/30" :
                  s.recommended ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {row.render(s)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioModelling;
