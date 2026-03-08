import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, LogOut } from "lucide-react";
import { Settings as SettingsIcon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/" },
  { label: "Briefings", path: "/briefings" },
  { label: "Organisation", path: "/organisation" },
  { label: "People", path: "/people" },
  { label: "Settings", path: "/settings" },
];

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background md:hidden"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => navigate("/")} className="font-serif text-xl tracking-wide text-foreground">
            ACG
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="w-8 h-8 flex items-center justify-center text-foreground"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/10 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-64 bg-background border-l border-border md:hidden flex flex-col"
              role="dialog"
              aria-label="Navigation menu"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <span className="font-serif text-lg text-foreground">ACG</span>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="Close menu">
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              {user && (
                <div className="px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                      {user.initials}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-foreground">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-1 py-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
                  return (
                    <button
                      key={item.path}
                      onClick={() => go(item.path)}
                      className={`w-full text-left px-5 py-3 text-xs uppercase tracking-[0.15em] transition-colors ${
                        isActive ? "text-foreground bg-muted/50 font-medium" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-border py-2">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-5 py-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {theme === "light" ? <Moon className="w-4 h-4" strokeWidth={1.5} /> : <Sun className="w-4 h-4" strokeWidth={1.5} />}
                  {theme === "light" ? "Dark mode" : "Light mode"}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.5} />
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
