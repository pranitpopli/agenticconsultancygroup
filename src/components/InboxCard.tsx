import { motion } from "framer-motion";
import { ArrowRight, Zap, Users, Building2, TrendingDown, CheckCircle2, Pause, Rocket, AlertTriangle, Archive } from "lucide-react";
import type { BriefingSummary } from "@/lib/briefingData";
import { BRIEFING_DOCUMENTS, ARCHIVE_DOCUMENTS } from "@/lib/briefingData";
import { useBriefingStore } from "@/lib/briefingStore";

interface InboxCardProps {
  brief: BriefingSummary;
  index: number;
  onRead: (id: string) => void;
}

const InboxCard = ({ brief, index, onRead }: InboxCardProps) => {
  const doc = BRIEFING_DOCUMENTS[brief.id] || ARCHIVE_DOCUMENTS[brief.id];
  const teamCount = doc?.team?.length ?? 0;
  const deptCount = doc?.system?.departments?.length ?? 0;
  const saving = doc?.saving ?? 0;
  const decision = useBriefingStore((s) => s.getDecision(brief.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
      className={`border p-8 hover:border-foreground/20 transition-colors group ${
        brief.status === "completed"
          ? "border-border bg-muted/20"
          : decision === "approved"
            ? "border-[hsl(var(--status-positive)/0.3)] bg-[hsl(var(--status-positive-bg))]"
            : decision === "deferred"
              ? "border-border bg-muted/30"
              : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 space-y-3">
           <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-serif text-xl text-foreground">{brief.title}</h3>
              {brief.status === "completed" && brief.outcome === "deployed" ? (
                <span className="text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 border border-[hsl(var(--status-positive)/0.3)] text-[hsl(var(--status-positive))] flex items-center gap-1">
                  <Rocket className="w-3 h-3" strokeWidth={1.5} />
                  Deployed
                </span>
              ) : brief.status === "completed" && brief.outcome === "partially-deployed" ? (
                <span className="text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 border border-[hsl(var(--status-warning)/0.3)] text-[hsl(var(--status-warning))] flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" strokeWidth={1.5} />
                  Partial
                </span>
              ) : brief.status === "completed" && brief.outcome === "shelved" ? (
                <span className="text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 border border-border text-muted-foreground flex items-center gap-1">
                  <Archive className="w-3 h-3" strokeWidth={1.5} />
                  Shelved
                </span>
              ) : decision === "approved" ? (
                <span className="text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 border border-[hsl(var(--status-positive)/0.3)] text-[hsl(var(--status-positive))] bg-[hsl(var(--status-positive-bg))] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" strokeWidth={1.5} />
                  Approved
                </span>
              ) : decision === "deferred" ? (
                <span className="text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 border border-border text-muted-foreground flex items-center gap-1">
                  <Pause className="w-3 h-3" strokeWidth={1.5} />
                  Deferred
                </span>
              ) : brief.status === "analysis-complete" ? (
                <span className="text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 border status-green">
                  Analysis complete
                </span>
              ) : (
                <motion.span
                  className="text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 border border-muted text-muted-foreground flex items-center gap-1.5"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-flex"
                  >
                    <Zap className="w-3 h-3" strokeWidth={2} />
                  </motion.span>
                  Finding your team
                </motion.span>
              )}
           </div>

          <div className="flex items-center gap-2 text-xs text-foreground/60">
            <span>{brief.submittedBy.name}</span>
            <span>·</span>
            <span>{brief.submittedBy.role}</span>
            <span>·</span>
            <span>{brief.dateReceived}</span>
          </div>

          <p className="text-sm text-foreground/70 leading-relaxed max-w-2xl">
            {brief.aiSummary}
          </p>

          {/* Subtle OQR metrics */}
          {doc && (
            <div className="flex items-center gap-5 pt-1">
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Users className="w-3 h-3" strokeWidth={1.5} />
                {teamCount} assembled
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Building2 className="w-3 h-3" strokeWidth={1.5} />
                {deptCount} dept{deptCount !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <TrendingDown className="w-3 h-3" strokeWidth={1.5} />
                £{(saving / 1000).toFixed(0)}k projected saving
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => onRead(brief.id)}
          disabled={brief.status === "swarm-searching"}
          className="flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-foreground border border-foreground px-5 py-2.5 hover:bg-foreground hover:text-primary-foreground transition-colors mt-1 whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-foreground"
        >
          {brief.status === "swarm-searching" ? "Analysing…" : decision ? "View briefing" : "Read briefing"}
          {brief.status !== "swarm-searching" && <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />}
        </button>
      </div>
    </motion.div>
  );
};

export default InboxCard;
