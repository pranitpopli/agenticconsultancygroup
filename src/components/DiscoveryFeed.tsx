import { motion, AnimatePresence } from "framer-motion";
import type { SwarmSession } from "@/lib/types";
import SwarmProgress from "./SwarmProgress";
import ActivityLog from "./ActivityLog";
import TalentCard from "./TalentCard";
import FinancialView from "./FinancialView";
import NarrativeView from "./NarrativeView";

interface DiscoveryFeedProps {
  session: SwarmSession;
}

const DiscoveryFeed = ({ session }: DiscoveryFeedProps) => {
  const topTeam = session.discoveries.slice(0, session.brief.teamSize);
  const others = session.discoveries.slice(session.brief.teamSize);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto space-y-10"
    >
      {/* Brief */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Project Brief
        </span>
        <p className="text-foreground font-serif text-xl italic leading-snug">
          "{session.brief.description.length > 120
            ? session.brief.description.slice(0, 120) + "…"
            : session.brief.description}"
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {session.brief.requiredSkills.map((skill) => (
            <span key={skill} className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground border border-border px-2 py-0.5 rounded-sm">
              {skill}
            </span>
          ))}
          <span className="text-[9px] uppercase tracking-[0.15em] text-warm-accent border border-warm-accent/30 px-2 py-0.5 rounded-sm">
            {session.brief.priority}
          </span>
        </div>
      </div>

      {/* Swarm Progress */}
      {session.status !== "idle" && <SwarmProgress session={session} />}

      {/* Activity Log */}
      {session.logs.length > 0 && <ActivityLog logs={session.logs} />}

      {/* Assembled Team */}
      <AnimatePresence>
        {topTeam.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-1"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
              {session.status === "complete" ? "Assembled Team" : "Emerging Matches"}
              {" "}· {topTeam.length} of {session.brief.teamSize}
            </span>
            <div>
              {topTeam.map((match, i) => (
                <TalentCard
                  key={match.employee.id}
                  match={match}
                  rank={i + 1}
                  isTopPick={i === 0 && session.status === "complete"}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Other discoveries (collapsed) */}
      {others.length > 0 && session.status === "complete" && (
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 block">
            Other Candidates · {others.length}
          </span>
          <div className="opacity-60">
            {others.slice(0, 4).map((match, i) => (
              <TalentCard
                key={match.employee.id}
                match={match}
                rank={topTeam.length + i + 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Financial Model */}
      <AnimatePresence>
        {session.financialModel && (
          <FinancialView model={session.financialModel} />
        )}
      </AnimatePresence>

      {/* Narrative */}
      <AnimatePresence>
        {session.narrative && (
          <NarrativeView narrative={session.narrative} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DiscoveryFeed;
