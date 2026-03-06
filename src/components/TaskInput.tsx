import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
      className="w-full max-w-xl mx-auto"
    >
      <div className="relative border-b border-foreground/20 focus-within:border-foreground/40 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Describe a task for the swarm…"
            disabled={isRunning}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm py-4 outline-none disabled:opacity-50 font-light"
          />
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || isRunning}
            className="flex items-center justify-center w-8 h-8 text-foreground/60 hover:text-foreground transition-colors duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4" strokeWidth={1} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskInput;
