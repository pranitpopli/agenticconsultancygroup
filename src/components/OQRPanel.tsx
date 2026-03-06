import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ChevronRight, TrendingUp, Zap, BarChart3,
  FileDown, Presentation, X,
} from "lucide-react";
import { OQR_DATA, type OQRData, type AIProject } from "@/lib/oqrData";
import OQRFlowDiagram from "./OQRFlowDiagram";
import BoardDeckExport from "./BoardDeckExport";

interface OQRPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const OQRPanel = ({ isOpen, onToggle }: OQRPanelProps) => {
  const [data] = useState<OQRData>(OQR_DATA);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    financial: true,
    projects: false,
    shift: false,
  });
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [showBoardExport, setShowBoardExport] = useState(false);
  const [projectView, setProjectView] = useState<"now" | "timeline">("now");

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const liveProjectCount = data.aiProjects.filter(p => p.status === "live").length;
  const uniqueDepts = new Set(data.aiProjects.map(p => p.department)).size;

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 border border-r-0 border-border px-2 py-6 rounded-l-sm hover:bg-muted transition-colors"
        style={{ backgroundColor: "#FAF8F4" }}
      >
        <span
          className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-serif"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Org Quarterly Review
        </span>
      </button>
    );
  }

  return (
    <>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed right-0 top-0 bottom-0 z-40 w-[360px] border-l border-border overflow-y-auto"
        style={{ backgroundColor: "#FAF8F4" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border px-5 py-4" style={{ backgroundColor: "#FAF8F4" }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-serif">
              Org Quarterly Review
            </span>
            <button onClick={onToggle} className="p-1 hover:bg-muted rounded-sm transition-colors">
              <X className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-1">
          {/* Financial Impact */}
          <SectionHeader
            title="Financial Impact"
            icon={<TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />}
            expanded={expandedSections.financial}
            onToggle={() => toggleSection("financial")}
          />
          <AnimatePresence>
            {expandedSections.financial && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pb-5 space-y-4">
                  <div
                    className="relative"
                    onMouseEnter={() => setHoveredMetric("total")}
                    onMouseLeave={() => setHoveredMetric(null)}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-3xl text-foreground">
                        £{data.totalSavings.toLocaleString()}
                      </span>
                      <TrendingUp className="w-4 h-4 text-foreground/40" strokeWidth={1.5} />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Total AI-driven savings this quarter
                    </p>
                    {hoveredMetric === "total" && (
                      <Tooltip text="Aggregate savings from all AI-augmented projects this quarter." />
                    )}
                  </div>

                  <div className="space-y-2">
                    {data.financialBreakdown.map((item) => {
                      const pct = (item.amount / data.totalSavings) * 100;
                      return (
                        <div key={item.label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-muted-foreground">{item.label}</span>
                            <span className="text-[10px] text-foreground">£{item.amount.toLocaleString()}</span>
                          </div>
                          <div className="h-1 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, delay: 0.1 }}
                              className="h-full bg-foreground/25 rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* QoQ */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                      Quarter-on-quarter
                    </span>
                    <div className="flex items-end gap-3 h-16">
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <div className="w-full bg-foreground/10 rounded-sm" style={{ height: `${(data.previousQuarterSavings / data.totalSavings) * 100}%`, minHeight: 8 }} />
                        <span className="text-[9px] text-muted-foreground">{data.previousQuarter}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <div className="w-full bg-foreground/25 rounded-sm" style={{ height: "100%", minHeight: 8 }} />
                        <span className="text-[9px] text-foreground">{data.currentQuarter}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed border-l border-border pl-3 font-serif italic">
                    {data.cfoSummary}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Projects */}
          <SectionHeader
            title="AI Projects in Flight"
            icon={<Zap className="w-3.5 h-3.5" strokeWidth={1.5} />}
            expanded={expandedSections.projects}
            onToggle={() => toggleSection("projects")}
          />
          <AnimatePresence>
            {expandedSections.projects && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pb-5 space-y-4">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-serif text-base text-foreground">{data.aiProjects.length}</span>
                    {" "}active across{" "}
                    <span className="text-foreground">{uniqueDepts} departments</span>
                  </p>

                  <div className="flex gap-0 border border-border overflow-hidden w-fit">
                    <button
                      onClick={() => setProjectView("now")}
                      className={`text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 transition-colors ${
                        projectView === "now" ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >Now</button>
                    <button
                      onClick={() => setProjectView("timeline")}
                      className={`text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 transition-colors ${
                        projectView === "timeline" ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >Over Time</button>
                  </div>

                  {projectView === "now" ? (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {data.aiProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  ) : (
                    <TimelineView projects={data.aiProjects} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Org Shift Index */}
          <SectionHeader
            title="Org Shift Index"
            icon={<BarChart3 className="w-3.5 h-3.5" strokeWidth={1.5} />}
            expanded={expandedSections.shift}
            onToggle={() => toggleSection("shift")}
          />
          <AnimatePresence>
            {expandedSections.shift && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pb-5 space-y-5">
                  {/* Maturity */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                        <motion.circle
                          cx="50" cy="50" r="42" fill="none"
                          stroke="hsl(var(--foreground))"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - data.orgMaturity / 100) }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-lg text-foreground">{data.orgMaturity}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-foreground">Org AI Maturity</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        +{data.maturityDelta} points this quarter
                      </p>
                    </div>
                  </div>

                  {/* Departments */}
                  <div className="space-y-2.5">
                    {data.departments.map((dept) => (
                      <div key={dept.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-foreground/80">{dept.name}</span>
                          <span className={`text-[8px] uppercase tracking-[0.1em] px-1.5 py-0.5 border ${
                            dept.stage === "ai-led"
                              ? "text-foreground border-foreground/20"
                              : dept.stage === "ai-augmented"
                              ? "status-green"
                              : "text-muted-foreground border-border bg-muted"
                          }`}>
                            {dept.stage.replace("-", " ")}
                          </span>
                        </div>
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${dept.score}%` }}
                            transition={{ duration: 0.6 }}
                            className="h-full rounded-full bg-foreground/20"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed border-l border-border pl-3 font-serif italic">
                    +{data.maturityDelta} points this quarter — {data.departmentsCrossed} departments crossed into AI-Augmented territory
                  </p>

                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                      AI-Orchestrated Workflow
                    </span>
                    <OQRFlowDiagram />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Export buttons */}
          <div className="border-t border-border pt-4 mt-2 space-y-2">
            <button className="w-full flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground border border-border px-4 py-2.5 hover:border-foreground/20 hover:text-foreground transition-colors">
              <FileDown className="w-3.5 h-3.5" strokeWidth={1.5} />
              Export PDF Summary
            </button>
            <button
              onClick={() => setShowBoardExport(true)}
              className="w-full flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.15em] text-foreground border border-foreground/30 px-4 py-2.5 hover:bg-foreground hover:text-primary-foreground transition-colors"
            >
              <Presentation className="w-3.5 h-3.5" strokeWidth={1.5} />
              Export Board Deck ↗
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showBoardExport && (
          <BoardDeckExport onClose={() => setShowBoardExport(false)} data={data} />
        )}
      </AnimatePresence>
    </>
  );
};

// Sub-components

function SectionHeader({
  title, icon, expanded, onToggle,
}: {
  title: string; icon: React.ReactNode; expanded: boolean; onToggle: () => void;
}) {
  return (
    <button onClick={onToggle} className="w-full flex items-center gap-2 py-3 transition-colors">
      {expanded ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
      {icon}
      <span className="text-[10px] uppercase tracking-[0.2em] text-foreground flex-1 text-left">{title}</span>
    </button>
  );
}

function Tooltip({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-full left-0 mt-2 z-50 border border-border p-3 text-[10px] text-muted-foreground max-w-xs leading-relaxed"
      style={{ backgroundColor: "#FAF8F4" }}
    >
      {text}
    </motion.div>
  );
}

function ProjectCard({ project }: { project: AIProject }) {
  return (
    <div className="border border-border p-3 space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs text-foreground">{project.name}</span>
        <span className={`text-[8px] uppercase tracking-[0.1em] px-1.5 py-0.5 border flex-shrink-0 ${
          project.status === "live" ? "status-green" :
          project.status === "in-build" ? "status-amber" :
          "text-muted-foreground border-border bg-muted"
        }`}>{project.status.replace("-", " ")}</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <span>{project.department}</span>
        <span>·</span>
        <span>{project.capability}</span>
      </div>
    </div>
  );
}

function TimelineView({ projects }: { projects: AIProject[] }) {
  const byYear: Record<string, AIProject[]> = {};
  projects.forEach(p => {
    const year = p.startDate.slice(0, 4);
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(p);
  });

  return (
    <div className="space-y-4">
      {Object.entries(byYear).sort().map(([year, ps]) => (
        <div key={year}>
          <span className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase">{year}</span>
          <div className="mt-2 space-y-1.5">
            {ps.map(p => (
              <div key={p.id} className="flex items-center gap-2 text-[10px]">
                <div className="w-1 h-1 rounded-full bg-foreground/30 flex-shrink-0" />
                <span className="text-foreground/80">{p.name}</span>
                <span className="text-muted-foreground">· {p.department}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OQRPanel;
