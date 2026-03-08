import { useState, useCallback, useEffect } from "react";
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
  "brief-002": [], // No overlaps for the data intelligence brief
};

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") === "archive" ? "archive" : "briefings";

  const [view, setView] = useState<View>(tabFromUrl === "archive" ? "archive" : "briefings");
  const [activeBriefId, setActiveBriefId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"briefings" | "oqr" | "archive">(tabFromUrl);
  const [showOverlapDrawer, setShowOverlapDrawer] = useState(false);
  const [preSelectedPeople, setPreSelectedPeople] = useState<Set<string>>(new Set());

  useEffect(() => {
    const currentTab = searchParams.get("tab");

    if (currentTab === "archive") {
      setActiveTab("archive");
      setView("archive");
      return;
    }

    if (activeTab === "archive") {
      setActiveTab("briefings");
      setView("briefings");
      setActiveBriefId(null);
      setPreSelectedPeople(new Set());
    }
  }, [searchParams, activeTab]);

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
      setSearchParams({ tab: "briefings" });
      handleBack();
      return;
    }

    if (tab === "archive") {
      setSearchParams({ tab: "archive" });
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
          <ArchiveView key="archive" />
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

