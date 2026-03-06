import { motion } from "framer-motion";
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
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="flex items-start gap-4 pl-2"
    >
      <div className="relative flex-shrink-0 mt-2">
        <div className="w-1.5 h-1.5 rounded-full bg-warm-accent/60" />
      </div>

      <div className="flex-1 py-1.5">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
          Round {conflict.round}
        </div>
        <div className="text-sm font-light">
          <span className="text-foreground">{winner.name}</span>
          <span className="text-muted-foreground mx-2">over</span>
          <span className="text-muted-foreground/60">{loser.name}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ConflictEntry;
