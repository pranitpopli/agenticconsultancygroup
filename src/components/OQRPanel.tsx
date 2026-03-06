import { useState, useEffect, useRef } from "react";
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
  swarmCompleted?: boolean;
  newSavings?: number;
}

const OQRPanel = ({ isOpen, onToggle, swarmCompleted, newSavings }: OQRPanelProps) => {
  const [data, setData] = useState<OQRData>(OQR_DATA);
  const [flashFinancial, setFlashFinancial] = useState(false);
  const [flashProjects, setFlashProjects] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    financial: true,
    projects: false,
    shift: false,
  });
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [showBoardExport, setShowBoardExport] = useState(false);
  const [projectView, setProjectView] = useState<"now" | "timeline">("now");

  // Flash animation on swarm complete
  useEffect(() => {
    if (swarmCompleted) {
      setFlashFinancial(true);
      setFlashProjects(true);
      if (newSavings) {
        setData(prev => ({
          ...prev,
          totalSavings: prev.totalSavings + newSavings,
          aiProjects: [
            ...prev.aiProjects,
            {
              id: `aip-new-${Date.now()}`,
              name: "Latest Swarm Assembly",
              department: "Cross-functional",
              capability: "Swarm Assembly",
              status: "live" as const,
              startDate: new Date().toISOString().slice(0, 7),
            },
          ],
        }));
      }
      setTimeout(() => {
        setFlashFinancial(false);
        setFlashProjects(false);
      }, 2000);
    }
  }, [swarmCompleted, newSavings]);

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const liveProjectCount = data.aiProjects.filter(p => p.status === "live").length;
  const uniqueDepts = new Set(data.aiProjects.map(p => p.department)).size;

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-background border border-r-0 border-border px-2 py-6 rounded-l-sm hover:bg-muted transition-colors"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-serif">
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
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed right-0 top-0 bottom-0 z-40 w-[380px] bg-background border-l border-border overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-5 py-4 z-10">
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
          {/* Section 1: Financial Impact */}
          <SectionHeader
            title="Financial Impact"
            icon={<TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />}
            expanded={expandedSections.financial}
            onToggle={() => toggleSection("financial")}
            flash={flashFinancial}
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
                  {/* Big number */}
                  <div
                    className="relative"
                    onMouseEnter={() => setHoveredMetric("total")}
                    onMouseLeave={() => setHoveredMetric(null)}
                  >
                    <div className="flex items-baseline gap-2">
                      <motion.span
                        key={data.totalSavings}
                        initial={flashFinancial ? { scale: 1.05 } : false}
                        animate={{ scale: 1 }}
                        className="font-serif text-3xl text-foreground"
                      >
                        £{data.totalSavings.toLocaleString()}
                      </motion.span>
                      <TrendingUp className="w-4 h-4 text-green-600" strokeWidth={1.5} />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Total AI-driven savings this quarter
                    </p>
                    {hoveredMetric === "total" && (
                      <Tooltip text="Aggregate savings from all AI-augmented projects this quarter, including recruitment avoidance, duplication prevention, and accelerated assembly." />
                    )}
                  </div>

                  {/* Breakdown bars */}
                  <div className="space-y-2">
                    {data.financialBreakdown.map((item) => {
                      const pct = (item.amount / data.totalSavings) * 100;
                      return (
                        <div
                          key={item.label}
                          className="relative"
                          onMouseEnter={() => setHoveredMetric(item.label)}
                          onMouseLeave={() => setHoveredMetric(null)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-muted-foreground">{item.label}</span>
                            <span className="text-[10px] text-foreground">£{item.amount.toLocaleString()}</span>
                          </div>
                          <div className="h-1 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, delay: 0.1 }}
                              className="h-full bg-foreground/30 rounded-full"
                            />
                          </div>
                          {hoveredMetric === item.label && (
                            <Tooltip text={`£${item.amount.toLocaleString()} saved through ${item.label.toLowerCase()} across ${data.currentQuarter}.`} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* QoQ comparison */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                      Quarter-on-quarter
                    </span>
                    <div className="flex items-end gap-3 h-16">
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <div className="w-full bg-muted rounded-sm overflow-hidden relative" style={{ height: `${(data.previousQuarterSavings / data.totalSavings) * 100}%`, minHeight: 8 }}>
                          <div className="absolute inset-0 bg-foreground/15" />
                        </div>
                        <span className="text-[9px] text-muted-foreground">{data.previousQuarter}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <div className="w-full bg-foreground/25 rounded-sm" style={{ height: "100%", minHeight: 8 }} />
                        <span className="text-[9px] text-foreground">{data.currentQuarter}</span>
                      </div>
                    </div>
                  </div>

                  {/* CFO summary */}
                  <p className="text-xs text-foreground/70 font-light leading-relaxed border-l-2 border-border pl-3 italic font-serif">
                    {data.cfoSummary}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section 2: AI Projects in Flight */}
          <SectionHeader
            title="AI Projects in Flight"
            icon={<Zap className="w-3.5 h-3.5" strokeWidth={1.5} />}
            expanded={expandedSections.projects}
            onToggle={() => toggleSection("projects")}
            flash={flashProjects}
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
                  <p className="text-xs text-foreground/80">
                    <span className="font-serif text-base text-foreground">{data.aiProjects.length}</span>
                    {" "}AI-augmented projects active across{" "}
                    <span className="text-foreground">{uniqueDepts} departments</span>
                  </p>

                  {/* View toggle */}
                  <div className="flex gap-0 border border-border rounded-sm overflow-hidden w-fit">
                    <button
                      onClick={() => setProjectView("now")}
                      className={`text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 transition-colors ${
                        projectView === "now" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >Now</button>
                    <button
                      onClick={() => setProjectView("timeline")}
                      className={`text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 transition-colors ${
                        projectView === "timeline" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
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

          {/* Section 3: Org Shift Index */}
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
                  {/* Maturity gauge */}
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

                  {/* Department breakdown */}
                  <div className="space-y-2.5">
                    {data.departments.map((dept) => (
                      <div key={dept.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-foreground/80">{dept.name}</span>
                          <span className={`text-[8px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm border ${
                            dept.stage === "ai-led"
                              ? "text-foreground border-foreground/20 bg-foreground/5"
                              : dept.stage === "ai-augmented"
                              ? "text-green-700 border-green-600/20 bg-green-50"
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
                            className="h-full rounded-full"
                            style={{
                              background: dept.score > 60
                                ? "hsl(var(--foreground) / 0.35)"
                                : "hsl(var(--foreground) / 0.15)",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delta line */}
                  <p className="text-xs text-foreground/70 font-light leading-relaxed border-l-2 border-border pl-3 italic font-serif">
                    +{data.maturityDelta} points this quarter — {data.departmentsCrossed} departments crossed into AI-Augmented territory
                  </p>

                  {/* Flow diagram */}
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
            <button className="w-full flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground border border-border px-4 py-2.5 rounded-sm hover:border-foreground/20 hover:text-foreground transition-colors">
              <FileDown className="w-3.5 h-3.5" strokeWidth={1.5} />
              Export PDF
            </button>
            <button
              onClick={() => setShowBoardExport(true)}
              className="w-full flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.15em] text-foreground border border-foreground/30 px-4 py-2.5 rounded-sm hover:bg-foreground hover:text-background transition-colors"
            >
              <Presentation className="w-3.5 h-3.5" strokeWidth={1.5} />
              Export Board Deck ↗
            </button>
          </div>
        </div>
      </motion.div>

      {/* Board Deck Export Modal */}
      <AnimatePresence>
        {showBoardExport && (
          <BoardDeckExport onClose={() => setShowBoardExport(false)} data={data} />
        )}
      </AnimatePresence>
    </>
  );
};

// ── Sub-components ─────────────────────────────────────────

function SectionHeader({
  title, icon, expanded, onToggle, flash,
}: {
  title: string; icon: React.ReactNode; expanded: boolean;
  onToggle: () => void; flash?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-2 py-3 transition-colors ${
        flash ? "bg-warm-accent/5" : ""
      }`}
    >
      {icon}
      <span className="text-[11px] uppercase tracking-[0.15em] text-foreground flex-1 text-left font-serif">
        {title}
      </span>
      {flash && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-1.5 h-1.5 rounded-full bg-warm-accent"
        />
      )}
      <motion.div animate={{ rotate: expanded ? 0 : -90 }} transition={{ duration: 0.15 }}>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
      </motion.div>
    </button>
  );
}

function ProjectCard({ project }: { project: AIProject }) {
  const statusStyles = {
    live: "text-green-700 border-green-600/20 bg-green-50",
    "in-build": "text-warm-accent border-warm-accent/20 bg-accent",
    completed: "text-muted-foreground border-border bg-muted",
  };

  return (
    <div className="border border-border/60 p-3 rounded-sm space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs text-foreground">{project.name}</span>
        <span className={`text-[8px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm border whitespace-nowrap ${statusStyles[project.status]}`}>
          {project.status === "in-build" ? "In Build" : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <span>{project.department}</span>
        <span className="opacity-40">·</span>
        <span className="italic font-serif">{project.capability}</span>
      </div>
    </div>
  );
}

function TimelineView({ projects }: { projects: AIProject[] }) {
  const sorted = [...projects].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const byDate = sorted.reduce<Record<string, AIProject[]>>((acc, p) => {
    const key = p.startDate;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-3 max-h-[300px] overflow-y-auto">
      {Object.entries(byDate).map(([date, ps]) => (
        <div key={date} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-foreground/30 mt-1" />
            <div className="flex-1 w-px bg-border" />
          </div>
          <div className="flex-1 pb-3">
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
              {new Date(date + "-01").toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
            </span>
            <div className="space-y-1 mt-1">
              {ps.map(p => (
                <div key={p.id} className="text-[10px] text-foreground/80">
                  {p.name} <span className="text-muted-foreground">· {p.department}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Tooltip({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute left-0 right-0 top-full mt-1 z-20 bg-foreground text-background text-[10px] leading-relaxed px-3 py-2 rounded-sm shadow-lg"
    >
      {text}
    </motion.div>
  );
}

export default OQRPanel;
