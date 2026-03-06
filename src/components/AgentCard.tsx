import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowUp, ArrowDown } from "lucide-react";
import type { Agent } from "@/lib/swarmTypes";

interface AgentCardProps {
  agent: Agent;
  rank?: number;
  isApex?: boolean;
}

const AgentCard = ({ agent, rank, isApex }: AgentCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`border-b border-border/60 ${isApex ? "border-b-foreground/30" : ""}`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 py-4 text-left hover:bg-muted/30 transition-colors px-1"
      >
        <span className="text-xs text-muted-foreground w-6 text-center font-light">
          {isApex ? "✦" : rank ?? "—"}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground">
              {agent.name}
            </span>
            {isApex && (
              <span className="text-[10px] uppercase tracking-[0.2em] text-warm-accent">
                Apex
              </span>
            )}
          </div>
          <span className={`text-[11px] capitalize ${
            agent.status === "winner" ? "text-foreground/70" 
            : agent.status === "defeated" ? "text-muted-foreground/60" 
            : "text-muted-foreground"
          }`}>
            {agent.status}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-foreground font-light">{agent.score.toFixed(1)}</div>
            <div className="flex items-center gap-0.5 justify-end">
              {agent.reputation >= 0 ? (
                <ArrowUp className="w-2.5 h-2.5 text-foreground/50" strokeWidth={1} />
              ) : (
                <ArrowDown className="w-2.5 h-2.5 text-muted-foreground" strokeWidth={1} />
              )}
              <span className="text-[10px] text-muted-foreground">
                {agent.reputation > 0 ? "+" : ""}{agent.reputation}
              </span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-1 pb-5 pl-10 space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Output
                </span>
                <p className="text-sm text-foreground/80 leading-relaxed font-light">
                  {agent.output}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Monologue
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed italic font-serif">
                  "{agent.monologue}"
                </p>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <span className="text-[10px] text-muted-foreground">
                  {agent.wins}W · {agent.losses}L · {agent.rounds}R
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AgentCard;
