import { motion } from "framer-motion";

const nodes = [
  { label: "Brief", active: true },
  { label: "Swarm", active: true },
  { label: "Team", active: true },
  { label: "Outcome", active: true },
  { label: "OQR", active: true },
];

const OQRFlowDiagram = () => {
  return (
    <div className="flex items-center gap-1 py-3">
      {nodes.map((node, i) => (
        <div key={node.label} className="flex items-center">
          <motion.div
            className="relative flex items-center justify-center px-2.5 py-1.5 border border-border rounded-sm"
            animate={node.active ? {
              borderColor: [
                "hsl(var(--border))",
                "hsl(var(--warm-accent))",
                "hsl(var(--border))",
              ],
            } : {}}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          >
            {node.active && (
              <motion.div
                className="absolute inset-0 rounded-sm"
                animate={{
                  boxShadow: [
                    "0 0 0 0 hsl(var(--warm-accent) / 0)",
                    "0 0 8px 2px hsl(var(--warm-accent) / 0.15)",
                    "0 0 0 0 hsl(var(--warm-accent) / 0)",
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut",
                }}
              />
            )}
            <span className="text-[9px] uppercase tracking-[0.1em] text-foreground/70 relative z-10">
              {node.label}
            </span>
          </motion.div>
          {i < nodes.length - 1 && (
            <div className="w-3 h-px bg-border mx-0.5" />
          )}
        </div>
      ))}
    </div>
  );
};

export default OQRFlowDiagram;
