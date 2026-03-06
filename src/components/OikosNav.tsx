import { motion } from "framer-motion";

const OikosNav = () => {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between px-6 py-5">
        <span className="font-serif text-xl tracking-wide text-foreground">
          Oikos
        </span>
        <div className="flex items-center gap-8">
          <span className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            About
          </span>
          <span className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Docs
          </span>
        </div>
      </div>
    </motion.nav>
  );
};

export default OikosNav;
