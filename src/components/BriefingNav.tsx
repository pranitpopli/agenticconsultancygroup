import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface BriefingNavProps {
  activeTab: "briefings" | "oqr" | "archive";
  onTabChange?: (tab: "briefings" | "oqr" | "archive") => void;
}

const BriefingNav = ({ activeTab, onTabChange }: BriefingNavProps) => {
  const navigate = useNavigate();

  const tabs = [
    { id: "briefings" as const, label: "Briefings", route: "/" },
    { id: "oqr" as const, label: "OQR", route: "/oqr" },
    { id: "archive" as const, label: "Archive", route: "/" },
  ];

  const handleClick = (tab: typeof tabs[number]) => {
    if (tab.route) {
      navigate(tab.route);
    }
    onTabChange?.(tab.id);
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background"
      aria-label="Main navigation"
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-8 py-5">
        <button onClick={() => navigate("/")} className="font-serif text-xl tracking-wide text-foreground">
          ACG
        </button>
        <div className="flex items-center gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleClick(tab)}
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
