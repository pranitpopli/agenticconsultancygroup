import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Shield } from "lucide-react";
import type { BriefingDocument } from "@/lib/briefingData";
import { useBriefingStore } from "@/lib/briefingStore";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Props {
  doc: BriefingDocument;
  readOnly?: boolean;
}

const StickyDecisionBar = ({ doc, readOnly = false }: Props) => {
  const [visible, setVisible] = useState(false);
  const decision = useBriefingStore((s) => s.getDecision(doc.id));
  const setDecision = useBriefingStore((s) => s.setDecision);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const execEl = document.getElementById("executive-summary");
    if (!execEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when executive summary is NOT in view
        setVisible(!entry.isIntersecting);
      },
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
    );

    observer.observe(execEl);
    return () => observer.disconnect();
  }, []);

  if (readOnly || decision) return null;

  const handleDecision = (type: "approved" | "deferred") => {
    setDecision(doc.id, doc.title, type, user?.name ?? "Unknown");
    toast({
      title: type === "approved" ? "Briefing approved" : "Briefing deferred",
      description: type === "approved"
        ? "This briefing has been marked as approved. The team can proceed."
        : "This briefing has been deferred for further review.",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed top-[61px] left-0 right-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm print:hidden"
        >
          <div className="max-w-[780px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs text-foreground font-medium truncate">{doc.title}</span>
              <span className="text-[10px] text-muted-foreground hidden sm:inline">
                £{doc.internalCost.toLocaleString()} · {doc.phases.length} phases
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleDecision("approved")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] bg-foreground text-primary-foreground hover:bg-foreground/90 transition-colors"
              >
                <CheckCircle2 className="h-3 w-3" />
                Approve
              </button>
              <button
                onClick={() => handleDecision("deferred")}
                className="px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] border border-border text-muted-foreground hover:bg-secondary transition-colors"
              >
                Defer
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyDecisionBar;
