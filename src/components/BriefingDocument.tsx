import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import type { BriefingDocument as BriefingDocType, Scenario } from "@/lib/briefingData";
import ConversationLayer from "./ConversationLayer";
import ExportBanner from "./ExportBanner";
import FixedInputBar from "./FixedInputBar";
import InlineOQR from "./InlineOQR";
import ProposedSystemView from "./ProposedSystem";
import GanttChart from "./GanttChart";
import BriefingOQRPanel from "./BriefingOQRPanel";
import ExecutiveDecisionSummary from "./ExecutiveDecisionSummary";
import RiskRegister from "./RiskRegister";
import SuccessMetrics from "./SuccessMetrics";
import ScenarioModelling from "./ScenarioModelling";
import RACIMatrix from "./RACIMatrix";
import DeliveryTracker from "./DeliveryTracker";
import ImpactLedger from "./ImpactLedger";
import BenchmarkAnnotations from "./BenchmarkAnnotations";
import ChangeReadiness from "./ChangeReadiness";
import BriefingTableOfContents from "./BriefingTableOfContents";
import { BENCHMARKS } from "@/lib/benchmarkData";
import { CHANGE_READINESS } from "@/lib/changeReadinessData";
import { IMPACT_LEDGER_DATA } from "@/lib/impactLedgerData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Printer } from "lucide-react";

interface BriefingDocumentProps {
  doc: BriefingDocType;
  onBack: () => void;
  readOnly?: boolean;
}

