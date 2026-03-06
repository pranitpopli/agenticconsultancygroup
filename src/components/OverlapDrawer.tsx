import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Clock, CheckCircle2, PauseCircle, XCircle } from "lucide-react";
import type { OverlappingProject } from "@/lib/types";
import { EMPLOYEES } from "@/lib/simulatedData";

interface OverlapDrawerProps {
  overlaps: OverlappingProject[];
  onClose: () => void;
  onProceed: () => void;
  preSelectedPeople: Set<string>;
  onTogglePerson: (id: string) => void;
}

const outcomeIcon = {
  completed: <CheckCircle2 className="w-3.5 h-3.5 text-green-600" strokeWidth={1.5} />,
  stalled: <PauseCircle className="w-3.5 h-3.5 text-warm-accent" strokeWidth={1.5} />,
  cancelled: <XCircle className="w-3.5 h-3.5 text-destructive" strokeWidth={1.5} />,
};

const OverlapDrawer = ({ overlaps, onClose, onProceed, preSelectedPeople, onTogglePerson }: OverlapDrawerProps) => {
  const totalTimeSaved = overlaps.reduce((sum, o) => {
    const weeks = parseInt(o.estimatedTimeSaved) || 0;
    return sum + weeks;
  }, 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-foreground/10" onClick={onClose} />

        {/* Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-background border-l border-border overflow-y-auto"
        >
          <div className="p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Prior Work
                </span>
                <h2 className="font-serif text-2xl text-foreground mt-1">
                  Overlapping Projects
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-sm transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              </button>
            </div>

            {/* Project cards */}
            {overlaps.map((project) => (
              <div key={project.id} className="border border-border p-5 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {outcomeIcon[project.outcome]}
                    <span className="text-sm text-foreground">{project.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
                    <span>{project.year}</span>
                    <span>·</span>
                    <span>{project.department}</span>
                    <span>·</span>
                    <span className={
                      project.outcome === "completed" ? "text-green-600" :
                      project.outcome === "stalled" ? "text-warm-accent" : "text-destructive"
                    }>
                      {project.outcome}
                    </span>
                  </div>
                </div>

                {/* Learnings */}
                <ul className="space-y-1.5">
                  {project.learnings.map((learning, i) => (
                    <li key={i} className="text-xs text-muted-foreground font-light leading-relaxed flex gap-2">
                      <span className="text-muted-foreground/30 mt-0.5 flex-shrink-0">–</span>
                      {learning}
                    </li>
                  ))}
                </ul>

                {/* People involved */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    People involved
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.peopleInvolved.map(id => {
                      const emp = EMPLOYEES.find(e => e.id === id);
                      if (!emp) return null;
                      const isSelected = preSelectedPeople.has(id);
                      return (
                        <button
                          key={id}
                          onClick={() => onTogglePerson(id)}
                          className={`flex items-center gap-2 text-[11px] px-2.5 py-1.5 rounded-sm border transition-colors ${
                            isSelected
                              ? "border-foreground/30 text-foreground bg-muted/50"
                              : "border-border text-muted-foreground hover:border-foreground/20"
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[8px] text-muted-foreground font-medium">
                            {emp.avatarInitials}
                          </span>
                          {emp.name}
                          {isSelected && <span className="text-[8px] text-warm-accent">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Time saved line */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-light italic font-serif">
              <Clock className="w-3 h-3" strokeWidth={1.5} />
              Reusing this work could save an estimated {totalTimeSaved} weeks.
            </div>

            {/* CTA */}
            <button
              onClick={onProceed}
              className="w-full flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.15em] text-foreground border border-foreground/30 px-4 py-3 rounded-sm hover:bg-foreground hover:text-background transition-colors"
            >
              Assemble team with this context
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OverlapDrawer;
