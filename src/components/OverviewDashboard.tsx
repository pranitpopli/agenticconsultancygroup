import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Send, X, FileText, Zap, TrendingUp, Circle } from "lucide-react";
import { OQR_DATA } from "@/lib/oqrData";
import { EMPLOYEES } from "@/lib/simulatedData";
import { BRIEFING_SUMMARIES } from "@/lib/briefingData";
import InboxCard from "./InboxCard";

interface OverviewDashboardProps {
  onReadBriefing?: (id: string) => void;
}

const OverviewDashboard = ({ onReadBriefing }: OverviewDashboardProps) => {
  const { toast } = useToast();
  const [briefText, setBriefText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set());
  const [connectingIntegration, setConnectingIntegration] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { totalSavings, orgMaturity, maturityDelta, aiProjects, currentQuarter } = OQR_DATA;
  const liveProjects = aiProjects.filter((p) => p.status === "live").length;
  const inBuild = aiProjects.filter((p) => p.status === "in-build").length;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleSubmit = () => {
    if (!briefText.trim() && !fileName) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setBriefText("");
      setFileName(null);
      toast({ title: "Brief submitted", description: "Your agents are analysing the brief. It will appear in your inbox shortly." });
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <motion.main
      className="max-w-[780px] mx-auto px-8 pt-28 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Dashboard overview"
    >
      {/* ━━━ GREETING ━━━ */}
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="font-serif text-3xl text-foreground mb-2">
          Good morning, James.
        </h1>
        <p className="text-sm text-muted-foreground">
          {BRIEFING_SUMMARIES.length} {BRIEFING_SUMMARIES.length === 1 ? "brief" : "briefs"} ready for your review.
        </p>
      </motion.div>

      {/* ━━━ BRIEF CARDS ━━━ */}
      <motion.div variants={itemVariants} className="space-y-4 mb-14">
        {BRIEFING_SUMMARIES.map((brief, i) => (
          <InboxCard
            key={brief.id}
            brief={brief}
            index={i}
            onRead={onReadBriefing ?? (() => {})}
          />
        ))}
      </motion.div>

      {/* ━━━ QUARTER PULSE ━━━ */}
      <motion.div variants={itemVariants} className="mb-14">
        <div className="border border-border p-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
            {currentQuarter} · Organisation pulse
          </p>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-2xl font-sans tabular-nums text-foreground">
                £{(totalSavings / 1000).toFixed(0)}k
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Cost avoided this quarter
              </p>
            </div>
            <div>
              <p className="text-2xl font-sans tabular-nums text-foreground">
                {liveProjects}
                <span className="text-base text-muted-foreground ml-1">
                  +{inBuild}
                </span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                AI projects live · in build
              </p>
            </div>
            <div>
              <p className="text-2xl font-sans tabular-nums text-foreground">
                {orgMaturity}%
                <span className="text-base text-[hsl(var(--status-positive))] ml-1">
                  +{maturityDelta}
                </span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                AI maturity · pts this quarter
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ━━━ SUBMIT NEW BRIEF ━━━ */}
      <motion.div variants={itemVariants} className="mb-16">
        <div className="border border-border p-6 space-y-4">
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Submit a new brief
          </span>

          <textarea
            value={briefText}
            onChange={(e) => setBriefText(e.target.value)}
            placeholder="What do you need a team for? Describe the initiative, scope, or challenge…"
            rows={4}
            className="w-full text-sm bg-transparent border border-border px-4 py-3 outline-none resize-none placeholder:text-muted-foreground/60 focus:border-foreground/30 transition-colors leading-relaxed"
          />

          {/* Integration pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mr-1">Connect:</span>
            {["Jira", "Trello", "Slack", "Confluence", "GitHub"].map((name) => {
              const isConnected = connectedIntegrations.has(name);
              const isConnecting = connectingIntegration === name;
              return (
                <button
                  key={name}
                  onClick={() => {
                    if (isConnected || isConnecting) return;
                    setConnectingIntegration(name);
                    setTimeout(() => {
                      setConnectedIntegrations(prev => new Set([...prev, name]));
                      setConnectingIntegration(null);
                    }, 1200);
                  }}
                  className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 border transition-all ${
                    isConnected
                      ? "border-foreground/20 text-foreground"
                      : isConnecting
                      ? "border-border text-muted-foreground animate-pulse"
                      : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  <Circle
                    className={`w-2 h-2 flex-shrink-0 ${
                      isConnected
                        ? "fill-[hsl(var(--status-positive))] text-[hsl(var(--status-positive))]"
                        : isConnecting
                        ? "fill-[hsl(var(--warm-accent))] text-[hsl(var(--warm-accent))]"
                        : "fill-muted text-muted"
                    }`}
                  />
                  {isConnecting ? `Pulling ${name} history…` : name}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 text-xs text-muted-foreground border border-border px-3 py-2 hover:border-foreground/30 hover:text-foreground transition-colors"
              >
                <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
                Upload document
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md"
                onChange={handleFileSelect}
                className="hidden"
              />

              {fileName && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 text-xs text-foreground bg-muted px-3 py-1.5 border border-border"
                >
                  <FileText className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
                  {fileName}
                  <button onClick={() => setFileName(null)} className="ml-1 hover:text-muted-foreground">
                    <X className="w-3 h-3" strokeWidth={1.5} />
                  </button>
                </motion.span>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={(!briefText.trim() && !fileName) || submitting}
              className="flex items-center gap-2 text-xs tracking-[0.1em] uppercase bg-foreground text-primary-foreground px-5 py-2.5 hover:bg-foreground/90 disabled:opacity-30 transition-colors"
            >
              {submitting ? (
                <span>Analysing…</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Run agents
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* ━━━ FOOTER ━━━ */}
      <motion.p
        variants={itemVariants}
        className="text-xs text-muted-foreground/50 italic text-center font-serif"
      >
        Swarm last scanned {EMPLOYEES.length} nodes across Meridian Group — 4 minutes ago.
      </motion.p>
    </motion.main>
  );
};

export default OverviewDashboard;
