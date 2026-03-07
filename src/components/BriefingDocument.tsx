import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import type { BriefingDocument as BriefingDocType } from "@/lib/briefingData";
import ConversationLayer from "./ConversationLayer";
import ExportBanner from "./ExportBanner";
import FixedInputBar from "./FixedInputBar";
import InlineOQR from "./InlineOQR";
import BriefingIndex from "./BriefingIndex";
import ProposedSystemView from "./ProposedSystem";

interface BriefingDocumentProps {
  doc: BriefingDocType;
  onBack: () => void;
  oqrOpen: boolean;
  onOQRToggle: () => void;
}


const BriefingDocumentView = ({ doc, onBack, oqrOpen, onOQRToggle }: BriefingDocumentProps) => {

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
    <div className="transition-all duration-300 relative">
      <BriefingIndex />

      <div className="max-w-[780px] mx-auto px-8 pt-28 pb-28">
        {/* Navigation row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-6 mb-10">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="tracking-[0.1em] uppercase">Back to briefings</span>
          </motion.button>
          <motion.button
            className="ml-auto gap-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground border border-border px-4 py-2.5 hover:border-foreground/30 hover:text-foreground transition-colors flex items-center">
            <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
            View original
          </motion.button>
        </motion.div>

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

        {/* Section 04 — Proposed System */}
        <Section number="04" title="Proposed System" delay={0.4}>
          <ProposedSystemView system={currentDoc.system} />
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

}

export default BriefingDocumentView;