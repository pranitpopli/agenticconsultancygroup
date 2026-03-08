import { useState, useRef, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Upload, Send, X, FileText, Search, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { BriefingSummary } from "@/lib/briefingData";
import InboxCard from "./InboxCard";

interface OverviewDashboardProps {
  briefs: BriefingSummary[];
  onReadBriefing?: (id: string) => void;
  onSubmitBrief?: (text: string) => void;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const STATUS_FILTERS = ["All", "Analysis Complete", "In Delivery", "Draft"] as const;

const OverviewDashboard = ({ briefs, onReadBriefing, onSubmitBrief }: OverviewDashboardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [briefText, setBriefText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const fileRef = useRef<HTMLInputElement>(null);

  const filteredBriefs = useMemo(() => {
    return briefs.filter((b) => {
      const matchesSearch = !search || b.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || b.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [briefs, search, statusFilter]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleSubmit = () => {
    if (!briefText.trim() && !fileName) return;

    if (onSubmitBrief && briefText.trim()) {
      onSubmitBrief(briefText.trim());
      setBriefText("");
      setFileName(null);
      return;
    }

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

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <motion.main
      className="max-w-[780px] mx-auto px-4 sm:px-8 pt-28 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Dashboard overview"
    >
      {/* ━━━ GREETING ━━━ */}
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="font-serif text-3xl text-foreground mb-2">
          {getGreeting()}, {firstName}.
        </h1>
        <p className="text-sm text-muted-foreground">
          {briefs.length} {briefs.length === 1 ? "brief" : "briefs"} ready for your review.
        </p>
      </motion.div>

      {/* ━━━ SEARCH + FILTER ━━━ */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search briefs…"
            className="w-full text-sm bg-background border border-border pl-10 pr-4 py-2.5 outline-none focus:border-foreground/30 transition-colors placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`text-[11px] tracking-[0.08em] whitespace-nowrap px-3 py-1.5 border transition-colors ${
                statusFilter === f
                  ? "border-foreground/30 text-foreground bg-muted"
                  : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ━━━ BRIEF CARDS ━━━ */}
      <motion.div variants={itemVariants} className="space-y-4 mb-14">
        {filteredBriefs.length > 0 ? (
          filteredBriefs.map((brief, i) => (
            <InboxCard
              key={brief.id}
              brief={brief}
              index={i}
              onRead={onReadBriefing ?? (() => {})}
            />
          ))
        ) : (
          <div className="border border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              {search || statusFilter !== "All"
                ? "No briefs match your filters."
                : "No briefs yet. Submit one below to get started."}
            </p>
          </div>
        )}
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
            className="w-full text-sm bg-transparent border border-border px-4 py-3 outline-none resize-none placeholder:text-muted-foreground/60 focus:border-foreground/30 transition-colors leading-relaxed text-foreground"
          />

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
                   <button onClick={() => setFileName(null)} className="ml-1 hover:text-muted-foreground" aria-label="Remove file">
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

    </motion.main>
  );
};

export default OverviewDashboard;
