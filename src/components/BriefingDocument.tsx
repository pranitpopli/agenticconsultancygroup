import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import type { BriefingDocument as BriefingDocType, TeamMember } from "@/lib/briefingData";
import ConversationLayer from "./ConversationLayer";
import ExportBanner from "./ExportBanner";
import FixedInputBar from "./FixedInputBar";
import InlineOQR from "./InlineOQR";
import BriefingIndex from "./BriefingIndex";

interface BriefingDocumentProps {
  doc: BriefingDocType;
  onBack: () => void;
  oqrOpen: boolean;
  onOQRToggle: () => void;
}

const TeamCard = ({ member, index }: {member: TeamMember;index: number;}) => {
  const e = member.employee;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="border border-border p-5 space-y-2">
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">{e.name}</p>
          <p className="text-xs text-muted-foreground">{e.role} · {e.department}</p>
        </div>
        <span className={`text-[9px] uppercase tracking-[0.12em] px-2 py-0.5 border ${
        e.availability === "available" ? "status-green" :
        e.availability === "partial" ? "status-amber" :
        "text-muted-foreground bg-muted border-border"}`
        }>
          {e.availability}
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed font-serif italic">
        Relevant: {member.justification}
      </p>
    </motion.div>);

};

const BriefingDocumentView = ({ doc, onBack, oqrOpen, onOQRToggle }: BriefingDocumentProps) => {
  const [expandedTeam, setExpandedTeam] = useState(true);
  const [conversationActive, setConversationActive] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(doc);
  const [showExport, setShowExport] = useState(false);
  const [pendingInput, setPendingInput] = useState<string | null>(null);

  const handleConversationUpdate = (updates: Partial<BriefingDocType>) => {
    setCurrentDoc((prev) => ({ ...prev, ...updates }));
  };

  const handleFinalize = () => {
    setShowExport(true);
  };

  return (
    <div className="transition-all duration-300">
      <div className="max-w-[780px] mx-auto px-8 pt-28 pb-28">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span className="tracking-[0.1em] uppercase">Back to briefings</span>
        </motion.button>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14">
          <h1 className="font-serif text-4xl text-foreground leading-tight mb-3">
            {currentDoc.title}
          </h1>
          <div className="w-12 h-px bg-foreground/20" />
        </motion.div>

        {/* Section 01 — Initiative */}
        <Section number="01" title="The Initiative" delay={0.1}>
          {currentDoc.initiative.map((para, i) =>
          <p key={i} className="text-sm text-foreground/80 leading-[1.8] mb-4 last:mb-0">
              {para}
            </p>
          )}
        </Section>

        {/* Section 02 — Cost & Business Value */}
        <Section number="02" title="Cost & Business Value" delay={0.2}>
          <div className="grid grid-cols-3 gap-8 mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Internal cost</p>
              <p className="text-2xl text-foreground font-sans">£{currentDoc.internalCost.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">External equivalent</p>
              <p className="text-2xl text-muted-foreground font-sans">£{currentDoc.externalCost.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Projected saving</p>
              <p className="text-2xl text-foreground font-sans">£{currentDoc.saving.toLocaleString()}</p>
            </div>
          </div>

          <p className="text-sm text-foreground/80 leading-[1.8] mb-6 font-serif italic">
            {currentDoc.costNarrative}
          </p>

          {/* Comparison table */}
          <div className="border border-border overflow-hidden">
            <div className="grid grid-cols-3 border-b border-border">
              <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground" />
              <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-foreground border-l border-border">Internal approach</div>
              <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border">External approach</div>
            </div>
            {currentDoc.comparison.map((row, i) =>
            <div key={i} className={`grid grid-cols-3 ${i > 0 ? "border-t border-border" : ""}`}>
                <div className="p-3 text-xs text-muted-foreground">{row.dimension}</div>
                <div className="p-3 text-xs text-foreground border-l border-border">{row.internal}</div>
                <div className="p-3 text-xs text-muted-foreground border-l border-border">{row.external}</div>
              </div>
            )}
          </div>
        </Section>

        {/* Section 03 — Feasibility */}
        <Section number="03" title="Feasibility Assessment" delay={0.3}>
          <div className="space-y-0">
            {currentDoc.feasibility.map((row, i) =>
            <div
              key={i}
              className={`flex items-baseline justify-between py-3.5 border-l-2 pl-4 ${
              i > 0 ? "border-t border-border" : ""} ${
              row.indicator === "green" ? "indicator-green" :
              row.indicator === "amber" ? "indicator-amber" : "indicator-red"}`
              }>
                <div className="flex items-baseline gap-3">
                  <span className="text-sm text-foreground font-medium">{row.label}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-sm text-foreground">{row.value}</span>
                </div>
                <span className="text-xs text-muted-foreground">{row.detail}</span>
              </div>
            )}
          </div>
        </Section>

        {/* Section 04 — Proposed Team */}
        <Section number="04" title="Proposed Team" delay={0.4}>
          <button
            onClick={() => setExpandedTeam(!expandedTeam)}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
            {expandedTeam ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{currentDoc.team.length} members recommended</span>
          </button>
          <AnimatePresence>
            {expandedTeam &&
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden">
                <div className="grid grid-cols-1 gap-3 mb-4">
                  {currentDoc.team.map((member, i) =>
                <TeamCard key={member.employee.id} member={member} index={i} />
                )}
                </div>
              </motion.div>
            }
          </AnimatePresence>
          <p className="text-xs text-muted-foreground font-serif italic">
            {currentDoc.teamContext}
          </p>
        </Section>

        {/* Section 05 — Recommended Approach */}
        <Section number="05" title="Recommended Approach" delay={0.5}>
          <div className="space-y-6">
            {currentDoc.phases.map((phase) =>
            <div key={phase.number} className="border-l border-border pl-5">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="font-serif text-lg text-foreground">Phase {phase.number}: {phase.title}</span>
                  <span className="text-xs text-muted-foreground">{phase.weeks}</span>
                </div>
                <p className="text-sm text-foreground/80 leading-[1.8]">{phase.description}</p>
              </div>
            )}
          </div>
        </Section>

        {/* Section 06 — Org Key Results */}
        <Section number="06" title="Org Key Results" delay={0.6}>
          <InlineOQR doc={currentDoc} />
        </Section>

        {/* Divider into conversation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="my-16">
          <div className="w-full h-px bg-border" />
        </motion.div>

        {/* Conversation Layer */}
        <ConversationLayer
          doc={currentDoc}
          onUpdate={handleConversationUpdate}
          onFinalize={handleFinalize}
          active={conversationActive}
          onActivate={() => setConversationActive(true)}
          externalInput={pendingInput}
          onExternalInputHandled={() => setPendingInput(null)} />

        {/* Export Banner */}
        <AnimatePresence>
          {showExport &&
          <ExportBanner doc={currentDoc} />
          }
        </AnimatePresence>
      </div>

      {/* Fixed bottom input bar */}
      <FixedInputBar
        onSend={(text) => setPendingInput(text)}
        onExportPDF={() => setShowExport(true)}
        onExportPPT={() => setShowExport(true)}
        onExportDocx={() => setShowExport(true)}
        oqrOpen={false} />
    </div>);
};

function Section({ number, title, delay, children
}: {number: string;title: string;delay: number;children: React.ReactNode;}) {
  return (
    <motion.section
      id={`section-${number}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="mb-14 scroll-mt-28">
      
      <div className="flex items-baseline gap-3 mb-5">
        <span className="text-muted-foreground tracking-[0.1em] font-sans text-base">{number}</span>
        <h2 className="font-serif text-2xl text-foreground">{title}</h2>
      </div>
      {children}
    </motion.section>);



export default BriefingDocumentView;
