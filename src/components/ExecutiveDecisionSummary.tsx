import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2, Clock, AlertTriangle, Shield } from "lucide-react";
import type { BriefingDocument } from "@/lib/briefingData";
import { useToast } from "@/hooks/use-toast";
import { useBriefingStore } from "@/lib/briefingStore";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  doc: BriefingDocument;
  readOnly?: boolean;
}

const ExecutiveDecisionSummary = ({ doc, readOnly = false }: Props) => {
  const [expanded, setExpanded] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const decision = useBriefingStore((s) => s.getDecision(doc.id));
  const setDecision = useBriefingStore((s) => s.setDecision);

  const recommendation = doc.recommendation ?? "proceed";
  const overallRisk = doc.risks?.length
    ? doc.risks.some((r) => r.likelihood === "high" && r.impact === "high")
      ? "High"
      : doc.risks.some((r) => r.likelihood === "high" || r.impact === "high")
        ? "Medium"
        : "Low"
    : "Low";

  const riskIndicator =
    overallRisk === "High" ? "text-destructive" :
    overallRisk === "Medium" ? "text-[hsl(var(--status-warning))]" :
    "text-[hsl(var(--status-positive))]";

  const timelinePhase = doc.phases[doc.phases.length - 1];
  const weeksMatch = timelinePhase?.weeks.match(/(\d+)/g);
  const totalWeeks = weeksMatch ? weeksMatch[weeksMatch.length - 1] : "—";

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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-14 border border-border bg-card"
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
            Executive Decision Summary
          </span>
          {decision && (
            <span className={`text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 border ml-2 ${
              decision === "approved"
                ? "text-[hsl(var(--status-positive))] border-[hsl(var(--status-positive)/0.3)] bg-[hsl(var(--status-positive-bg))]"
                : "text-muted-foreground border-border bg-muted"
            }`}>
              {decision === "approved" ? "Approved" : "Deferred"}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Collapsible content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border pt-5">
              {/* Recommendation badge */}
              <div className="mb-5">
                <span className={`text-xs uppercase tracking-[0.12em] px-2.5 py-1 border ${
                  recommendation === "proceed"
                    ? "border-[hsl(var(--green))] text-[hsl(var(--green))] bg-[hsl(var(--green-light))]"
                    : recommendation === "proceed-with-conditions"
                      ? "border-[hsl(var(--amber))] text-[hsl(var(--amber))] bg-[hsl(var(--amber-light))]"
                      : "border-border text-muted-foreground"
                }`}>
                  {recommendation === "proceed"
                    ? "Recommendation: Proceed"
                    : recommendation === "proceed-with-conditions"
                      ? "Recommendation: Proceed with conditions"
                      : "Recommendation: Defer"}
                </span>
              </div>

              {/* Key numbers grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Internal cost</p>
                  <p className="text-lg text-foreground font-sans tabular-nums">£{doc.internalCost.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Projected saving</p>
                  <p className="text-lg text-foreground font-sans tabular-nums">£{doc.saving.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Timeline</p>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-lg text-foreground font-sans tabular-nums">{totalWeeks} weeks</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Risk level</p>
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className={`h-3.5 w-3.5 ${riskIndicator}`} />
                    <p className={`text-lg font-sans ${riskIndicator}`}>{overallRisk}</p>
                  </div>
                </div>
              </div>

              {/* Decision actions */}
              {!readOnly && !decision && (
                <div className="flex gap-3 pt-2 border-t border-border">
                  <button
                    onClick={() => handleDecision("approved")}
                    className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.1em] bg-foreground text-primary-foreground hover:bg-foreground/90 transition-colors"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision("deferred")}
                    className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.1em] border border-border text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    Defer for review
                  </button>
                </div>
              )}

              {/* Decision made state */}
              {decision && (
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className={`text-xs uppercase tracking-[0.12em] px-2.5 py-1 ${
                    decision === "approved"
                      ? "text-[hsl(var(--status-positive))] bg-[hsl(var(--status-positive-bg))]"
                      : "text-muted-foreground bg-secondary"
                  }`}>
                    {decision === "approved" ? "✓ Approved" : "⏸ Deferred"}
                  </span>
                  {!readOnly && (
                    <button
                      onClick={() => handleDecision(decision === "approved" ? "deferred" : "approved")}
                      className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                    >
                      Change to {decision === "approved" ? "defer" : "approve"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExecutiveDecisionSummary;
