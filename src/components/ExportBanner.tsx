import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileDown, Presentation, ArrowRight, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BriefingDocument } from "@/lib/briefingData";
import { OQR_DATA } from "@/lib/oqrData";

interface ExportBannerProps {
  doc: BriefingDocument;
}

const SLIDES = [
  { num: 1, title: "Executive Summary", preview: "exec" },
  { num: 2, title: "The Organisational Shift", preview: "shift" },
  { num: 3, title: "AI Projects in Flight", preview: "projects" },
  { num: 4, title: "Talent Intelligence", preview: "talent" },
  { num: 5, title: "Financial Model", preview: "financial" },
  { num: 6, title: "What AI Made Possible", preview: "comparison" },
  { num: 7, title: "Recommended Next Steps", preview: "next" },
];

const ExportBanner = ({ doc }: ExportBannerProps) => {
  const [showDeck, setShowDeck] = useState(false);
  const [activeSlide, setActiveSlide] = useState(5);
  const { toast } = useToast();

  const handleExportAction = (label: string) => {
    toast({ title: `${label}`, description: "This feature will be available in the next release." });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-16 space-y-6"
    >
      {/* Banner */}
      <div className="border border-foreground p-8">
        <h3 className="font-serif text-xl text-foreground mb-2">
          Your briefing is ready to present.
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Download the feasibility brief or generate a board-ready presentation from this analysis.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-foreground border border-foreground px-5 py-2.5 hover:bg-foreground hover:text-primary-foreground transition-colors">
            <FileDown className="w-3.5 h-3.5" strokeWidth={1.5} />
            Download Feasibility Brief (PDF)
          </button>
          <button
            onClick={() => setShowDeck(true)}
            className="flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-foreground border border-foreground px-5 py-2.5 hover:bg-foreground hover:text-primary-foreground transition-colors"
          >
            <Presentation className="w-3.5 h-3.5" strokeWidth={1.5} />
            Create Board Presentation (PPT)
            <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
          </button>
          <button className="flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-foreground border border-foreground px-5 py-2.5 hover:bg-foreground hover:text-primary-foreground transition-colors">
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            Push to Jira
          </button>
        </div>
      </div>

      {/* Slide Deck Preview */}
      <AnimatePresence>
        {showDeck && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border border-border overflow-hidden"
          >
            <div className="flex">
              {/* Thumbnail sidebar */}
              <div className="w-48 bg-foreground border-r border-foreground/80 p-3 space-y-2 flex-shrink-0">
                {SLIDES.map((slide) => (
                  <button
                    key={slide.num}
                    onClick={() => setActiveSlide(slide.num - 1)}
                    className={`w-full text-left p-2 transition-colors ${
                      activeSlide === slide.num - 1
                        ? "bg-foreground/80 ring-1 ring-amber"
                        : "hover:bg-foreground/60"
                    }`}
                  >
                    <div className="aspect-[16/9] bg-primary-foreground/10 mb-1.5 flex items-center justify-center">
                      <span className="text-[8px] text-primary-foreground/60">{slide.num}</span>
                    </div>
                    <p className="text-[9px] text-primary-foreground/70 leading-snug truncate">
                      {slide.title}
                    </p>
                  </button>
                ))}
              </div>

              {/* Main slide view */}
              <div className="flex-1 p-8" style={{ backgroundColor: "#FAF8F4" }}>
                <div className="aspect-[16/9] border border-border p-10 flex flex-col justify-between" style={{ backgroundColor: "#FAF8F4" }}>
                  <SlideContent slide={SLIDES[activeSlide]} doc={doc} />
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <span className="text-[8px] text-muted-foreground">Acme Corporation</span>
                    <span className="text-[8px] text-muted-foreground">March 2025</span>
                    <span className="text-[8px] text-muted-foreground font-serif italic">Generated by ACG</span>
                  </div>
                </div>

                {/* Download buttons */}
                <div className="flex items-center justify-end gap-3 mt-4">
                  <button className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground border border-border px-4 py-2 hover:text-foreground hover:border-foreground/30 transition-colors">
                    Download .pptx
                  </button>
                  <button className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground border border-border px-4 py-2 hover:text-foreground hover:border-foreground/30 transition-colors">
                    Download .pdf
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

function SlideContent({ slide, doc }: { slide: typeof SLIDES[0]; doc: BriefingDocument }) {
  const oqr = OQR_DATA;

  if (slide.preview === "exec") {
    return (
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="font-serif text-2xl text-foreground mb-6">Executive Summary</h3>
        <p className="text-sm text-foreground/80 leading-[1.8] mb-4">
          AI-augmented resourcing delivered £{doc.saving.toLocaleString()} in projected savings for the {doc.title}
          — a team assembled in 38 seconds that would have taken 4–6 weeks through traditional channels.
        </p>
        <div className="space-y-2 mt-4">
          <p className="text-xs text-muted-foreground">• {doc.team.length}-person cross-functional team identified across {doc.system.departments.length} departments</p>
          <p className="text-xs text-muted-foreground">• {doc.phases.length} delivery phases spanning {doc.phases[doc.phases.length - 1].weeks.split("–")[1]}</p>
          <p className="text-xs text-muted-foreground">• Internal cost £{doc.internalCost.toLocaleString()} vs external £{doc.externalCost.toLocaleString()}</p>
        </div>
      </div>
    );
  }

  if (slide.preview === "shift") {
    const augmented = oqr.departments.filter(d => d.stage === "ai-augmented").length;
    const traditional = oqr.departments.filter(d => d.stage === "traditional").length;
    return (
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="font-serif text-2xl text-foreground mb-6">The Organisational Shift</h3>
        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-serif text-5xl text-foreground">{oqr.orgMaturity}%</span>
          <span className="text-sm text-muted-foreground">AI Maturity Index</span>
          <span className="text-sm text-[hsl(var(--status-positive))]">+{oqr.maturityDelta} pts this quarter</span>
        </div>
        <div className="space-y-2 mb-6">
          {oqr.departments.slice(0, 6).map(dept => (
            <div key={dept.name} className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground w-24 shrink-0">{dept.name}</span>
              <div className="flex-1 h-[3px] bg-border rounded-full overflow-hidden">
                <div className="h-full bg-foreground/25 rounded-full" style={{ width: `${dept.score}%` }} />
              </div>
              <span className="text-[9px] text-muted-foreground w-20 text-right capitalize">{dept.stage.replace("-", " ")}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-serif italic">
          {augmented} departments AI-augmented · {traditional} in transition · {oqr.departmentsCrossed} crossed threshold this quarter
        </p>
      </div>
    );
  }

  if (slide.preview === "projects") {
    const liveProjects = oqr.aiProjects.filter(p => p.status === "live");
    const depts = new Set(oqr.aiProjects.map(p => p.department));
    return (
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="font-serif text-2xl text-foreground mb-2">AI Projects in Flight</h3>
        <p className="text-xs text-muted-foreground mb-6">
          {depts.size} of 9 departments now running at least one AI-augmented workflow.
        </p>
        <div className="border border-border overflow-hidden">
          <div className="grid grid-cols-4 border-b border-border">
            <div className="p-2 text-[9px] uppercase tracking-[0.1em] text-muted-foreground">Project</div>
            <div className="p-2 text-[9px] uppercase tracking-[0.1em] text-muted-foreground border-l border-border">Department</div>
            <div className="p-2 text-[9px] uppercase tracking-[0.1em] text-muted-foreground border-l border-border">Capability</div>
            <div className="p-2 text-[9px] uppercase tracking-[0.1em] text-muted-foreground border-l border-border">Status</div>
          </div>
          {oqr.aiProjects.slice(0, 8).map((proj, i) => (
            <div key={proj.id} className={`grid grid-cols-4 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="p-2 text-[10px] text-foreground">{proj.name}</div>
              <div className="p-2 text-[10px] text-muted-foreground border-l border-border">{proj.department}</div>
              <div className="p-2 text-[10px] text-muted-foreground border-l border-border">{proj.capability}</div>
              <div className="p-2 text-[10px] border-l border-border">
                <span className={`capitalize ${proj.status === "live" ? "text-[hsl(var(--status-positive))]" : proj.status === "in-build" ? "text-[hsl(var(--status-warning))]" : "text-muted-foreground"}`}>
                  {proj.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slide.preview === "talent") {
    return (
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="font-serif text-2xl text-foreground mb-6">Talent Intelligence</h3>
        <p className="text-sm text-foreground/80 leading-[1.8] mb-6">
          The swarm assembled a {doc.team.length}-person team for "{doc.title}" in 38 seconds, bridging {doc.system.departments.length} departments
          that would not have been connected through traditional resourcing channels.
        </p>
        <div className="border border-border p-4 mb-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-3">Case: {doc.title}</p>
          <div className="space-y-2">
            {doc.team.slice(0, 4).map(m => (
              <div key={m.employee.id} className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-foreground">{m.employee.name}</span>
                  <span className="text-[10px] text-muted-foreground ml-2">{m.employee.department}</span>
                </div>
                <span className={`text-[9px] uppercase px-1.5 py-0.5 border ${
                  m.employee.availability === "available" ? "text-[hsl(var(--status-positive))] border-[hsl(var(--status-positive)/0.3)]" : "text-muted-foreground border-border"
                }`}>{m.employee.availability}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground font-serif italic">{doc.teamContext}</p>
      </div>
    );
  }

  if (slide.preview === "financial") {
    return (
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="font-serif text-2xl text-foreground mb-6">Financial Model</h3>
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1">Internal</p>
            <p className="font-serif text-3xl text-foreground">£{doc.internalCost.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1">External</p>
            <p className="font-serif text-3xl text-muted-foreground">£{doc.externalCost.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1">Saving</p>
            <p className="font-serif text-3xl text-foreground">£{doc.saving.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground font-serif italic">{doc.costNarrative}</p>
      </div>
    );
  }

  if (slide.preview === "comparison") {
    return (
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="font-serif text-2xl text-foreground mb-8">What AI Made Possible</h3>
        <div className="grid grid-cols-2 gap-0 border border-border">
          <div className="p-4 border-b border-r border-border">
            <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Without ACG</span>
          </div>
          <div className="p-4 border-b border-border">
            <span className="text-[10px] uppercase tracking-[0.12em] text-foreground">With ACG</span>
          </div>
          {[
            { label: "Team assembly time", without: "4–6 weeks", withAI: "38 seconds" },
            { label: "Org coverage", without: "Single department", withAI: `Cross-functional, ${doc.system.departments.length} departments` },
            { label: "Cost", without: `£${doc.externalCost.toLocaleString()}`, withAI: `£${doc.internalCost.toLocaleString()}` },
            { label: "Bias", without: "Manager's network only", withAI: "Skill-matched, org-wide" },
            { label: "Knowledge retained", without: "Walks out the door", withAI: "Stays in the organisation" },
            { label: "Time to board output", without: "2–3 weeks", withAI: "< 1 minute" },
          ].map((row, i) => (
            <div key={i} className="contents">
              <div className={`p-3 text-xs text-muted-foreground ${i > 0 ? "border-t" : ""} border-r border-border`}>
                <span className="text-[10px] text-muted-foreground/60 block mb-0.5">{row.label}</span>
                {row.without}
              </div>
              <div className={`p-3 text-xs text-foreground ${i > 0 ? "border-t border-border" : ""}`}>
                <span className="text-[10px] text-muted-foreground/60 block mb-0.5">{row.label}</span>
                {row.withAI}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slide.preview === "next") {
    const lagging = oqr.departments
      .filter(d => d.stage === "traditional")
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
    return (
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="font-serif text-2xl text-foreground mb-6">Recommended Next Steps</h3>
        <div className="space-y-5">
          <div className="border-l-2 border-foreground pl-4">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm text-foreground font-medium">Accelerate lagging departments</span>
              <span className="text-[9px] uppercase text-muted-foreground border border-border px-2 py-0.5">High impact · Low effort</span>
            </div>
            <p className="text-xs text-muted-foreground">{lagging.map(d => d.name).join(", ")} are below 45% maturity. Deploying swarm assembly in these teams would bring 3 more departments into AI-augmented territory.</p>
          </div>
          <div className="border-l-2 border-foreground/40 pl-4">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm text-foreground font-medium">Expand predictive matching coverage</span>
              <span className="text-[9px] uppercase text-muted-foreground border border-border px-2 py-0.5">High impact · Medium effort</span>
            </div>
            <p className="text-xs text-muted-foreground">Currently active in {oqr.aiProjects.filter(p => p.capability === "Predictive Matching").length} projects. Extending to procurement and HR would close the skills visibility gap across the full org.</p>
          </div>
          <div className="border-l-2 border-foreground/20 pl-4">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm text-foreground font-medium">Establish quarterly AI review cadence</span>
              <span className="text-[9px] uppercase text-muted-foreground border border-border px-2 py-0.5">Medium impact · Low effort</span>
            </div>
            <p className="text-xs text-muted-foreground">Formalise the OQR export as a standing board item. Current data shows a {Math.round(((oqr.totalSavings - oqr.previousQuarterSavings) / oqr.previousQuarterSavings) * 100)}% quarter-on-quarter savings improvement — this trajectory needs visibility at the highest level.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center">
      <h3 className="font-serif text-2xl text-foreground mb-4">{slide.title}</h3>
      <p className="text-xs text-muted-foreground">Content generated from your briefing analysis</p>
    </div>
  );
}

export default ExportBanner;
