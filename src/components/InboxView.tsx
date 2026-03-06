import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Send, X, FileText } from "lucide-react";
import InboxCard from "./InboxCard";
import { BRIEFING_SUMMARIES } from "@/lib/briefingData";

interface InboxViewProps {
  onReadBriefing: (id: string) => void;
}

const InboxView = ({ onReadBriefing }: InboxViewProps) => {
  const [briefText, setBriefText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[780px] mx-auto px-8 pt-32 pb-24"
    >
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="font-serif text-3xl text-foreground mb-2">
          Good morning, James.
        </h1>
        <p className="text-sm text-foreground/60">
          {BRIEFING_SUMMARIES.length} briefs ready for your review.
        </p>
      </motion.div>

      {/* Brief cards */}
      <div className="space-y-4">
        {BRIEFING_SUMMARIES.map((brief, i) => (
          <InboxCard
            key={brief.id}
            brief={brief}
            index={i}
            onRead={onReadBriefing}
          />
        ))}
      </div>

      {/* New briefing section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <div className="border border-border p-6 space-y-4">
          <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/50">Submit a new brief</span>

          <textarea
            value={briefText}
            onChange={(e) => setBriefText(e.target.value)}
            placeholder="What do you need a team for? Describe the initiative, scope, or challenge…"
            rows={4}
            className="w-full text-sm bg-transparent border border-border px-4 py-3 outline-none resize-none placeholder:text-foreground/40 focus:border-foreground/30 transition-colors leading-relaxed"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 text-xs text-foreground/60 border border-border px-3 py-2 hover:border-foreground/30 hover:text-foreground transition-colors"
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
                  <button onClick={() => setFileName(null)} className="ml-1 hover:text-foreground/60">
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
                  Find my team
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-foreground/40 italic mt-16 text-center"
      >
        Last updated 4 minutes ago · 847 employees analysed across the organisation.
      </motion.p>
    </motion.div>
  );
};

export default InboxView;
