import { motion } from "framer-motion";
import { Check, Circle, AlertTriangle } from "lucide-react";
import type { DeliveryStatus } from "@/lib/briefingData";

interface Props {
  status: DeliveryStatus;
}

const DeliveryTracker = ({ status }: Props) => {
  return (
    <div>
      {/* Overall header */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Approved</p>
          <p className="text-sm text-foreground">{status.approvedDate}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Overall progress</p>
          <p className="text-2xl text-foreground font-sans tabular-nums">{status.overallProgress}%</p>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="h-1.5 bg-secondary rounded-full mb-10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${status.overallProgress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-foreground rounded-full"
        />
      </div>

      {/* Phase cards */}
      <div className="space-y-6">
        {status.phases.map((phase) => {
          const completedMilestones = phase.milestones.filter((m) => m.complete).length;
          const totalMilestones = phase.milestones.length;
          const hasBlockers = phase.blockers.length > 0;

          return (
            <div key={phase.phaseNumber} className="border border-border p-5">
              {/* Phase header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-medium text-foreground">Phase {phase.phaseNumber}: {phase.phaseTitle}</span>
                  {hasBlockers && (
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-destructive">
                      <AlertTriangle className="h-3 w-3" />
                      {phase.blockers.length} blocker{phase.blockers.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <span className="text-sm text-foreground tabular-nums font-sans">{phase.progressPercent}%</span>
              </div>

              {/* Phase progress bar */}
              <div className="h-1 bg-secondary rounded-full mb-5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${phase.progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className={`h-full rounded-full ${hasBlockers ? "bg-destructive" : phase.progressPercent === 100 ? "bg-[hsl(var(--status-positive))]" : "bg-foreground"}`}
                />
              </div>

              {/* Milestones */}
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2.5">
                  Milestones · {completedMilestones}/{totalMilestones}
                </p>
                <div className="space-y-2">
                  {phase.milestones.map((milestone, mi) => (
                    <div key={mi} className="flex items-center gap-2.5">
                      {milestone.complete ? (
                        <Check className="h-3.5 w-3.5 text-[hsl(var(--status-positive))] shrink-0" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                      )}
                      <span className={`text-xs ${milestone.complete ? "text-muted-foreground line-through" : "text-foreground"}`}>
                        {milestone.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blockers */}
              {hasBlockers && (
                <div className="border-t border-border pt-3">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-destructive mb-2">Blockers</p>
                  <ul className="space-y-1.5">
                    {phase.blockers.map((blocker, bi) => (
                      <li key={bi} className="flex items-start gap-2 text-xs text-foreground/80">
                        <AlertTriangle className="h-3 w-3 text-destructive mt-0.5 shrink-0" />
                        {blocker}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryTracker;
