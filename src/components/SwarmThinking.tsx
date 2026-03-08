import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SwarmThinkingProps {
  lines: string[];
  onComplete: () => void;
}

const SwarmThinking = ({ lines, onComplete }: SwarmThinkingProps) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (skipped) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setVisibleLines(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [lines, onComplete, skipped]);

  const handleSkip = () => {
    setSkipped(true);
    setVisibleLines(lines);
    setTimeout(onComplete, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-[80vh] flex items-center justify-center px-6"
    >
      <div className="w-full max-w-xl">
        <div className="space-y-0">
          {visibleLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="font-mono text-xs text-muted-foreground leading-loose"
            >
              <span className="text-muted-foreground/30 mr-3 select-none">›</span>
              {line}
            </motion.div>
          ))}
          {visibleLines.length < lines.length && (
            <span className="inline-block w-1.5 h-3.5 bg-foreground/40 animate-pulse ml-5" />
          )}
        </div>
        {!skipped && visibleLines.length < lines.length && (
          <button
            onClick={handleSkip}
            className="mt-6 text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip →
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SwarmThinking;
