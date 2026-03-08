import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import BriefingNav from "@/components/BriefingNav";
import OverviewDashboard from "@/components/OverviewDashboard";
import BriefingDocumentView from "@/components/BriefingDocument";
import OQRPanel from "@/components/OQRPanel";
import { BRIEFING_DOCUMENTS } from "@/lib/briefingData";

const Index = () => {
  const [view, setView] = useState<"briefings" | "briefing-doc">("briefings");
  const [activeBriefId, setActiveBriefId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"briefings" | "oqr" | "archive">("briefings");
  const [oqrOpen, setOqrOpen] = useState(false);

  const handleReadBriefing = (id: string) => {
    setActiveBriefId(id);
    setView("briefing-doc");
  };

  const handleBack = () => {
    setView("briefings");
    setActiveBriefId(null);
  };

  const handleTabChange = (tab: "briefings" | "oqr" | "archive") => {
    setActiveTab(tab);
    if (tab === "briefings") {
      setView("briefings");
      setActiveBriefId(null);
    } else if (tab === "oqr") {
      setOqrOpen(true);
    }
  };

  const activeDoc = activeBriefId ? BRIEFING_DOCUMENTS[activeBriefId] : null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF8F4" }}>
      <BriefingNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOQRToggle={() => setOqrOpen(prev => !prev)}
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
            oqrOpen={oqrOpen}
            onOQRToggle={() => setOqrOpen(prev => !prev)}
          />
        )}
      </AnimatePresence>

      <OQRPanel
        isOpen={oqrOpen}
        onToggle={() => setOqrOpen(prev => !prev)}
      />
    </div>
  );
};

export default Index;
