import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { OverlappingProject } from "@/lib/types";

interface SiloCheckProps {
  overlaps: OverlappingProject[];
  onReviewOverlaps: () => void;
  onSkipToTeam: () => void;
}

const SiloCheck = ({ overlaps, onReviewOverlaps, onSkipToTeam }: SiloCheckProps) => {
  const hasOverlaps = overlaps.length > 0;

  // Auto-advance if no overlaps
  useEffect(() => {
    if (!hasOverlaps) {
      const timer = setTimeout(onSkipToTeam, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasOverlaps, onSkipToTeam]);

  const completedCount = overlaps.filter(o => o.outcome === "completed").length;
  const stalledCount = overlaps.filter(o => o.outcome === "stalled").length;
  const cancelledCount = overlaps.filter(o => o.outcome === "cancelled").length;

  const buildSubtext = () => {
    const parts: string[] = [];
    if (completedCount > 0) parts.push(`${completedCount} completed initiative${completedCount > 1 ? "s" : ""}`);
    if (stalledCount > 0) parts.push(`${stalledCount} stalled`);
    if (cancelledCount > 0) parts.push(`${cancelledCount} cancelled`);

    const years = [...new Set(overlaps.map(o => o.year))].sort();
    const yearRange = years.length === 1 ? `in ${years[0]}` : `between ${years[0]}–${years[years.length - 1]}`;

    return `${parts.join(", ")} ${yearRange}. Review before proceeding.`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[80vh] flex items-center justify-center px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-2xl"
      >
        {hasOverlaps ? (
          <div className="border border-foreground/20 p-8 md:p-10 space-y-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-warm-accent mt-1 flex-shrink-0" strokeWidth={1.5} />
              <div className="space-y-2">
                <h2 className="font-serif text-2xl md:text-3xl text-foreground leading-tight">
                  This project has been attempted before.
                </h2>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  {buildSubtext()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onReviewOverlaps}
                className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground border border-border px-4 py-2.5 rounded-sm hover:border-foreground/30 hover:text-foreground transition-colors"
              >
                Review overlaps
              </button>
              <button
                onClick={onSkipToTeam}
                className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-foreground border border-foreground/30 px-4 py-2.5 rounded-sm hover:bg-foreground hover:text-background transition-colors"
              >
                Skip to team
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-green-500/30 p-8 md:p-10 space-y-3">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <h2 className="font-serif text-2xl text-foreground">
                  No prior projects found.
                </h2>
                <p className="text-sm text-muted-foreground font-light mt-1">
                  You're in new territory. Assembling team now…
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SiloCheck;
