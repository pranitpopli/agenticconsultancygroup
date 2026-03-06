import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface TaskInputProps {
  onSubmit: (task: string) => void;
  isRunning: boolean;
}

const TaskInput = ({ onSubmit, isRunning }: TaskInputProps) => {
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
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative">
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-glow-primary/20 via-transparent to-glow-secondary/20 blur-sm" />
        <div className="relative surface-glass rounded-2xl p-1.5">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-glow-primary ml-4 flex-shrink-0 animate-pulse-glow" strokeWidth={1.5} />
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Describe a task for the swarm…"
              disabled={isRunning}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm py-3 outline-none disabled:opacity-50"
            />
            <button
              onClick={handleSubmit}
              disabled={!value.trim() || isRunning}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskInput;
