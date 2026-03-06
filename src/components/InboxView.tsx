import { motion } from "framer-motion";
import InboxCard from "./InboxCard";
import { BRIEFING_SUMMARIES } from "@/lib/briefingData";

interface InboxViewProps {
  onReadBriefing: (id: string) => void;
}

const InboxView = ({ onReadBriefing }: InboxViewProps) => {
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
        <p className="text-sm text-muted-foreground">
          You have {BRIEFING_SUMMARIES.length} briefs awaiting review.
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

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-muted-foreground font-serif italic mt-16 text-center"
      >
        Swarm last ran 4 minutes ago across 847 nodes.
      </motion.p>
    </motion.div>
  );
};

export default InboxView;
