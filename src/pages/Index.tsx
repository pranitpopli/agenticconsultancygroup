import { useState, useCallback, useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import BriefingNav from "@/components/BriefingNav";
import OverviewDashboard from "@/components/OverviewDashboard";
import BriefingDocumentView from "@/components/BriefingDocument";
import SwarmThinking from "@/components/SwarmThinking";
import SiloCheck from "@/components/SiloCheck";
import OverlapDrawer from "@/components/OverlapDrawer";
import { BRIEFING_DOCUMENTS, BRIEFING_SUMMARIES, ARCHIVE_DOCUMENTS, ARCHIVED_BRIEFS, createBriefDocument } from "@/lib/briefingData";
import { OVERLAPPING_PROJECTS } from "@/lib/simulatedData";
import { BRIEF_AGENTS, DEFAULT_BRIEF_AGENTS } from "@/lib/swarmSimulator";
import type { OverlappingProject } from "@/lib/types";
import type { BriefingSummary, BriefingDocument } from "@/lib/briefingData";

type View = "briefings" | "swarm-thinking" | "silo-check" | "briefing-doc";

const OVERLAPS_MAP: Record<string, OverlappingProject[]> = {
  "brief-001": OVERLAPPING_PROJECTS,
  "brief-002": [],
};

// Convert archived briefs into BriefingSummary items
const ARCHIVED_SUMMARIES: BriefingSummary[] = ARCHIVED_BRIEFS.map((ab) => ({
  id: ab.id,
  title: ab.title,
  submittedBy: ab.submittedBy,
  dateReceived: ab.completedDate,
  aiSummary: ab.outcomeNote,
  status: "completed" as const,
  outcome: ab.outcome,
}));

function deriveState(searchParams: URLSearchParams): { view: View; briefId: string | null; activeTab: "briefings" | "oqr"; readOnly: boolean } {
  const v = searchParams.get("view") as View | null;
  const briefId = searchParams.get("brief");
  const readOnly = searchParams.get("readonly") === "true";

  if (v && briefId && ["swarm-thinking", "silo-check", "briefing-doc"].includes(v)) {
    return { view: v as View, briefId, activeTab: "briefings", readOnly };
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

  // Merged data lookups — active briefs first, then archived
  const allBriefs = useMemo(() => [...BRIEFING_SUMMARIES, ...dynamicBriefs, ...ARCHIVED_SUMMARIES], [dynamicBriefs]);
  const allDocs = useMemo(() => ({ ...BRIEFING_DOCUMENTS, ...ARCHIVE_DOCUMENTS, ...dynamicDocs }), [dynamicDocs]);

  const currentOverlaps = activeBriefId ? (OVERLAPS_MAP[activeBriefId] || []) : [];
  const currentAgents = activeBriefId ? (BRIEF_AGENTS[activeBriefId] || DEFAULT_BRIEF_AGENTS) : DEFAULT_BRIEF_AGENTS;

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
    };
    document.title = titles[view] || "ACG";
  }, [view, activeBriefId, allDocs]);

  const handleReadBriefing = (id: string) => {
    // Completed briefs go straight to the document (read-only)
    const brief = allBriefs.find((b) => b.id === id);
    if (brief?.status === "completed") {
      setSearchParams({ view: "briefing-doc", brief: id, readonly: "true" });
      return;
    }
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

  const handleTabChange = (tab: "briefings" | "oqr") => {
    if (tab === "briefings") {
      setSearchParams({});
      setPreSelectedPeople(new Set());
    }
  };

  const activeDoc = activeBriefId ? allDocs[activeBriefId] : null;

  return (
    <div className="min-h-screen bg-background">
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
            agents={currentAgents}
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
