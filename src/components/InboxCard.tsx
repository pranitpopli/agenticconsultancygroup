import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import type { BriefingSummary } from "@/lib/briefingData";

interface InboxCardProps {
  brief: BriefingSummary;
  index: number;
  onRead: (id: string) => void;
}

const InboxCard = ({ brief, index, onRead }: InboxCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
      className="border border-border p-8 hover:border-foreground/20 transition-colors group"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 space-y-3">
           <div className="flex items-center gap-3">
             <h3 className="font-serif text-xl text-foreground">{brief.title}</h3>
             {brief.status === "swarm-searching" ? (
               <motion.span
                 animate={{ rotate: 360 }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 className="text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 border border-muted text-muted-foreground flex items-center gap-1.5"
               >
                 <Zap className="w-3 h-3" strokeWidth={2} />
                 Searching swarm
               </motion.span>
             ) : (
              {brief.status === "analysis-complete" ? (
                <span className="text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 border status-green">
                  Analysis complete
                </span>
              ) : (
                <motion.span
                  className="text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 border border-muted text-muted-foreground flex items-center gap-1.5"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-flex"
                  >
                    <Zap className="w-3 h-3" strokeWidth={2} />
                  </motion.span>
                  Swarm searching
                </motion.span>
              )}
             )}
           </div>

          <div className="flex items-center gap-2 text-xs text-foreground/60">
            <span>{brief.submittedBy.name}</span>
            <span>·</span>
            <span>{brief.submittedBy.role}</span>
            <span>·</span>
            <span>{brief.dateReceived}</span>
          </div>

          <p className="text-sm text-foreground/70 leading-relaxed max-w-2xl">
            {brief.aiSummary}
          </p>
        </div>

        <button
          onClick={() => onRead(brief.id)}
          className="flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-foreground border border-foreground px-5 py-2.5 hover:bg-foreground hover:text-primary-foreground transition-colors mt-1 whitespace-nowrap"
        >
          Read briefing
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
  );
};

export default InboxCard;
