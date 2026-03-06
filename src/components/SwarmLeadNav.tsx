import { motion } from "framer-motion";

const SwarmLeadNav = () => {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl tracking-wide text-foreground">
            SwarmLead
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-warm-accent border border-warm-accent/30 px-1.5 py-0.5 rounded-sm">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-8">
          <span className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            How it works
          </span>
          <span className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Docs
          </span>
        </div>
      </div>
    </motion.nav>
  );
};

export default SwarmLeadNav;
