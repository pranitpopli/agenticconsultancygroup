import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BriefAgentData } from "@/lib/swarmSimulator";
import { computeConvergence } from "@/lib/swarmSimulator";
import type { Agent } from "@/lib/swarmTypes";
import {
  DollarSign,
  Shield,
  Zap,
  Users,
  Heart,
  History,
  Check,
  AlertTriangle,
  Flag,
} from "lucide-react";

interface SwarmThinkingProps {
  agents: BriefAgentData[];
  onComplete: () => void;
}

const LENS_META: Record<string, { icon: typeof DollarSign; label: string }> = {
  cost: { icon: DollarSign, label: "Cost" },
  risk: { icon: Shield, label: "Risk" },
  speed: { icon: Zap, label: "Speed" },
  talent: { icon: Users, label: "Talent" },
  culture: { icon: Heart, label: "Culture" },
  precedent: { icon: History, label: "Precedent" },
};

const SIGNAL_STYLE: Record<string, { icon: typeof Check; color: string; label: string }> = {
  proceed: { icon: Check, color: "text-[hsl(var(--status-positive))]", label: "Proceed" },
  caution: { icon: AlertTriangle, color: "text-[hsl(var(--status-warning))]", label: "Caution" },
  flag: { icon: Flag, color: "text-[hsl(var(--status-negative))]", label: "Flag" },
};

const SwarmThinking = ({ agents, onComplete }: SwarmThinkingProps) => {
  const [phase, setPhase] = useState<"deploying" | "analysing" | "concluding" | "convergence">("deploying");
  const [concludedCount, setConcludedCount] = useState(0);
  const [skipped, setSkipped] = useState(false);

  const convergence = computeConvergence(
    agents.map((a) => ({ ...a, id: a.lens, name: a.lens, status: "concluded" as const }))
  );

  const handleSkip = useCallback(() => {
    if (skipped) return;
    setSkipped(true);
    setConcludedCount(agents.length);
    setPhase("convergence");
    setTimeout(onComplete, 600);
  }, [skipped, agents.length, onComplete]);

  // Keyboard: Escape to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleSkip();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  // Phase progression
  useEffect(() => {
    if (skipped) return;

    if (phase === "deploying") {
      const t = setTimeout(() => setPhase("analysing"), 800);
      return () => clearTimeout(t);
    }

    if (phase === "analysing") {
      const t = setTimeout(() => setPhase("concluding"), 2000);
      return () => clearTimeout(t);
    }

    if (phase === "concluding") {
      if (concludedCount < agents.length) {
        const t = setTimeout(() => setConcludedCount((c) => c + 1), 500);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("convergence"), 600);
        return () => clearTimeout(t);
      }
    }

    if (phase === "convergence") {
      const t = setTimeout(onComplete, 1200);
      return () => clearTimeout(t);
    }
  }, [phase, concludedCount, agents.length, onComplete, skipped]);

  const showAgents = phase !== "deploying";
  const showConvergence = phase === "convergence";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-[80vh] flex items-center justify-center px-6 cursor-pointer"
      role="status"
      aria-label="Agents analysing brief"
      onClick={!skipped ? handleSkip : undefined}
    >
      <div className="w-full max-w-2xl">
        {/* Deploying label */}
        <AnimatePresence mode="wait">
          {phase === "deploying" && (
            <motion.p
              key="deploying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center mb-8"
            >
              Deploying 6 specialised agents…
            </motion.p>
          )}
          {phase === "analysing" && (
            <motion.p
              key="analysing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center mb-8"
            >
              Agents analysing brief in parallel…
            </motion.p>
          )}
          {(phase === "concluding" || phase === "convergence") && (
            <motion.p
              key="concluding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center mb-8"
            >
              {concludedCount}/{agents.length} agents concluded
            </motion.p>
          )}
        </AnimatePresence>

        {/* Agent grid */}
        {showAgents && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8"
          >
            {agents.map((agent, i) => {
              const meta = LENS_META[agent.lens];
              const Icon = meta.icon;
              const concluded = i < concludedCount;
              const signalStyle = SIGNAL_STYLE[agent.signal];
              const SignalIcon = signalStyle.icon;

              return (
                <motion.div
                  key={agent.lens}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className={`border p-4 transition-colors ${
                    concluded
                      ? "border-foreground/20 bg-background"
                      : "border-border bg-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                      <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        {meta.label}
                      </span>
                    </div>
                    {concluded ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <SignalIcon className={`w-3.5 h-3.5 ${signalStyle.color}`} strokeWidth={2} />
                      </motion.div>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse" />
                    )}
                  </div>

                  {concluded ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-xs text-foreground leading-relaxed mb-1.5">
                        {agent.conclusion}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] uppercase tracking-[0.1em] ${signalStyle.color}`}>
                          {signalStyle.label}
                        </span>
                        <span className="text-[9px] text-muted-foreground/60">
                          {Math.round(agent.confidence * 100)}% confidence
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="h-2.5 bg-muted rounded-sm w-full animate-pulse" />
                      <div className="h-2.5 bg-muted rounded-sm w-3/4 animate-pulse" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Convergence summary */}
        <AnimatePresence>
          {showConvergence && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="border border-foreground/20 p-5"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Convergence
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {convergence.summary}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[10px] text-muted-foreground">
                  Overall confidence: {Math.round(convergence.confidence * 100)}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip hint */}
        {!skipped && phase !== "convergence" && (
          <p className="mt-6 text-[10px] uppercase tracking-[0.15em] text-muted-foreground text-center">
            Click anywhere or press Esc to skip
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default SwarmThinking;
