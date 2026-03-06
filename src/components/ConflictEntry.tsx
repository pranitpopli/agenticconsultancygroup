import { motion } from "framer-motion";
import { Swords, Crown } from "lucide-react";
import type { Conflict } from "@/lib/swarmTypes";

interface ConflictEntryProps {
  conflict: Conflict;
  index: number;
}

const ConflictEntry = ({ conflict, index }: ConflictEntryProps) => {
  const winnerIsA = conflict.winnerId === conflict.agentA.id;
  const winner = winnerIsA ? conflict.agentA : conflict.agentB;
  const loser = winnerIsA ? conflict.agentB : conflict.agentA;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="flex items-start gap-4 pl-2"
    >
      {/* Timeline dot */}
      <div className="relative flex-shrink-0 mt-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-glow-primary/60" />
        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-glow-primary/30 animate-pulse-glow" />
      </div>

      {/* Conflict content */}
      <div className="flex-1 surface-elevated border border-border/30 rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Swords className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Round {conflict.round}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <Crown className="w-3 h-3" strokeWidth={1.5} />
            {winner.name}
          </span>
          <span className="text-muted-foreground text-xs">defeated</span>
          <span className="text-red-400/80">{loser.name}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ConflictEntry;
