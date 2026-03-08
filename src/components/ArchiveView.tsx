import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Users, Building2, TrendingDown, ChevronDown, ChevronRight, Clock, Calendar } from "lucide-react";
import { BRIEFING_DOCUMENTS } from "@/lib/briefingData";
import type { BriefingDocument } from "@/lib/briefingData";

interface ArchivedBrief {
  id: string;
  title: string;
  completedDate: string;
  submittedBy: { name: string; role: string };
  outcome: "deployed" | "partially-deployed" | "shelved";
  outcomeNote: string;
  doc: BriefingDocument;
}

const ARCHIVED_BRIEFS: ArchivedBrief[] = [
  {
    id: "arch-001",
    title: "Cloud Migration Programme",
    completedDate: "12 January 2025",
    submittedBy: { name: "David Kim", role: "CTO" },
    outcome: "deployed",
    outcomeNote: "Fully deployed to production. Infrastructure costs reduced by 34% within first quarter. Team retained for ongoing optimisation.",
    doc: {
      ...BRIEFING_DOCUMENTS["brief-001"],
      id: "arch-001",
      title: "Cloud Migration Programme",
      initiative: [
        "Migration of 47 on-premise services to cloud infrastructure. Included containerisation, CI/CD pipeline redesign, and zero-downtime cutover strategy across three data centres.",
      ],
      internalCost: 142000,
      externalCost: 390000,
      saving: 248000,
      costNarrative: "Internal team delivered 36% under budget. External quote from two consultancies averaged £390k for comparable scope.",
      phases: [
        { number: 1, title: "Assessment & Containerisation", weeks: "Weeks 1–4", description: "Service audit, dependency mapping, and Docker containerisation of 47 services." },
        { number: 2, title: "Pipeline & Migration", weeks: "Weeks 4–10", description: "CI/CD redesign, staged migration with canary deployments." },
        { number: 3, title: "Cutover & Validation", weeks: "Weeks 10–12", description: "Zero-downtime cutover, performance validation, cost monitoring." },
      ],
    },
  },
  {
    id: "arch-002",
    title: "Internal Knowledge Graph",
    completedDate: "28 November 2024",
    submittedBy: { name: "Elena Vasquez", role: "VP Knowledge Management" },
    outcome: "partially-deployed",
    outcomeNote: "Core graph deployed and indexed 12,000 documents. Recommendation engine deferred to Q2 2025 due to model accuracy thresholds not being met.",
    doc: {
      ...BRIEFING_DOCUMENTS["brief-002"],
      id: "arch-002",
      title: "Internal Knowledge Graph",
      initiative: [
        "Organisation-wide knowledge graph connecting documentation, Slack conversations, and project artefacts. Goal was to reduce time-to-find from an average of 23 minutes to under 2 minutes.",
      ],
      internalCost: 98000,
      externalCost: 310000,
      saving: 212000,
      costNarrative: "Significant savings from internal assembly. The partially-deployed system still delivers 60% of projected value.",
      phases: [
        { number: 1, title: "Data Ingestion", weeks: "Weeks 1–6", description: "Connected 14 data sources including Confluence, Slack, and GitHub." },
        { number: 2, title: "Graph Construction", weeks: "Weeks 5–12", description: "Entity extraction, relationship mapping, and search index." },
        { number: 3, title: "Recommendation Engine", weeks: "Weeks 12–18", description: "ML-powered recommendations — deferred after accuracy review." },
      ],
    },
  },
  {
    id: "arch-003",
    title: "Automated Compliance Reporting",
    completedDate: "15 September 2024",
    submittedBy: { name: "Marcus Obi", role: "Head of Compliance" },
    outcome: "shelved",
    outcomeNote: "Shelved after regulatory framework changed in Q4 2024. Core data pipeline repurposed for the Customer Data Intelligence Layer (active brief).",
    doc: {
      ...BRIEFING_DOCUMENTS["brief-001"],
      id: "arch-003",
      title: "Automated Compliance Reporting",
      initiative: [
        "Automated generation of quarterly compliance reports by connecting transaction monitoring, audit logs, and regulatory requirement databases. Aimed to reduce manual reporting effort from 3 weeks to 2 days.",
      ],
      internalCost: 76000,
      externalCost: 220000,
      saving: 144000,
      costNarrative: "Despite being shelved, the data pipeline work was repurposed — estimated £40k of effort carried forward to the active Customer Data Intelligence brief.",
      phases: [
        { number: 1, title: "Requirements & Data Mapping", weeks: "Weeks 1–3", description: "Regulatory requirement taxonomy and data source mapping." },
        { number: 2, title: "Pipeline & Templates", weeks: "Weeks 3–8", description: "Automated data pipeline and report template engine." },
        { number: 3, title: "Validation & Audit", weeks: "Weeks 8–10", description: "Parallel run with manual process for validation. Shelved during this phase." },
      ],
    },
  },
];

