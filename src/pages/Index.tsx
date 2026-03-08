import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import BriefingNav from "@/components/BriefingNav";
import OverviewDashboard from "@/components/OverviewDashboard";
import BriefingDocumentView from "@/components/BriefingDocument";
import SwarmThinking from "@/components/SwarmThinking";
import SiloCheck from "@/components/SiloCheck";
import OverlapDrawer from "@/components/OverlapDrawer";
import { BRIEFING_DOCUMENTS } from "@/lib/briefingData";
import { OVERLAPPING_PROJECTS } from "@/lib/simulatedData";

type View = "briefings" | "swarm-thinking" | "silo-check" | "briefing-doc";

const SWARM_LINES = [
  "parsing brief...",
  "identifying domain: platform · infrastructure · data",
  "scanning 847 employee nodes...",
  "cross-referencing project archive...",
  "checking active workstreams...",
  "2 overlapping projects detected",
  "14 candidate profiles matched",
  "assembling org structure...",
  "generating value model...",
];

const Index = () => {
  const [view, setView] = useState<View>("briefings");
  const [activeBriefId, setActiveBriefId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"briefings" | "oqr" | "archive">("briefings");
  const [showOverlapDrawer, setShowOverlapDrawer] = useState(false);
  const [preSelectedPeople, setPreSelectedPeople] = useState<Set<string>>(new Set());

  const handleReadBriefing = (id: string) => {
    setActiveBriefId(id);
    setView("swarm-thinking");
  };

  const handleSwarmComplete = useCallback(() => {
    setView("silo-check");
  }, []);

  const handleSkipToDoc = useCallback(() => {
    setView("briefing-doc");
  }, []);

  const handleReviewOverlaps = () => {
    setShowOverlapDrawer(true);
  };

  const handleOverlapProceed = () => {
    setShowOverlapDrawer(false);
    setView("briefing-doc");
  };

  const handleTogglePerson = (id: string) => {
    setPreSelectedPeople((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBack = () => {
    setView("briefings");
    setActiveBriefId(null);
    setPreSelectedPeople(new Set());
  };

  const handleTabChange = (tab: "briefings" | "oqr" | "archive") => {
    setActiveTab(tab);
    if (tab === "briefings") {
      handleBack();
    }
  };

  const activeDoc = activeBriefId ? BRIEFING_DOCUMENTS[activeBriefId] : null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF8F4" }}>
      <BriefingNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <AnimatePresence mode="wait">
        {view === "briefings" && (
          <OverviewDashboard key="briefings" onReadBriefing={handleReadBriefing} />
        )}

        {view === "swarm-thinking" && (
          <SwarmThinking
            key="swarm-thinking"
            lines={SWARM_LINES}
            onComplete={handleSwarmComplete}
          />
        )}

        {view === "silo-check" && (
          <SiloCheck
            key="silo-check"
            overlaps={OVERLAPPING_PROJECTS}
            onReviewOverlaps={handleReviewOverlaps}
            onSkipToTeam={handleSkipToDoc}
          />
        )}

        {view === "briefing-doc" && activeDoc && (
          <BriefingDocumentView
            key={activeBriefId}
            doc={activeDoc}
            onBack={handleBack}
          />
        )}
      </AnimatePresence>

      {/* Overlap Drawer */}
      {showOverlapDrawer && (
        <OverlapDrawer
          overlaps={OVERLAPPING_PROJECTS}
          onClose={() => setShowOverlapDrawer(false)}
          onProceed={handleOverlapProceed}
          preSelectedPeople={preSelectedPeople}
          onTogglePerson={handleTogglePerson}
        />
      )}
    </div>
  );
};

export default Index;
