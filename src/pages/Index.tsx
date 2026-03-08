import { useState, useCallback, useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import BriefingNav from "@/components/BriefingNav";
import OverviewDashboard from "@/components/OverviewDashboard";
import BriefingDocumentView from "@/components/BriefingDocument";
import SwarmThinking from "@/components/SwarmThinking";
import SiloCheck from "@/components/SiloCheck";
import OverlapDrawer from "@/components/OverlapDrawer";
import ArchiveView from "@/components/ArchiveView";
import { BRIEFING_DOCUMENTS, BRIEFING_SUMMARIES, ARCHIVE_DOCUMENTS, createBriefDocument } from "@/lib/briefingData";
import { OVERLAPPING_PROJECTS } from "@/lib/simulatedData";
import type { OverlappingProject } from "@/lib/types";
import type { BriefingSummary, BriefingDocument } from "@/lib/briefingData";

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

const DEFAULT_SWARM_LINES = [
  "parsing brief...",
  "identifying domain from brief content...",
  "scanning 847 employee nodes...",
  "cross-referencing project archive...",
  "checking active workstreams...",
  "0 overlapping projects detected",
  "3 candidate profiles matched across 2 departments",
  "assembling org structure...",
  "generating value model...",
  "projected saving: £264,000 vs external hire",
];

const OVERLAPS_MAP: Record<string, OverlappingProject[]> = {
  "brief-001": OVERLAPPING_PROJECTS,
  "brief-002": [],
};

function deriveState(searchParams: URLSearchParams): { view: View; briefId: string | null; activeTab: "briefings" | "oqr" | "archive"; readOnly: boolean } {
  const tab = searchParams.get("tab");
  const v = searchParams.get("view") as View | null;
  const briefId = searchParams.get("brief");
  const readOnly = searchParams.get("readonly") === "true";

  if (tab === "archive") {
    return { view: "archive", briefId: null, activeTab: "archive", readOnly: false };
  }

  if (v && briefId && ["swarm-thinking", "silo-check", "briefing-doc"].includes(v)) {
    return { view: v as View, briefId, activeTab: readOnly ? "archive" : "briefings", readOnly };
  }

  return { view: "briefings", briefId: null, activeTab: "briefings", readOnly: false };
}

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { view, briefId: activeBriefId, activeTab, readOnly } = useMemo(() => deriveState(searchParams), [searchParams]);

  const [showOverlapDrawer, setShowOverlapDrawer] = useState(false);
  const [preSelectedPeople, setPreSelectedPeople] = useState<Set<string>>(new Set());

  // Dynamic briefs created by user submission
  const [dynamicBriefs, setDynamicBriefs] = useState<BriefingSummary[]>([]);
  const [dynamicDocs, setDynamicDocs] = useState<Record<string, BriefingDocument>>({});

  // Merged data lookups
  const allBriefs = useMemo(() => [...BRIEFING_SUMMARIES, ...dynamicBriefs], [dynamicBriefs]);
  const allDocs = useMemo(() => ({ ...BRIEFING_DOCUMENTS, ...ARCHIVE_DOCUMENTS, ...dynamicDocs }), [dynamicDocs]);

  const currentOverlaps = activeBriefId ? (OVERLAPS_MAP[activeBriefId] || []) : [];
  const currentSwarmLines = activeBriefId ? (SWARM_LINES_MAP[activeBriefId] || DEFAULT_SWARM_LINES) : [];

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Dynamic page title
  useEffect(() => {
    const activeDoc = activeBriefId ? allDocs[activeBriefId] : null;
    const titles: Record<View, string> = {
      briefings: "ACG — Briefings",
      "swarm-thinking": activeDoc ? `ACG — Analysing ${activeDoc.title}` : "ACG — Analysing",
      "silo-check": "ACG — Silo Check",
      "briefing-doc": activeDoc ? `ACG — ${activeDoc.title}` : "ACG — Briefing",
      archive: "ACG — Archive",
    };
    document.title = titles[view] || "ACG";
  }, [view, activeBriefId, allDocs]);

  const handleReadBriefing = (id: string) => {
    setSearchParams({ view: "swarm-thinking", brief: id });
  };

  const handleSubmitBrief = useCallback((text: string) => {
    const id = `brief-custom-${Date.now()}`;
    const { summary, doc } = createBriefDocument(id, text);
    setDynamicBriefs((prev) => [...prev, summary]);
    setDynamicDocs((prev) => ({ ...prev, [id]: doc }));
    setSearchParams({ view: "swarm-thinking", brief: id });
  }, [setSearchParams]);

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

  const handleViewArchivedBrief = useCallback((id: string) => {
    setSearchParams({ view: "briefing-doc", brief: id, readonly: "true" });
  }, [setSearchParams]);

  const activeDoc = activeBriefId ? allDocs[activeBriefId] : null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF8F4" }}>
      <BriefingNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <AnimatePresence mode="wait">
        {view === "briefings" && (
          <OverviewDashboard
            key="briefings"
            briefs={allBriefs}
            onReadBriefing={handleReadBriefing}
            onSubmitBrief={handleSubmitBrief}
          />
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
            readOnly={readOnly}
          />
        )}

        {view === "archive" && (
          <ArchiveView key="archive" onViewBrief={handleViewArchivedBrief} />
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
