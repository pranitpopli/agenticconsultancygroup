import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Check } from "lucide-react";
import type { TalentMatch } from "@/lib/types";

interface TalentCardProps {
  match: TalentMatch;
  rank: number;
  isShortlisted: boolean;
  onToggleShortlist: () => void;
  delay?: number;
}

const availabilityLabel = {
  available: { text: "Available", className: "text-green-700 border-green-600/20 bg-green-50" },
  partial: { text: "Partial", className: "text-warm-accent border-warm-accent/20 bg-accent" },
  committed: { text: "Committed", className: "text-muted-foreground border-border bg-muted" },
};

const TalentCard = ({ match, rank, isShortlisted, onToggleShortlist, delay = 0 }: TalentCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { employee } = match;
  const avail = availabilityLabel[employee.availability];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      className="border-b border-border/60"
    >
      <div className="flex items-start gap-3 py-5 px-1">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground font-medium flex-shrink-0 mt-0.5">
          {employee.avatarInitials}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground">{employee.name}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-sm border ${avail.className}`}>
                  {avail.text}
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {employee.role} · {employee.department}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onToggleShortlist}
                className={`flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-sm border transition-colors ${
                  isShortlisted
                    ? "border-foreground/30 text-foreground bg-muted/50"
                    : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                }`}
              >
                {isShortlisted ? (
                  <>
                    <Check className="w-3 h-3" strokeWidth={2} />
                    Added
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3" strokeWidth={1.5} />
                    Add to team
                  </>
                )}
              </button>
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1.5 hover:bg-muted rounded-sm transition-colors"
              >
                <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                </motion.div>
              </button>
            </div>
          </div>

          {/* Why match line */}
          <p className="text-xs text-foreground/70 font-light mt-1.5 leading-relaxed">
            {match.whyMatch}
          </p>

          {/* Domain relevance bar */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden max-w-[120px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${match.domainRelevance.strength * 100}%` }}
                transition={{ duration: 0.6, delay: delay + 0.3 }}
                className="h-full bg-foreground/40 rounded-full"
              />
            </div>
            <span className="text-[10px] text-muted-foreground">
              {match.domainRelevance.strength > 0.7 ? "Strong" : match.domainRelevance.strength > 0.4 ? "Moderate" : "Partial"} match · {match.domainRelevance.label}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-1 pb-6 pl-12 space-y-5">
              {/* Past projects */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Relevant Projects
                </span>
                <div className="space-y-1">
                  {match.relevantProjects.map((p) => (
                    <div key={p.name} className="flex items-center gap-2 text-xs">
                      <span className="text-foreground/80">{p.name}</span>
                      <span className="text-muted-foreground/50">·</span>
                      <span className="text-muted-foreground">{p.year}</span>
                      <span className="text-muted-foreground/50">·</span>
                      <span className="text-muted-foreground italic font-serif">{p.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technology tags */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Technologies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {employee.technologies.map(t => (
                    <span key={t} className="text-[10px] text-muted-foreground border border-border/60 px-2 py-0.5 rounded-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Collaboration context */}
              {match.collaborationContext && (
                <p className="text-xs text-muted-foreground/70 font-light italic font-serif">
                  {match.collaborationContext}
                </p>
              )}

              {/* Trust signal */}
              <p className="text-xs text-foreground/60 font-light border-l-2 border-border pl-3">
                {match.reasoning}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TalentCard;
