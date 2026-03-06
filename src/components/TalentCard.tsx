import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin, Clock } from "lucide-react";
import type { TalentMatch } from "@/lib/types";

interface TalentCardProps {
  match: TalentMatch;
  rank: number;
  isTopPick?: boolean;
}

const TalentCard = ({ match, rank, isTopPick }: TalentCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { employee } = match;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`border-b border-border/60 ${isTopPick ? "border-b-foreground/20" : ""}`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 py-4 text-left hover:bg-muted/30 transition-colors px-1"
      >
        <span className="text-xs text-muted-foreground w-6 text-center font-light">
          {isTopPick ? "✦" : rank}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground">{employee.name}</span>
            {isTopPick && (
              <span className="text-[9px] uppercase tracking-[0.2em] text-warm-accent">
                Top Pick
              </span>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground">{employee.role}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <MapPin className="w-2.5 h-2.5" strokeWidth={1} />
              {employee.location}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-2.5 h-2.5" strokeWidth={1} />
              {employee.availability}% available
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-foreground font-light">{match.matchScore}%</div>
            <span className="text-[10px] text-muted-foreground">match</span>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-1 pb-5 pl-10 space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Why this person
                </span>
                <p className="text-sm text-foreground/80 leading-relaxed font-light">
                  {match.reasoning}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Skills Match
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {match.skillMatches.map((sm) => (
                    <span
                      key={sm.skill}
                      className={`text-[10px] px-2 py-0.5 rounded-sm border ${
                        sm.matchStrength > 0.6
                          ? "border-foreground/20 text-foreground/80"
                          : "border-border text-muted-foreground/50"
                      }`}
                    >
                      {sm.skill} · {Math.round(sm.matchStrength * 100)}%
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Past Projects
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {employee.pastProjects.map((p) => (
                    <span key={p} className="text-[10px] text-muted-foreground border border-border/50 px-2 py-0.5 rounded-sm">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <span className="text-[10px] text-muted-foreground">
                  {employee.seniorityLevel} · {employee.yearsExperience}y exp · ${employee.hourlyRate}/hr
                </span>
                <span className="text-[10px] text-muted-foreground/60 italic font-serif">
                  Discovered by {match.discoveredBy}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TalentCard;
