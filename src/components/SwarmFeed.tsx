import { motion, AnimatePresence } from "framer-motion";
import type { SwarmSession } from "@/lib/swarmTypes";
import AgentCard from "./AgentCard";
import ConflictEntry from "./ConflictEntry";

interface SwarmFeedProps {
  session: SwarmSession;
}

const SwarmFeed = ({ session }: SwarmFeedProps) => {
  const sortedAgents = [...session.agents].sort((a, b) => {
    if (a.status === "winner") return -1;
    if (b.status === "winner") return 1;
    if (a.status === "defeated" && b.status !== "defeated") return 1;
    if (b.status === "defeated" && a.status !== "defeated") return -1;
    return b.score - a.score;
  });

  const apexAgent = session.agents.find((a) => a.id === session.apexAgentId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto space-y-10"
    >
      {/* Task */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Task
        </span>
        <p className="text-foreground font-serif text-2xl italic leading-snug">
          "{session.task}"
        </p>
      </div>

      {/* Status */}
      <div>
        {session.status === "running" ? (
          <span className="text-[11px] text-muted-foreground tracking-wide">
            Round {session.currentRound} · {session.agents.filter(a => a.status !== "defeated").length} agents remaining
          </span>
        ) : session.status === "complete" ? (
          <span className="text-[11px] text-foreground/70 tracking-wide">
            Complete · Apex in {session.currentRound} rounds
          </span>
        ) : null}
      </div>

      {/* Apex result */}
      <AnimatePresence>
        {apexAgent && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="border border-border rounded-sm p-6 space-y-4"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-warm-accent">
              Apex Result
            </span>
            <p className="text-foreground leading-relaxed font-light">
              {apexAgent.output}
            </p>
            <p className="text-xs text-muted-foreground font-serif italic">
              — {apexAgent.name}, {apexAgent.score.toFixed(1)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conflicts */}
      {session.conflicts.length > 0 && (
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Conflicts
          </span>
          <div className="timeline-line space-y-1 pl-3">
            {[...session.conflicts].reverse().map((conflict, i) => (
              <ConflictEntry key={conflict.id} conflict={conflict} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Agents */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
          Agents
        </span>
        <div>
          {sortedAgents.map((agent, i) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              rank={i + 1}
              isApex={agent.id === session.apexAgentId}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SwarmFeed;
