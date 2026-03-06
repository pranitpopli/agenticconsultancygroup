import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Upload } from "lucide-react";

interface BriefInputProps {
  onSubmit: (text: string) => void;
  isRunning: boolean;
}

const INTEGRATIONS = [
  { name: "Jira", color: "text-blue-600" },
  { name: "Trello", color: "text-sky-500" },
  { name: "Confluence", color: "text-blue-500" },
  { name: "Slack", color: "text-pink-500" },
  { name: "Notion", color: "text-foreground" },
];

const BriefInput = ({ onSubmit, isRunning }: BriefInputProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim() && !isRunning) {
      onSubmit(value.trim());
      setValue("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto space-y-5"
    >
      <div className="relative border border-border rounded-sm focus-within:border-foreground/30 transition-colors duration-300">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Describe your project requirements or paste a brief…"
          disabled={isRunning}
          rows={4}
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 text-sm p-5 outline-none disabled:opacity-50 font-light resize-none leading-relaxed"
        />
        <div className="flex items-center justify-between px-5 pb-4">
          <div className="flex items-center gap-2">
            <button
              disabled={isRunning}
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 border border-border px-2.5 py-1.5 rounded-sm"
            >
              <Upload className="w-3 h-3" strokeWidth={1.5} />
              Upload Brief
            </button>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || isRunning}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-foreground hover:text-warm-accent transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Assemble Team
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Integration badges */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <span className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.15em]">
          Connects to
        </span>
        {INTEGRATIONS.map((i) => (
          <span
            key={i.name}
            className="text-[10px] text-muted-foreground/70 uppercase tracking-[0.15em] border border-border/60 px-2 py-1 rounded-sm hover:border-foreground/20 transition-colors cursor-pointer"
          >
            {i.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default BriefInput;
