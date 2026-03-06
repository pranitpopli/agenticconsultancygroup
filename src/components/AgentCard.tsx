import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Trophy, TrendingUp, TrendingDown, MessageSquare } from "lucide-react";
import type { Agent } from "@/lib/swarmTypes";

interface AgentCardProps {
  agent: Agent;
  rank?: number;
  isApex?: boolean;
}

const AgentCard = ({ agent, rank, isApex }: AgentCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const statusColor = agent.status === "winner"
    ? "text-emerald-400"
    : agent.status === "defeated"
    ? "text-red-400"
    : "text-muted-foreground";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
        isApex ? "particle-glow glow-md" : ""
      }`}
    >
      {isApex && (
        <div className="absolute inset-0 bg-gradient-to-br from-glow-primary/5 to-transparent pointer-events-none" />
      )}
      <div className="relative surface-elevated border border-border/50 rounded-xl">
        {/* Collapsed header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/30 transition-colors"
        >
          {/* Rank / Status indicator */}
          <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
            isApex ? "bg-primary/15" : "bg-muted"
          }`}>
            {isApex ? (
              <Trophy className="w-4 h-4 text-primary" strokeWidth={1.5} />
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                {rank ?? "—"}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground truncate">
                {agent.name}
              </span>
              {isApex && (
                <span className="text-[10px] uppercase tracking-widest text-primary font-medium">
                  Apex
                </span>
              )}
            </div>
            <span className={`text-xs ${statusColor} capitalize`}>
              {agent.status}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{agent.score.toFixed(1)}</div>
              <div className="flex items-center gap-0.5">
                {agent.reputation >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-emerald-400" strokeWidth={1.5} />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" strokeWidth={1.5} />
                )}
                <span className={`text-[10px] ${agent.reputation >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {agent.reputation > 0 ? "+" : ""}{agent.reputation}
                </span>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            </motion.div>
          </div>
        </button>

        {/* Expanded: Monologue + details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">
                <div className="h-px bg-border/50" />

                {/* Output preview */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Output
                  </span>
                  <p className="text-sm text-secondary-foreground leading-relaxed">
                    {agent.output}
                  </p>
                </div>

                {/* Monologue */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3 text-glow-primary" strokeWidth={1.5} />
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Internal Monologue
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed italic font-serif">
                    "{agent.monologue}"
                  </p>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">Wins</span>
                    <span className="text-xs font-medium text-emerald-400">{agent.wins}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">Losses</span>
                    <span className="text-xs font-medium text-red-400">{agent.losses}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">Rounds</span>
                    <span className="text-xs font-medium text-foreground">{agent.rounds}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AgentCard;
