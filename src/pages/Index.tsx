import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import BriefingNav from "@/components/BriefingNav";
import InboxView from "@/components/InboxView";
import BriefingDocumentView from "@/components/BriefingDocument";
import OQRPanel from "@/components/OQRPanel";
import { BRIEFING_DOCUMENTS } from "@/lib/briefingData";

type View = "inbox" | "briefing";

const Index = () => {
  const [view, setView] = useState<View>("inbox");
  const [activeBriefId, setActiveBriefId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"briefings" | "oqr" | "archive">("briefings");
  const [oqrOpen, setOqrOpen] = useState(false);

  const handleReadBriefing = (id: string) => {
    setActiveBriefId(id);
    setView("briefing");
  };

  const handleBack = () => {
    setView("inbox");
    setActiveBriefId(null);
  };

  const handleTabChange = (tab: "briefings" | "oqr" | "archive") => {
    setActiveTab(tab);
    if (tab === "oqr") {
      setOqrOpen(prev => !prev);
    } else if (tab === "briefings") {
      if (view === "briefing") return;
      setView("inbox");
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
        {view === "inbox" && (
          <InboxView key="inbox" onReadBriefing={handleReadBriefing} />
        )}

        {view === "briefing" && activeDoc && (
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