const BriefingDocumentView = ({ doc, onBack, readOnly = false }: BriefingDocumentProps) => {
  const [conversationActive, setConversationActive] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(doc);
  const [showExport, setShowExport] = useState(false);
  const [pendingInput, setPendingInput] = useState<string | null>(null);
  const [oqrOpen, setOqrOpen] = useState(false);
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleBack = () => {
    if (conversationActive && !readOnly) {
      setShowLeaveWarning(true);
    } else {
      onBack();
    }
  };

  const handleConversationUpdate = (updates: Partial<BriefingDocType>) => {
    setCurrentDoc((prev) => ({ ...prev, ...updates }));
  };

  const handleFinalize = () => {
    setShowExport(true);
  };

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenarioId(scenario.id);
    setCurrentDoc((prev) => ({
      ...prev,
      internalCost: scenario.cost,
      saving: prev.externalCost - scenario.cost,
    }));
    toast({
      title: `Scenario selected: ${scenario.name}`,
      description: `Cost updated to £${scenario.cost.toLocaleString()} · ${scenario.weeks} weeks · ${scenario.scopePercent}% scope`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Build sections list for ToC
  const sections = useMemo(() => {
    const s: { number: string; title: string }[] = [];
    let n = 0;
    const next = () => String(++n).padStart(2, "0");

    s.push({ number: next(), title: "The Initiative" });
    s.push({ number: next(), title: "Cost & Business Value" });
    s.push({ number: next(), title: "Feasibility Assessment" });
    if (currentDoc.risks && currentDoc.risks.length > 0) s.push({ number: next(), title: "Risk Register" });
    s.push({ number: next(), title: "Proposed System" });
    if (currentDoc.raciMatrix && currentDoc.raciMatrix.length > 0) s.push({ number: next(), title: "Governance (RACI)" });
    s.push({ number: next(), title: "Recommended Approach" });
    if (currentDoc.scenarios && currentDoc.scenarios.length > 0) s.push({ number: next(), title: "Scenario Modelling" });
    if (currentDoc.successMetrics && currentDoc.successMetrics.length > 0) s.push({ number: next(), title: "Success Criteria" });
    if (currentDoc.deliveryStatus) s.push({ number: next(), title: "Delivery Status" });
    s.push({ number: next(), title: "Org Key Results" });

    return s;
  }, [currentDoc]);

  // Section counter for dynamic numbering (must match ToC logic)
  let sectionNum = 0;
  const nextSection = () => String(++sectionNum).padStart(2, "0");

  return (
    <main className="transition-all duration-300 relative" aria-label="Briefing document">
      {/* Table of Contents */}
      <BriefingTableOfContents sections={sections} />

      {/* OQR Panel */}
      <AnimatePresence>
        {oqrOpen && (
          <BriefingOQRPanel open={oqrOpen} onToggle={() => setOqrOpen(false)} />
        )}
      </AnimatePresence>
      {!oqrOpen && (
        <BriefingOQRPanel open={false} onToggle={() => setOqrOpen(true)} />
      )}

      {/* Unsaved conversation warning */}
      <AlertDialog open={showLeaveWarning} onOpenChange={setShowLeaveWarning}>
        <AlertDialogContent className="border border-border bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl">Leave this briefing?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Your conversation progress will be lost. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs uppercase tracking-[0.1em]">Stay</AlertDialogCancel>
            <AlertDialogAction onClick={onBack} className="text-xs uppercase tracking-[0.1em] bg-foreground text-primary-foreground hover:bg-foreground/90">Leave</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className={`max-w-[780px] mx-auto px-4 sm:px-8 pt-28 pb-28 transition-all duration-300 ${oqrOpen ? "mr-[340px]" : ""}`}>
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 flex items-center justify-between"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={handleBack} className="cursor-pointer text-xs uppercase tracking-[0.1em]">
                  Briefings
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs uppercase tracking-[0.1em]">{currentDoc.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors print:hidden"
            aria-label="Print briefing"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </motion.div>

        {/* Status row */}
        {readOnly && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-10">
            <span className="text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 border border-border text-muted-foreground">
              Read-only · Archived
            </span>
          </motion.div>
        )}

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14">
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight mb-3">
            {currentDoc.title}
          </h1>
          <div className="w-12 h-px bg-foreground/20" />
        </motion.div>

        {/* Executive Decision Summary */}
        <div id="executive-summary" className="scroll-mt-28">
          <ExecutiveDecisionSummary doc={currentDoc} readOnly={readOnly} />
        </div>

        {/* Section — Initiative */}
        <Section number={nextSection()} title="The Initiative" delay={0.1}>
          {currentDoc.initiative.map((para, i) =>
            <p key={i} className="text-sm text-foreground/80 leading-[1.8] mb-4 last:mb-0">
              {para}
            </p>
          )}
        </Section>

        {/* Section — Cost & Business Value */}
        <Section number={nextSection()} title="Cost & Business Value" delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Internal cost</p>
              <p className="text-2xl text-foreground font-sans tabular-nums">£{currentDoc.internalCost.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">External equivalent</p>
              <p className="text-2xl text-muted-foreground font-sans tabular-nums">£{currentDoc.externalCost.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Projected saving</p>
              <p className="text-2xl text-foreground font-sans tabular-nums">£{currentDoc.saving.toLocaleString()}</p>
            </div>
          </div>

          <p className="text-sm text-foreground/80 leading-[1.8] mb-6">
            {currentDoc.costNarrative}
          </p>

          {/* Comparison table */}
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="border border-border overflow-hidden min-w-[480px]">
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
          </div>
        </Section>

        {/* Section — Feasibility */}
        <Section number={nextSection()} title="Feasibility Assessment" delay={0.3}>
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
                <span className="text-xs text-muted-foreground hidden sm:block">{row.detail}</span>
              </div>
            )}
          </div>
        </Section>

        {/* Section — Risk Register */}
        {currentDoc.risks && currentDoc.risks.length > 0 && (
          <Section number={nextSection()} title="Risk Register" delay={0.35}>
            <RiskRegister risks={currentDoc.risks} />
          </Section>
        )}

        {/* Section — Proposed System */}
        <Section number={nextSection()} title="Proposed System" delay={0.4}>
          <ProposedSystemView system={currentDoc.system} />
        </Section>

        {/* Section — RACI Matrix */}
        {currentDoc.raciMatrix && currentDoc.raciMatrix.length > 0 && (
          <Section number={nextSection()} title="Governance (RACI)" delay={0.42}>
            <RACIMatrix entries={currentDoc.raciMatrix} phases={currentDoc.phases} />
          </Section>
        )}

        {/* Section — Recommended Approach */}
        <Section number={nextSection()} title="Recommended Approach" delay={0.5}>
          <div className="space-y-6 mb-10">
            {currentDoc.phases.map((phase) =>
              <div key={phase.number} className="border-l border-border pl-5">
                <div className="flex items-baseline gap-3 mb-1.5 flex-wrap">
                  <span className="text-sm font-medium text-foreground">Phase {phase.number}: {phase.title}</span>
                  <span className="text-xs text-muted-foreground">{phase.weeks}</span>
                </div>
                <p className="text-sm text-foreground/80 leading-[1.8]">{phase.description}</p>
              </div>
            )}
          </div>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <GanttChart phases={currentDoc.phases} />
          </div>
        </Section>

        {/* Section — Scenario Modelling */}
        {currentDoc.scenarios && currentDoc.scenarios.length > 0 && (
          <Section number={nextSection()} title="Scenario Modelling" delay={0.52}>
            <ScenarioModelling
              scenarios={currentDoc.scenarios}
              onSelectScenario={readOnly ? undefined : handleSelectScenario}
              selectedScenarioId={selectedScenarioId}
              readOnly={readOnly}
            />
          </Section>
        )}

        {/* Section — Success Metrics */}
        {currentDoc.successMetrics && currentDoc.successMetrics.length > 0 && (
          <Section number={nextSection()} title="Success Criteria" delay={0.55}>
            <SuccessMetrics metrics={currentDoc.successMetrics} />
          </Section>
        )}

        {/* Section — Delivery Status */}
        {currentDoc.deliveryStatus && (
          <Section number={nextSection()} title="Delivery Status" delay={0.58}>
            <DeliveryTracker status={currentDoc.deliveryStatus} />
          </Section>
        )}

        {/* Section — Org Key Results */}
        <Section number={nextSection()} title="Org Key Results" delay={0.6}>
          <InlineOQR doc={currentDoc} />
        </Section>

        {/* Conversation & Export — hidden in read-only mode */}
        {!readOnly && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="my-16">
              <div className="w-full h-px bg-border" />
            </motion.div>

            <ConversationLayer
              doc={currentDoc}
              onUpdate={handleConversationUpdate}
              onFinalize={handleFinalize}
              active={conversationActive}
              onActivate={() => setConversationActive(true)}
              externalInput={pendingInput}
              onExternalInputHandled={() => setPendingInput(null)} />

            <AnimatePresence>
              {showExport && <ExportBanner doc={currentDoc} />}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Fixed bottom input bar — hidden in read-only mode */}
      {!readOnly && (
        <FixedInputBar
          onSend={(text) => setPendingInput(text)}
          onExportPDF={handlePrint}
          onExportPPT={() => setShowExport(true)}
          onExportDocx={() => setShowExport(true)}
          oqrOpen={oqrOpen}
          suggestions={!conversationActive ? [
            "Replace Sarah Chen — she's on another project",
            "Compress to 10 weeks instead of 14",
          ] : []} />
      )}
    </main>
  );
};

function Section({ number, title, delay, children
}: {number: string; title: string; delay: number; children: React.ReactNode;}) {
  return (
    <motion.section
      id={`section-${number}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="mb-14 scroll-mt-28">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="text-muted-foreground tracking-[0.1em] font-sans text-sm tabular-nums">{number}</span>
        <h2 className="font-serif text-2xl text-foreground">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

export default BriefingDocumentView;
