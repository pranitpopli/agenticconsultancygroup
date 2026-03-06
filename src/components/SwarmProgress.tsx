import { motion } from "framer-motion";
import type { SwarmSession } from "@/lib/types";

interface SwarmProgressProps {
  session: SwarmSession;
}

const SwarmProgress = ({ session }: SwarmProgressProps) => {
  return (
    <div className="space-y-6">
      {/* Phase & Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {session.currentPhase}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {Math.round(session.progress)}%
          </span>
        </div>
        <div className="h-px bg-border relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-foreground/40"
            initial={{ width: "0%" }}
            animate={{ width: `${session.progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Active Agents */}
      <div className="grid grid-cols-5 gap-3">
        {session.agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="space-y-1.5"
          >
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${
                agent.status === "scanning" ? "bg-warm-accent animate-pulse" :
                agent.status === "analyzing" ? "bg-foreground/50 animate-pulse" :
                agent.status === "complete" ? "bg-foreground/30" :
                "bg-border"
              }`} />
              <span className="text-[10px] text-foreground font-medium truncate">
                {agent.name}
              </span>
            </div>
            <span className="text-[9px] text-muted-foreground block truncate">
              {agent.focus}
            </span>
            {agent.currentAction && (
              <span className="text-[9px] text-muted-foreground/60 block truncate italic">
                {agent.currentAction}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SwarmProgress;
