import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import SwarmLeadNav from "@/components/SwarmLeadNav";
import BriefInput from "@/components/BriefInput";
import SwarmThinking from "@/components/SwarmThinking";
import SiloCheck from "@/components/SiloCheck";
import OverlapDrawer from "@/components/OverlapDrawer";
import TeamAssembly from "@/components/TeamAssembly";
import { createSession } from "@/lib/talentSwarm";
import type { AppStage, SwarmSession, TalentMatch } from "@/lib/types";

const Index = () => {
  const [stage, setStage] = useState<AppStage>("brief");
  const [session, setSession] = useState<SwarmSession | null>(null);
  const [showOverlapDrawer, setShowOverlapDrawer] = useState(false);
  const [preSelectedPeople, setPreSelectedPeople] = useState<Set<string>>(new Set());

  const handleBriefSubmit = useCallback((text: string) => {
    const newSession = createSession(text);
    setSession(newSession);
    setStage("thinking");
  }, []);

  const handleThinkingComplete = useCallback(() => {
    setStage("silo-check");
  }, []);

  const handleSkipToTeam = useCallback(() => {
    if (!session) return;
    // Pre-select people from overlapping projects if any were selected
    if (preSelectedPeople.size > 0) {
      const preSelected = session.discoveries.filter(d => preSelectedPeople.has(d.employee.id));
      setSession(prev => {
        if (!prev) return prev;
        const updatedReqs = updateCoverage(prev.teamSummary.requirements, preSelected);
        return {
          ...prev,
          teamSummary: {
            ...prev.teamSummary,
            shortlisted: preSelected,
            requirements: updatedReqs,
          },
        };
      });
    }
    setShowOverlapDrawer(false);
    setStage("team-assembly");
  }, [session, preSelectedPeople]);

  const handleToggleShortlist = useCallback((match: TalentMatch) => {
    setSession(prev => {
      if (!prev) return prev;
      const existing = prev.teamSummary.shortlisted;
      const isAlreadyAdded = existing.some(m => m.employee.id === match.employee.id);

      const newShortlisted = isAlreadyAdded
        ? existing.filter(m => m.employee.id !== match.employee.id)
        : [...existing, match];

      const updatedReqs = updateCoverage(prev.teamSummary.requirements, newShortlisted);

      return {
        ...prev,
        teamSummary: {
          ...prev.teamSummary,
          shortlisted: newShortlisted,
          requirements: updatedReqs,
        },
      };
    });
  }, []);

  const handleRemoveFromTeam = useCallback((id: string) => {
    setSession(prev => {
      if (!prev) return prev;
      const newShortlisted = prev.teamSummary.shortlisted.filter(m => m.employee.id !== id);
      const updatedReqs = updateCoverage(prev.teamSummary.requirements, newShortlisted);
      return {
        ...prev,
        teamSummary: {
          ...prev.teamSummary,
          shortlisted: newShortlisted,
          requirements: updatedReqs,
        },
      };
    });
  }, []);

  const handleTogglePreSelect = useCallback((id: string) => {
    setPreSelectedPeople(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SwarmLeadNav />

      <AnimatePresence mode="wait">
        {stage === "brief" && (
          <BriefInput key="brief" onSubmit={handleBriefSubmit} />
        )}

        {stage === "thinking" && session && (
          <SwarmThinking
            key="thinking"
            lines={session.thinkingLines}
            onComplete={handleThinkingComplete}
          />
        )}

        {stage === "silo-check" && session && (
          <SiloCheck
            key="silo"
            overlaps={session.overlaps}
            onReviewOverlaps={() => setShowOverlapDrawer(true)}
            onSkipToTeam={handleSkipToTeam}
          />
        )}

        {stage === "team-assembly" && session && (
          <TeamAssembly
            key="assembly"
            discoveries={session.discoveries}
            summary={session.teamSummary}
            onToggleShortlist={handleToggleShortlist}
            onRemoveFromTeam={handleRemoveFromTeam}
          />
        )}
      </AnimatePresence>

      {/* Overlap drawer */}
      {showOverlapDrawer && session && (
        <OverlapDrawer
          overlaps={session.overlaps}
          onClose={() => setShowOverlapDrawer(false)}
          onProceed={handleSkipToTeam}
          preSelectedPeople={preSelectedPeople}
          onTogglePerson={handleTogglePreSelect}
        />
      )}
    </div>
  );
};

function updateCoverage(
  requirements: { label: string; covered: boolean }[],
  shortlisted: TalentMatch[]
): { label: string; covered: boolean }[] {
  const allSkills = shortlisted.flatMap(m => [
    ...m.employee.skills,
    ...m.employee.domainExpertise,
    m.employee.department,
  ]).map(s => s.toLowerCase());

  return requirements.map(req => {
    const label = req.label.toLowerCase();
    const covered = allSkills.some(s =>
      s.includes(label.split(" ")[0].replace("&", "")) ||
      label.includes(s.split(" ")[0])
    ) || (
      label.includes("frontend") && allSkills.some(s => ["react", "typescript", "css", "frontend"].some(k => s.includes(k)))
    ) || (
      label.includes("backend") && allSkills.some(s => ["node.js", "go", "postgresql", "microservices", "backend", "api"].some(k => s.includes(k)))
    ) || (
      label.includes("data") && allSkills.some(s => ["python", "machine learning", "data", "analytics"].some(k => s.includes(k)))
    ) || (
      label.includes("infrastructure") && allSkills.some(s => ["aws", "docker", "kubernetes", "infrastructure", "cloud"].some(k => s.includes(k)))
    ) || (
      label.includes("design") && allSkills.some(s => ["figma", "design", "user research", "ux"].some(k => s.includes(k)))
    ) || (
      label.includes("security") && allSkills.some(s => ["security", "testing", "qa", "quality"].some(k => s.includes(k)))
    ) || (
      label.includes("cross-functional") && shortlisted.length >= 2 &&
      new Set(shortlisted.map(m => m.employee.department)).size >= 2
    );

    return { ...req, covered };
  });
}

export default Index;
