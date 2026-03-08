import { motion } from "framer-motion";
import { Users, MessageSquare, Calendar, ShieldCheck } from "lucide-react";
import type { ChangeReadinessData } from "@/lib/changeReadinessData";

interface Props {
  data: ChangeReadinessData;
}

const STANCE_STYLES: Record<string, string> = {
  champion: "bg-[hsl(var(--status-positive-bg))] text-[hsl(var(--status-positive))]",
  supporter: "bg-[hsl(var(--status-info-bg))] text-[hsl(var(--status-info))]",
  neutral: "bg-[hsl(var(--status-neutral-bg))] text-[hsl(var(--status-neutral))]",
  resistant: "bg-[hsl(var(--status-danger-bg))] text-[hsl(var(--status-danger))]",
};

const RISK_STYLES: Record<string, string> = {
  low: "text-[hsl(var(--status-positive))]",
  medium: "text-[hsl(var(--status-warning))]",
  high: "text-[hsl(var(--status-danger))]",
};

const EVENT_ICON: Record<string, typeof MessageSquare> = {
  announcement: MessageSquare,
  training: ShieldCheck,
  feedback: Users,
  review: Calendar,
};

const ChangeReadiness = ({ data }: Props) => {
  return (
    <div>
      {/* Score + summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Readiness score</p>
          <p className="text-2xl font-sans tabular-nums text-foreground">{data.overallScore}/100</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Adoption risk</p>
          <p className={`text-lg font-sans uppercase ${RISK_STYLES[data.adoptionRisk]}`}>{data.adoptionRisk}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Teams affected</p>
          <p className="text-2xl font-sans tabular-nums text-foreground">{data.teamsAffected}</p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Historical pattern</p>
          <p className="text-xs text-foreground/70 leading-relaxed">{data.historicalPattern}</p>
        </div>
      </div>

      {/* Stakeholder map */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-3">Stakeholder mapping</p>
        <div className="border border-border overflow-hidden">
          <div className="grid grid-cols-4 border-b border-border">
            <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Name</div>
            <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border">Role</div>
            <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border">Stance</div>
            <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border">Influence</div>
          </div>
          {data.stakeholders.map((s, i) => (
            <div key={i} className={`grid grid-cols-4 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="p-3 text-xs text-foreground font-medium">{s.name}</div>
              <div className="p-3 text-xs text-muted-foreground border-l border-border">{s.role}</div>
              <div className="p-3 border-l border-border">
                <span className={`text-[10px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm ${STANCE_STYLES[s.stance]}`}>
                  {s.stance}
                </span>
              </div>
              <div className="p-3 text-xs text-foreground/70 border-l border-border capitalize">{s.influence}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Communication plan */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-3">Communication plan</p>
        <div className="space-y-0">
          {data.communicationPlan.map((event, i) => {
            const Icon = EVENT_ICON[event.type] || MessageSquare;
            return (
              <div
                key={i}
                className={`flex items-start gap-4 py-3 ${i > 0 ? "border-t border-border" : ""}`}
              >
                <div className="w-12 flex-shrink-0 text-right">
                  <span className="text-xs text-muted-foreground tabular-nums font-sans">W{event.week}</span>
                </div>
                <Icon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] uppercase tracking-[0.12em] px-1.5 py-0.5 border border-border text-muted-foreground">
                      {event.type}
                    </span>
                    <span className="text-[10px] text-muted-foreground">→ {event.audience}</span>
                  </div>
                  <p className="text-xs text-foreground/80">{event.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChangeReadiness;
