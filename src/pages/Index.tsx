import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import BriefingNav from "@/components/BriefingNav";
import OverviewDashboard from "@/components/OverviewDashboard";
import BriefingDocumentView from "@/components/BriefingDocument";
import { BRIEFING_DOCUMENTS } from "@/lib/briefingData";

const Index = () => {
  const [view, setView] = useState<"briefings" | "briefing-doc">("briefings");
  const [activeBriefId, setActiveBriefId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"briefings" | "archive">("briefings");

  const handleReadBriefing = (id: string) => {
    setActiveBriefId(id);
    setView("briefing-doc");
  };

  const handleBack = () => {
    setView("briefings");
    setActiveBriefId(null);
  };

  const handleTabChange = (tab: "briefings" | "archive") => {
    setActiveTab(tab);
    if (tab === "briefings") {
      setView("briefings");
      setActiveBriefId(null);
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

        {view === "briefing-doc" && activeDoc && (
          <BriefingDocumentView
            key={activeBriefId}
            doc={activeDoc}
            onBack={handleBack}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
