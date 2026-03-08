import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="w-12 h-12 border border-border flex items-center justify-center mb-5">
      <Icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
    </div>
    <h3 className="font-serif text-lg text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{description}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="mt-6 text-xs uppercase tracking-[0.12em] px-5 py-2.5 bg-foreground text-primary-foreground hover:bg-foreground/90 transition-colors"
      >
        {action.label}
      </button>
    )}
  </motion.div>
);

export default EmptyState;
