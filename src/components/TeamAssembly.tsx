import { motion } from "framer-motion";
import type { TalentMatch, TeamSummary } from "@/lib/types";
import TalentCard from "./TalentCard";
import TeamSummaryPanel from "./TeamSummary";

interface TeamAssemblyProps {
  discoveries: TalentMatch[];
  summary: TeamSummary;
  onToggleShortlist: (match: TalentMatch) => void;
  onRemoveFromTeam: (id: string) => void;
}

const TeamAssembly = ({ discoveries, summary, onToggleShortlist, onRemoveFromTeam }: TeamAssemblyProps) => {
  const shortlistedIds = new Set(summary.shortlisted.map(m => m.employee.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto px-6 pt-28 pb-20"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main feed */}
        <div className="flex-1 min-w-0">
          <div className="space-y-1 mb-6">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Candidate Feed
            </span>
            <h2 className="font-serif text-2xl text-foreground">
              {discoveries.length} people matched
            </h2>
            <p className="text-xs text-muted-foreground font-light">
              Ranked by domain relevance. Click a card to see details, then add to your team.
            </p>
          </div>

          <div>
            {discoveries.map((match, i) => (
              <TalentCard
                key={match.employee.id}
                match={match}
                rank={i + 1}
                isShortlisted={shortlistedIds.has(match.employee.id)}
                onToggleShortlist={() => onToggleShortlist(match)}
                delay={i * 0.08}
              />
            ))}
          </div>
        </div>

        {/* Sticky summary */}
        <div className="w-full lg:w-[340px] flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <TeamSummaryPanel summary={summary} onRemove={onRemoveFromTeam} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamAssembly;
