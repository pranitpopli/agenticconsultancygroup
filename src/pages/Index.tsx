import { useState, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import BriefingNav from "@/components/BriefingNav";
import OverviewDashboard from "@/components/OverviewDashboard";
import BriefingDocumentView from "@/components/BriefingDocument";
import SwarmThinking from "@/components/SwarmThinking";
import SiloCheck from "@/components/SiloCheck";
import OverlapDrawer from "@/components/OverlapDrawer";
import ArchiveView from "@/components/ArchiveView";
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
  "brief-002": [],
};

// Derive view and briefId from search params
function deriveState(searchParams: URLSearchParams): { view: View; briefId: string | null; activeTab: "briefings" | "oqr" | "archive" } {
  const tab = searchParams.get("tab");
  const v = searchParams.get("view") as View | null;
  const briefId = searchParams.get("brief");

  if (tab === "archive") {
    return { view: "archive", briefId: null, activeTab: "archive" };
  }

  if (v && briefId && ["swarm-thinking", "silo-check", "briefing-doc"].includes(v)) {
    return { view: v as View, briefId, activeTab: "briefings" };
  }

  return { view: "briefings", briefId: null, activeTab: "briefings" };
}

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { view, briefId: activeBriefId, activeTab } = useMemo(() => deriveState(searchParams), [searchParams]);

  const [showOverlapDrawer, setShowOverlapDrawer] = useState(false);
  const [preSelectedPeople, setPreSelectedPeople] = useState<Set<string>>(new Set());

  const currentOverlaps = activeBriefId ? (OVERLAPS_MAP[activeBriefId] || []) : [];
  const currentSwarmLines = activeBriefId ? (SWARM_LINES_MAP[activeBriefId] || SWARM_LINES_MAP["brief-001"]) : [];

  const handleReadBriefing = (id: string) => {
    setSearchParams({ view: "swarm-thinking", brief: id });
  };

  const handleSwarmComplete = useCallback(() => {
    const brief = searchParams.get("brief");
    if (brief) {
      setSearchParams({ view: "silo-check", brief });
    }
  }, [searchParams, setSearchParams]);

  const handleSkipToDoc = useCallback(() => {
    const brief = searchParams.get("brief");
    if (brief) {
      setSearchParams({ view: "briefing-doc", brief });
    }
  }, [searchParams, setSearchParams]);

  const handleReviewOverlaps = () => {
    setShowOverlapDrawer(true);
  };

  const handleOverlapProceed = () => {
    setShowOverlapDrawer(false);
    const brief = searchParams.get("brief");
    if (brief) {
      setSearchParams({ view: "briefing-doc", brief });
    }
  };

  const handleTogglePerson = (id: string) => {
    setPreSelectedPeople((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBack = () => {
    setSearchParams({});
    setPreSelectedPeople(new Set());
  };

  const handleTabChange = (tab: "briefings" | "oqr" | "archive") => {
    if (tab === "briefings") {
      setSearchParams({});
      setPreSelectedPeople(new Set());
      return;
    }

    if (tab === "archive") {
      setSearchParams({ tab: "archive" });
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
          <ArchiveView key="archive" />
        )}
      </AnimatePresence>

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