const outcomeStyles = {
  deployed: { label: "Deployed", className: "text-[hsl(var(--status-positive))] border-[hsl(var(--status-positive)/0.3)]" },
  "partially-deployed": { label: "Partial", className: "text-[hsl(var(--status-warning))] border-[hsl(var(--status-warning)/0.3)]" },
  shelved: { label: "Shelved", className: "text-muted-foreground border-border" },
};

const ArchiveView = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalSaved = ARCHIVED_BRIEFS.reduce((sum, b) => sum + b.doc.saving, 0);
  const deployedCount = ARCHIVED_BRIEFS.filter(b => b.outcome === "deployed").length;

  return (
    <motion.main
      key="archive"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-[780px] mx-auto px-8 pt-28 pb-24"
      aria-label="Archive view"
    >
      <div className="mb-10">
        <h1 className="font-serif text-3xl text-foreground mb-2">Archive</h1>
        <p className="text-sm text-muted-foreground">
          Previously completed briefings and their outcomes.
        </p>
      </div>

      {/* Summary strip */}
      <div className="border-t border-b border-border py-5 mb-10">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="font-serif text-2xl text-foreground">{ARCHIVED_BRIEFS.length}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Briefs completed</p>
          </div>
          <div>
            <p className="font-serif text-2xl text-foreground">£{(totalSaved / 1000).toFixed(0)}k</p>
            <p className="text-[11px] text-muted-foreground mt-1">Total cost avoided</p>
          </div>
          <div>
            <p className="font-serif text-2xl text-foreground">
              {deployedCount}
              <span className="text-base text-muted-foreground font-sans ml-1">
                / {ARCHIVED_BRIEFS.length}
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Successfully deployed</p>
          </div>
        </div>
      </div>

      {/* Brief cards */}
      <div className="space-y-4">
        {ARCHIVED_BRIEFS.map((brief) => {
          const isExpanded = expandedId === brief.id;
          const style = outcomeStyles[brief.outcome];
          const doc = brief.doc;

          return (
            <motion.div
              key={brief.id}
              layout
              className="border border-border hover:border-foreground/20 transition-colors"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : brief.id)}
                className="w-full p-6 text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" strokeWidth={1.5} />
                      <h3 className="font-serif text-lg text-foreground">{brief.title}</h3>
                      <span className={`text-[9px] uppercase tracking-[0.12em] px-2 py-0.5 border ${style.className}`}>
                        {style.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pl-7">
                      <span>{brief.submittedBy.name}</span>
                      <span>·</span>
                      <span>{brief.submittedBy.role}</span>
                      <span>·</span>
                      <Calendar className="w-3 h-3" strokeWidth={1.5} />
                      <span>{brief.completedDate}</span>
                    </div>
                    <div className="flex items-center gap-5 pl-7 pt-1">
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Users className="w-3 h-3" strokeWidth={1.5} />
                        {doc.team.length} assembled
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Building2 className="w-3 h-3" strokeWidth={1.5} />
                        {doc.system.departments.length} depts
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <TrendingDown className="w-3 h-3" strokeWidth={1.5} />
                        £{(doc.saving / 1000).toFixed(0)}k saved
                      </span>
                    </div>
                  </div>
                  <div className="mt-1">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded detail */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-6 border-t border-border pt-6">
                      {/* Outcome */}
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Outcome</span>
                        <p className="text-sm text-foreground/80 leading-[1.8] mt-2">{brief.outcomeNote}</p>
                      </div>

                      {/* Initiative */}
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Initiative</span>
                        {doc.initiative.map((p, i) => (
                          <p key={i} className="text-sm text-foreground/70 leading-[1.8] mt-2">{p}</p>
                        ))}
                      </div>

                      {/* Financial */}
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Internal</p>
                          <p className="text-xl text-foreground font-sans">£{doc.internalCost.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">External</p>
                          <p className="text-xl text-muted-foreground font-sans">£{doc.externalCost.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Saving</p>
                          <p className="text-xl text-foreground font-sans">£{doc.saving.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Team */}
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Team assembled</span>
                        <div className="mt-3 space-y-2">
                          {doc.team.map((member) => (
                            <div key={member.employee.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                              <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[9px] text-muted-foreground font-medium">
                                  {member.employee.avatarInitials}
                                </span>
                                <div>
                                  <span className="text-sm text-foreground">{member.employee.name}</span>
                                  <span className="text-xs text-muted-foreground ml-2">{member.employee.role}</span>
                                </div>
                              </div>
                              <span className="text-[10px] text-muted-foreground">{member.employee.department}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Phases */}
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Delivery phases</span>
                        <div className="mt-3 space-y-3">
                          {doc.phases.map((phase) => (
                            <div key={phase.number} className="flex gap-3">
                              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground w-24 shrink-0 pt-0.5">
                                <Clock className="w-3 h-3" strokeWidth={1.5} />
                                {phase.weeks}
                              </div>
                              <div>
                                <p className="text-sm text-foreground">{phase.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{phase.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground/50 italic text-center font-serif mt-14">
        Archive reflects all briefs processed through ACG since September 2024.
      </p>
    </motion.div>
  );
};

export default ArchiveView;