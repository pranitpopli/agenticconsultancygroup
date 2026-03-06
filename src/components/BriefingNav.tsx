import { motion } from "framer-motion";

interface BriefingNavProps {
  activeTab: "briefings" | "oqr" | "archive";
  onTabChange: (tab: "briefings" | "oqr" | "archive") => void;
  onOQRToggle?: () => void;
}

const BriefingNav = ({ activeTab, onTabChange }: BriefingNavProps) => {
  const tabs = [
    { id: "briefings" as const, label: "Briefings" },
    { id: "oqr" as const, label: "OQR" },
    { id: "archive" as const, label: "Archive" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border"
      style={{ backgroundColor: "#FAF8F4" }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-8 py-5">
        <span className="font-serif text-xl tracking-wide text-foreground">
          ACG
        </span>
        <div className="flex items-center gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`text-xs tracking-[0.15em] uppercase transition-colors ${
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default BriefingNav;
