import { motion } from "framer-motion";
import type { OrgNarrative } from "@/lib/types";

interface NarrativeViewProps {
  narrative: OrgNarrative;
}

const NarrativeView = ({ narrative }: NarrativeViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block">
        Organisational Shift Narrative
      </span>

      <h3 className="text-xl font-serif italic text-foreground leading-snug">
        "{narrative.title}"
      </h3>

      <p className="text-sm text-foreground/80 leading-relaxed font-light">
        {narrative.body}
      </p>

      <div className="space-y-3 pt-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Key Insights
        </span>
        {narrative.keyInsights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="flex items-start gap-3 pl-1"
          >
            <span className="text-[10px] text-warm-accent mt-1 flex-shrink-0">✦</span>
            <p className="text-xs text-foreground/70 leading-relaxed font-light">
              {insight}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NarrativeView;
