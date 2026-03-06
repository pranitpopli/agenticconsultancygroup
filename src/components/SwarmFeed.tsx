import { motion, AnimatePresence } from "framer-motion";
import type { SwarmSession } from "@/lib/swarmTypes";
import AgentCard from "./AgentCard";
import ConflictEntry from "./ConflictEntry";
import { Activity, CheckCircle2 } from "lucide-react";

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
      className="w-full max-w-2xl mx-auto space-y-8"
    >
      {/* Task header */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Task
        </span>
        <p className="text-foreground font-serif text-lg italic">
          "{session.task}"
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        {session.status === "running" ? (
          <>
            <Activity className="w-3.5 h-3.5 text-glow-primary animate-pulse-glow" strokeWidth={1.5} />
            <span className="text-xs text-muted-foreground">
              Round {session.currentRound} — {session.agents.filter(a => a.status !== "defeated").length} agents remaining
            </span>
          </>
        ) : session.status === "complete" ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
            <span className="text-xs text-emerald-400">
              Tournament complete — Apex reached in {session.currentRound} rounds
            </span>
          </>
        ) : null}
      </div>

      {/* Apex result */}
      <AnimatePresence>
        {apexAgent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-glow-primary/10 via-transparent to-glow-secondary/5" />
            <div className="relative border border-primary/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                <span className="text-[10px] uppercase tracking-widest text-primary">
                  Apex Result
                </span>
              </div>
              <p className="text-foreground leading-relaxed">
                {apexAgent.output}
              </p>
              <p className="text-xs text-muted-foreground font-serif italic">
                — {apexAgent.name}, score {apexAgent.score}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conflict timeline */}
      {session.conflicts.length > 0 && (
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Conflict Log
          </span>
          <div className="timeline-line space-y-3 pl-3">
            {[...session.conflicts].reverse().map((conflict, i) => (
              <ConflictEntry key={conflict.id} conflict={conflict} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Agent roster */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Agents
        </span>
        <div className="space-y-2">
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
