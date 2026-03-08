import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Bell, User, Shield } from "lucide-react";
import BriefingNav from "@/components/BriefingNav";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/use-theme";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState({
    briefUpdates: true,
    teamChanges: true,
    weeklyDigest: false,
  });

  const toggleNotif = (key: keyof typeof notifications) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <div className="min-h-screen bg-background">
      <BriefingNav
        activeTab="settings"
        onTabChange={(tab) => {
          if (tab === "briefings") navigate("/");
        }}
      />

      <motion.main
        className="max-w-[600px] mx-auto px-4 sm:px-8 pt-28 pb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="font-serif text-3xl text-foreground mb-1">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your profile and preferences.</p>
        </motion.div>

        {/* Profile */}
        <motion.div variants={itemVariants} className="border border-border p-6 mb-6 space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <User className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.2em]">Profile</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm text-muted-foreground font-medium">
              {user?.initials || "??"}
            </span>
            <div>
              <p className="text-sm text-foreground font-medium">{user?.name || "Guest"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "—"}</p>
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div variants={itemVariants} className="border border-border p-6 mb-6 space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            {theme === "light" ? <Sun className="w-4 h-4" strokeWidth={1.5} /> : <Moon className="w-4 h-4" strokeWidth={1.5} />}
            <span className="text-[10px] uppercase tracking-[0.2em]">Appearance</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Dark mode</p>
              <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                theme === "dark" ? "bg-accent" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background transition-transform ${
                  theme === "dark" ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={itemVariants} className="border border-border p-6 mb-6 space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Bell className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.2em]">Notifications</span>
          </div>
          {([
            { key: "briefUpdates" as const, label: "Brief updates", desc: "When a brief status changes or is commented on" },
            { key: "teamChanges" as const, label: "Team changes", desc: "When someone is added or removed from your team" },
            { key: "weeklyDigest" as const, label: "Weekly digest", desc: "Summary of all activity each Monday" },
          ]).map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <button
                onClick={() => toggleNotif(key)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  notifications[key] ? "bg-accent" : "bg-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background transition-transform ${
                    notifications[key] ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          ))}
        </motion.div>

        {/* Security */}
        <motion.div variants={itemVariants} className="border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Shield className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.2em]">Security</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Password management and two-factor authentication will be available when connected to a backend.
          </p>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Settings;
