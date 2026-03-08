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
import type { OverlappingProject } from "@/lib/types";

type View = "briefings" | "swarm-thinking" | "silo-check" | "briefing-doc" | "archive";

const SWARM_LINES_MAP: Record<string, string[]> = {
  "brief-001": [
    "parsing brief...",
    "identifying domain: platform · infrastructure · engineering",
    "scanning 847 employee nodes...",
    "cross-referencing project archive...",
    "checking active workstreams...",
    "2 overlapping projects detected",
    "5 candidate profiles matched across 3 departments",
    "assembling org structure...",
    "generating value model...",
    "projected saving: £284,000 vs external hire",
  ],
  "brief-002": [
    "parsing brief...",
    "identifying domain: data · analytics · machine learning",
    "scanning 847 employee nodes...",
    "cross-referencing project archive...",
    "checking active workstreams...",
    "0 overlapping projects detected",
    "5 candidate profiles matched across 4 departments",
    "assembling org structure...",
    "generating value model...",
    "projected saving: £370,000 vs external hire",
  ],
};

const OVERLAPS_MAP: Record<string, OverlappingProject[]> = {
  "brief-001": OVERLAPPING_PROJECTS,
  "brief-002": [], // No overlaps for the data intelligence brief
};

const Index = () => {
  const [view, setView] = useState<View>("briefings");
  const [activeBriefId, setActiveBriefId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"briefings" | "oqr" | "archive">("briefings");
  const [showOverlapDrawer, setShowOverlapDrawer] = useState(false);
  const [preSelectedPeople, setPreSelectedPeople] = useState<Set<string>>(new Set());

  const currentOverlaps = activeBriefId ? (OVERLAPS_MAP[activeBriefId] || []) : [];
  const currentSwarmLines = activeBriefId ? (SWARM_LINES_MAP[activeBriefId] || SWARM_LINES_MAP["brief-001"]) : [];

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
    if (tab === "archive") {
      setView("archive");
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
            key={`swarm-${activeBriefId}`}
            lines={currentSwarmLines}
            onComplete={handleSwarmComplete}
          />
        )}

        {view === "silo-check" && (
          <SiloCheck
            key={`silo-${activeBriefId}`}
            overlaps={currentOverlaps}
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

        {view === "archive" && (
          <div key="archive" className="max-w-[780px] mx-auto px-8 pt-28 pb-24">
            <h1 className="font-serif text-3xl text-foreground mb-2">Archive</h1>
            <p className="text-sm text-muted-foreground mb-10">
              Previously completed briefings and their outcomes.
            </p>
            <div className="border border-border p-8 text-center">
              <p className="text-sm text-muted-foreground font-serif italic">
                No archived briefings yet. Completed briefings will appear here after deployment.
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Overlap Drawer */}
      {showOverlapDrawer && (
        <OverlapDrawer
          overlaps={currentOverlaps}
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
