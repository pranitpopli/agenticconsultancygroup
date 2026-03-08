import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { useBriefingStore } from "@/lib/briefingStore";
import { formatDistanceToNow } from "date-fns";

const LAST_SEEN_KEY = "acg-notif-last-seen";

const NotificationCentre = () => {
  const [open, setOpen] = useState(false);
  const activity = useBriefingStore((s) => s.activity);

  const [lastSeen, setLastSeen] = useState<number>(() => {
    const stored = localStorage.getItem(LAST_SEEN_KEY);
    return stored ? parseInt(stored, 10) : 0;
  });

  const unreadCount = useMemo(
    () => activity.filter((a) => new Date(a.timestamp).getTime() > lastSeen).length,
    [activity, lastSeen]
  );

  const markRead = () => {
    const now = Date.now();
    setLastSeen(now);
    localStorage.setItem(LAST_SEEN_KEY, String(now));
  };

  useEffect(() => {
    if (open && unreadCount > 0) markRead();
  }, [open, unreadCount]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center w-7 h-7 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={open}
      >
        <Bell className="w-4 h-4" strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-foreground text-primary-foreground text-[8px] flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute right-0 top-full mt-2 w-72 bg-card border border-border shadow-lg z-50 max-h-80 overflow-y-auto"
              role="menu"
            >
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Activity</span>
                {activity.length > 0 && (
                  <button
                    onClick={markRead}
                    className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {activity.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-xs text-muted-foreground">No activity yet</p>
                </div>
              ) : (
                activity.slice(0, 10).map((entry) => {
                  const isNew = new Date(entry.timestamp).getTime() > lastSeen;
                  return (
                    <div
                      key={entry.id}
                      className={`px-4 py-3 border-b border-border last:border-0 ${isNew ? "bg-muted/30" : ""}`}
                    >
                      <p className="text-xs text-foreground">
                        <span className="font-medium">{entry.user}</span>{" "}
                        {entry.action.toLowerCase()}{" "}
                        <span className="font-medium">{entry.briefTitle}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  );
                })
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCentre;
