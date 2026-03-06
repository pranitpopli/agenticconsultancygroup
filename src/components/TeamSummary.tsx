import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import type { TeamSummary as TeamSummaryType, TalentMatch } from "@/lib/types";

interface TeamSummaryProps {
  summary: TeamSummaryType;
  onRemove: (id: string) => void;
}

const TeamSummaryPanel = ({ summary, onRemove }: TeamSummaryProps) => {
  if (summary.shortlisted.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="border border-border p-5 md:p-6 space-y-5"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Your Team · {summary.shortlisted.length}
      </span>

      {/* Shortlisted people */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {summary.shortlisted.map((match) => (
            <motion.div
              key={match.employee.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 text-[11px] text-foreground border border-border px-2.5 py-1.5 rounded-sm"
            >
              <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[8px] text-muted-foreground font-medium">
                {match.employee.avatarInitials}
              </span>
              {match.employee.name}
              <button
                onClick={() => onRemove(match.employee.id)}
                className="hover:text-destructive transition-colors ml-0.5"
              >
                <X className="w-3 h-3" strokeWidth={1.5} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Coverage map */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Brief Coverage
        </span>
        <div className="flex flex-wrap gap-1.5">
          {summary.requirements.map((req) => (
            <span
              key={req.label}
              className={`text-[10px] px-2.5 py-1 rounded-sm border transition-colors duration-500 ${
                req.covered
                  ? "border-green-600/20 text-green-700 bg-green-50"
                  : "border-border text-muted-foreground/50"
              }`}
            >
              {req.label}
            </span>
          ))}
        </div>
      </div>

      {/* Value line */}
      <p className="text-xs text-foreground/70 font-light leading-relaxed">
        This team saves an estimated{" "}
        <span className="text-foreground font-normal">{summary.savingsAmount}</span> vs. external hire.
        Assembly time: <span className="text-foreground font-normal">{summary.assemblyTime}</span>.
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <button className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-foreground border border-foreground/30 px-4 py-2.5 rounded-sm hover:bg-foreground hover:text-background transition-colors">
          Export team brief
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
        <button className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground border border-border px-4 py-2.5 rounded-sm hover:border-foreground/20 hover:text-foreground transition-colors">
          Push to Jira
        </button>
      </div>
    </motion.div>
  );
};

export default TeamSummaryPanel;
