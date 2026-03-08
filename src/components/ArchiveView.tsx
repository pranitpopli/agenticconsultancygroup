import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Users, Building2, TrendingDown, ChevronDown, ChevronRight, Clock, Calendar, ArrowRight, Search } from "lucide-react";
import { ARCHIVED_BRIEFS } from "@/lib/briefingData";

interface ArchiveViewProps {
  onViewBrief?: (id: string) => void;
}

const outcomeStyles = {
  deployed: { label: "Deployed", className: "text-[hsl(var(--status-positive))] border-[hsl(var(--status-positive)/0.3)]" },
  "partially-deployed": { label: "Partial", className: "text-[hsl(var(--status-warning))] border-[hsl(var(--status-warning)/0.3)]" },
  shelved: { label: "Shelved", className: "text-muted-foreground border-border" },
};

const ArchiveView = ({ onViewBrief }: ArchiveViewProps) => {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = ARCHIVED_BRIEFS.filter((b) =>
    !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.submittedBy.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalSaved = filtered.reduce((sum, b) => sum + b.doc.saving, 0);
  const deployedCount = filtered.filter(b => b.outcome === "deployed").length;

  return (
    <motion.main
      key="archive"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-[780px] mx-auto px-4 sm:px-8 pt-28 pb-24"
      aria-label="Archive view"
    >
      <div className="mb-10">
        <h1 className="font-serif text-3xl text-foreground mb-2">Archive</h1>
        <p className="text-sm text-muted-foreground">
          Previously completed briefings and their outcomes.
        </p>
      </div>

      {/* Summary strip */}
      <div className="border border-border p-6 sm:p-8 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <p className="text-2xl font-sans tabular-nums text-foreground">{ARCHIVED_BRIEFS.length}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Briefs completed</p>
          </div>
          <div>
            <p className="text-2xl font-sans tabular-nums text-foreground">£{(totalSaved / 1000).toFixed(0)}k</p>
            <p className="text-[11px] text-muted-foreground mt-1">Total cost avoided</p>
          </div>
          <div>
            <p className="text-2xl font-sans tabular-nums text-foreground">
              {deployedCount}
              <span className="text-base text-muted-foreground ml-1">
                / {ARCHIVED_BRIEFS.length}
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Successfully deployed</p>
          </div>
        </div>
      </div>

      {/* Brief cards */}
      <div className="space-y-4">
        {ARCHIVED_BRIEFS.length === 0 && (
          <div className="border border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">No archived briefs yet. Completed briefings will appear here.</p>
          </div>
        )}
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
                 aria-expanded={isExpanded}
                 aria-controls={`archive-detail-${brief.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" strokeWidth={1.5} />
                      <h3 className="font-serif text-lg text-foreground">{brief.title}</h3>
                      <span className={`text-[9px] uppercase tracking-[0.12em] px-2 py-0.5 border ${style.className}`}>
                        {style.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pl-7 flex-wrap">
                      <span>{brief.submittedBy.name}</span>
                      <span>·</span>
                      <span>{brief.submittedBy.role}</span>
                      <span>·</span>
                      <Calendar className="w-3 h-3" strokeWidth={1.5} />
                      <span>{brief.completedDate}</span>
                    </div>
                    <div className="flex items-center gap-5 pl-7 pt-1 flex-wrap">
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
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Internal</p>
                          <p className="text-xl text-foreground font-sans tabular-nums">£{doc.internalCost.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">External</p>
                          <p className="text-xl text-muted-foreground font-sans tabular-nums">£{doc.externalCost.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Saving</p>
                          <p className="text-xl text-foreground font-sans tabular-nums">£{doc.saving.toLocaleString()}</p>
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
                              <span className="text-[10px] text-muted-foreground hidden sm:block">{member.employee.department}</span>
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

                      {/* View full briefing button */}
                      {onViewBrief && (
                        <button
                          onClick={() => onViewBrief(brief.id)}
                          className="flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-foreground border border-foreground px-5 py-2.5 hover:bg-foreground hover:text-primary-foreground transition-colors"
                        >
                          View full briefing
                          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                      )}
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
    </motion.main>
  );
};

export default ArchiveView;
