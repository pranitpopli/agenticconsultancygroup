import { motion } from "framer-motion";
import { Diamond } from "lucide-react";

const OikosNav = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 surface-glass"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Diamond className="w-5 h-5 text-glow-primary" strokeWidth={1.5} />
          <span className="font-serif text-lg tracking-wide text-foreground">
            Oikos
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            How it works
          </span>
          <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Docs
          </span>
        </div>
      </div>
    </motion.nav>
  );
};

export default OikosNav;
