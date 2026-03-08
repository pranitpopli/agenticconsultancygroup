import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, TrendingUp, Zap, BarChart3 } from "lucide-react";
import { OQR_DATA } from "@/lib/oqrData";

interface BriefingOQRPanelProps {
  open: boolean;
  onToggle: () => void;
}

const BriefingOQRPanel = ({ open, onToggle }: BriefingOQRPanelProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["financial", "projects", "shift"])
  );
  const oqr = OQR_DATA;
  const liveProjects = oqr.aiProjects.filter(p => p.status === "live").length;
  const inBuild = oqr.aiProjects.filter(p => p.status === "in-build").length;

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (!open) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-20 bg-background border border-r-0 border-border px-2 py-6 hover:bg-muted transition-colors"
        style={{ writingMode: "vertical-rl" }}
      >
        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Overview</span>
      </button>
    );
  }

  return (
    <motion.aside
      initial={{ x: 360 }}
      animate={{ x: 0 }}
      exit={{ x: 360 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="fixed right-0 top-0 bottom-0 w-[340px] z-20 bg-background border-l border-border overflow-y-auto pt-20 pb-8"
    >
      <div className="px-5">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-serif">
            Org Quarterly Review
          </span>
          <button
            onClick={onToggle}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Collapse ›
          </button>
        </div>

        {/* Financial Impact */}
        <SectionHeader
          icon={TrendingUp}
          title="Financial Impact"
          id="financial"
          expanded={expandedSections.has("financial")}
          onToggle={() => toggleSection("financial")}
        />
        <AnimatePresence>
          {expandedSections.has("financial") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pb-5 space-y-3">
                <p className="font-serif text-3xl text-foreground">
                  £{(oqr.totalSavings / 1000).toFixed(0)}k
                  <span className="text-sm text-[hsl(var(--status-positive))] ml-2 font-sans">↑</span>
                </p>
                <div className="space-y-2">
                  {oqr.financialBreakdown.map(item => {
                    const pct = Math.round((item.amount / oqr.totalSavings) * 100);
                    return (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-28 shrink-0">{item.label}</span>
                        <div className="flex-1 h-[2px] bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-foreground/20 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-foreground font-mono w-10 text-right">£{(item.amount / 1000).toFixed(0)}k</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground/70 italic font-serif">{oqr.cfoSummary}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-px bg-border my-1" />

        {/* AI Projects */}
        <SectionHeader
          icon={Zap}
          title="AI Projects in Flight"
          id="projects"
          expanded={expandedSections.has("projects")}
          onToggle={() => toggleSection("projects")}
        />
        <AnimatePresence>
          {expandedSections.has("projects") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pb-5 space-y-3">
                <p className="text-xs text-foreground">
                  {liveProjects} active across {oqr.activeDepartmentCount} departments
                  <span className="text-muted-foreground ml-1">· {inBuild} in build</span>
                </p>
                <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                  {oqr.aiProjects.filter(p => p.status === "live").slice(0, 6).map(proj => (
                    <div key={proj.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                      <div>
                        <span className="text-[11px] text-foreground">{proj.name}</span>
                        <span className="text-[9px] text-muted-foreground ml-2">{proj.department}</span>
                      </div>
                      <span className="text-[8px] uppercase text-[hsl(var(--status-positive))]">{proj.capability}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-px bg-border my-1" />

        {/* Org Shift Index */}
        <SectionHeader
          icon={BarChart3}
          title="Org Shift Index"
          id="shift"
          expanded={expandedSections.has("shift")}
          onToggle={() => toggleSection("shift")}
        />
        <AnimatePresence>
          {expandedSections.has("shift") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pb-5 space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl text-foreground">{oqr.orgMaturity}%</span>
                  <span className="text-[10px] text-[hsl(var(--status-positive))]">+{oqr.maturityDelta} pts</span>
                </div>
                <div className="space-y-1.5">
                  {[...oqr.departments].sort((a, b) => b.score - a.score).slice(0, 6).map(dept => (
                    <div key={dept.name} className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-20 shrink-0">{dept.name}</span>
                      <div className="flex-1 h-[2px] bg-border rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${dept.stage === "ai-augmented" ? "bg-foreground/25" : "bg-foreground/10"}`}
                          style={{ width: `${dept.score}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-muted-foreground/60 w-16 text-right capitalize">{dept.stage.replace("-", " ")}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground/70">
                  {oqr.departmentsCrossed} departments crossed into AI-Augmented this quarter.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

function SectionHeader({
  icon: Icon,
  title,
  id,
  expanded,
  onToggle,
}: {
  icon: React.ComponentType<any>;
  title: string;
  id: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-2 py-3 hover:text-foreground transition-colors"
    >
      {expanded ? (
        <ChevronDown className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
      ) : (
        <ChevronRight className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
      )}
      <Icon className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
      <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{title}</span>
    </button>
  );
}

export default BriefingOQRPanel;
