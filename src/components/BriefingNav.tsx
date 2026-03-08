import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut, Settings, Users, ChevronDown } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/contexts/AuthContext";

interface BriefingNavProps {
  activeTab: "briefings" | "oqr" | "archive";
  onTabChange?: (tab: "briefings" | "oqr" | "archive") => void;
}

const BriefingNav = ({ activeTab, onTabChange }: BriefingNavProps) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { id: "oqr" as const, label: "Overview" },
    { id: "briefings" as const, label: "Briefings" },
    { id: "archive" as const, label: "Archive" },
  ];

  const handleClick = (tab: typeof tabs[number]) => {
    if (tab.id === "oqr") {
      navigate("/oqr");
      return;
    }
    onTabChange?.(tab.id);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
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
        <div className="flex items-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleClick(tab)}
              className={`relative text-xs tracking-[0.15em] uppercase transition-colors pb-0.5 ${
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-0 right-0 -bottom-[21px] h-[1px] bg-foreground"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}

          <button
            onClick={() => navigate("/people")}
            className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            People
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <Sun className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>

          {/* User menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                  {user.initials}
                </span>
                <ChevronDown className="w-3 h-3" strokeWidth={1.5} />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-card border border-border shadow-lg z-50"
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-xs font-medium text-foreground">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/people"); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                      People
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/settings"); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" strokeWidth={1.5} />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border-t border-border"
                    >
                      <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
                      Sign out
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default BriefingNav;
