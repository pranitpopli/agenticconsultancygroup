import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut, Settings, Users, ChevronDown, Globe } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/contexts/AuthContext";

interface BriefingNavProps {
  activeTab: "briefings" | "oqr" | "people" | "settings" | "portfolio" | "insights";
  onTabChange?: (tab: "briefings" | "oqr") => void;
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "sv", label: "Svenska" },
] as const;

const BriefingNav = ({ activeTab, onTabChange }: BriefingNavProps) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [langOpen, setLangOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const tabs = [
    { id: "oqr" as const, label: "Overview" },
    { id: "briefings" as const, label: "Briefings" },
    { id: "portfolio" as const, label: "Portfolio" },
    { id: "insights" as const, label: "Insights" },
  ];

  const handleClick = (tab: typeof tabs[number]) => {
    if (tab.id === "briefings") {
      navigate("/");
      onTabChange?.(tab.id);
      return;
    }
    if (tab.id === "oqr") {
      navigate("/oqr");
      return;
    }
    if (tab.id === "portfolio") {
      navigate("/portfolio");
      return;
    }
    if (tab.id === "insights") {
      navigate("/insights");
      return;
    }
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
            className={`relative text-xs tracking-[0.15em] uppercase transition-colors pb-0.5 ${
              activeTab === "people"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            People
            {activeTab === "people" && (
              <motion.span
                layoutId="nav-underline"
                className="absolute left-0 right-0 -bottom-[21px] h-[1px] bg-foreground"
                transition={{ duration: 0.3 }}
              />
            )}
          </button>

          {/* User menu — contains theme, language, settings, logout */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="User menu"
                aria-expanded={menuOpen}
              >
                <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                  {user.initials}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${menuOpen ? "rotate-180" : ""}`} strokeWidth={1.5} />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => { setMenuOpen(false); setLangOpen(false); }} />
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-card border border-border shadow-lg z-50"
                    role="menu"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-xs font-medium text-foreground">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>

                    {/* Theme toggle */}
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      role="menuitem"
                    >
                      <span className="flex items-center gap-2">
                        {theme === "light" ? (
                          <Moon className="w-3.5 h-3.5" strokeWidth={1.5} />
                        ) : (
                          <Sun className="w-3.5 h-3.5" strokeWidth={1.5} />
                        )}
                        {theme === "light" ? "Dark mode" : "Light mode"}
                      </span>
                    </button>

                    {/* Language selector */}
                    <div className="relative">
                      <button
                        onClick={() => setLangOpen(!langOpen)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        role="menuitem"
                      >
                        <span className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5" strokeWidth={1.5} />
                          Language
                        </span>
                        <span className="text-[11px] text-muted-foreground">{currentLang.label}</span>
                      </button>

                      {langOpen && (
                        <div className="border-t border-border bg-muted/30">
                          {LANGUAGES.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setLanguage(lang.code);
                                setLangOpen(false);
                              }}
                              className={`w-full text-left px-8 py-2 text-xs transition-colors ${
                                language === lang.code
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                              }`}
                            >
                              {lang.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-border" />
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/settings"); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      role="menuitem"
                    >
                      <Settings className="w-3.5 h-3.5" strokeWidth={1.5} />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border-t border-border"
                      role="menuitem"
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
