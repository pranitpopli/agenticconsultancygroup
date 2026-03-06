import { motion, AnimatePresence } from "framer-motion";
import type { SwarmLog } from "@/lib/types";

interface ActivityLogProps {
  logs: SwarmLog[];
}

const typeStyles: Record<string, string> = {
  discovery: "text-warm-accent",
  analysis: "text-foreground/70",
  insight: "text-foreground",
  consensus: "text-foreground font-medium",
};

const ActivityLog = ({ logs }: ActivityLogProps) => {
  const recentLogs = logs.slice(-12).reverse();

  return (
    <div className="space-y-3">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Swarm Activity
      </span>
      <div className="timeline-line space-y-0.5 pl-3 max-h-64 overflow-y-auto">
        <AnimatePresence initial={false}>
          {recentLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -8, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 pl-2 py-1.5"
            >
              <div className="relative flex-shrink-0 mt-1.5">
                <div className={`w-1 h-1 rounded-full ${
                  log.type === "discovery" ? "bg-warm-accent/60" :
                  log.type === "consensus" ? "bg-foreground/60" :
                  "bg-muted-foreground/30"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] text-muted-foreground/60 flex-shrink-0">
                    {log.agentName}
                  </span>
                  <span className={`text-xs font-light leading-snug ${typeStyles[log.type] || "text-foreground/70"}`}>
                    {log.message}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActivityLog;
