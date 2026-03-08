import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import BriefingNav from "@/components/BriefingNav";
import OrgHealth from "@/components/org/OrgHealth";
import OrgPortfolio from "@/components/org/OrgPortfolio";
import OrgInsights from "@/components/org/OrgInsights";

type OrgTab = "health" | "portfolio" | "insights";

const TABS: { id: OrgTab; label: string }[] = [
  { id: "health", label: "Health" },
  { id: "portfolio", label: "Portfolio" },
  { id: "insights", label: "Insights" },
];

const Organisation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as OrgTab | null;
  const [activeTab, setActiveTab] = useState<OrgTab>(
    tabParam && TABS.some((t) => t.id === tabParam) ? tabParam : "health"
  );

  useEffect(() => {
    if (tabParam && TABS.some((t) => t.id === tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: OrgTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="min-h-screen bg-background">
      <BriefingNav />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight mb-3">
            Organisation
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[600px]">
            Health metrics, portfolio oversight, and cross-organisational insights in one view.
          </p>
          <div className="w-12 h-px bg-foreground/20 mt-4" />
        </motion.div>

        {/* Tab bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-1 border-b border-border mb-10"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative text-xs tracking-[0.15em] uppercase px-4 py-3 transition-colors ${
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.span
                  layoutId="org-tab-underline"
                  className="absolute left-0 right-0 -bottom-px h-[1px] bg-foreground"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Tab content */}
        {activeTab === "health" && <OrgHealth />}
        {activeTab === "portfolio" && <OrgPortfolio />}
        {activeTab === "insights" && <OrgInsights />}
      </div>
    </div>
  );
};

export default Organisation;
