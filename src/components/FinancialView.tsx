import { motion } from "framer-motion";
import type { FinancialModel } from "@/lib/types";

interface FinancialViewProps {
  model: FinancialModel;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const FinancialView = ({ model }: FinancialViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block">
        Business Value Intelligence
      </span>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-1">
          <span className="text-2xl font-serif text-foreground">{model.savingsPercent}%</span>
          <span className="text-[10px] text-muted-foreground block uppercase tracking-wider">Cost Savings</span>
        </div>
        <div className="space-y-1">
          <span className="text-2xl font-serif text-foreground">{model.timeToAssembleSwarm}d</span>
          <span className="text-[10px] text-muted-foreground block uppercase tracking-wider">Assembly Time</span>
        </div>
        <div className="space-y-1">
          <span className="text-2xl font-serif text-foreground">+{model.utilisationImprovement}%</span>
          <span className="text-[10px] text-muted-foreground block uppercase tracking-wider">Utilisation</span>
        </div>
      </div>

      {/* Cost comparison */}
      <div className="border border-border rounded-sm overflow-hidden">
        <div className="grid grid-cols-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground border-b border-border">
          <div className="p-3">Category</div>
          <div className="p-3 text-right">Traditional</div>
          <div className="p-3 text-right">SwarmLead</div>
        </div>
        {model.breakdown.map((row) => (
          <div key={row.label} className="grid grid-cols-3 text-xs border-b border-border/40 last:border-0">
            <div className="p-3 text-foreground/80 font-light">{row.label}</div>
            <div className="p-3 text-right text-muted-foreground font-light">{formatCurrency(row.traditional)}</div>
            <div className="p-3 text-right text-foreground font-light">{formatCurrency(row.swarm)}</div>
          </div>
        ))}
        <div className="grid grid-cols-3 text-xs bg-muted/30">
          <div className="p-3 text-foreground font-medium">Total</div>
          <div className="p-3 text-right text-muted-foreground">{formatCurrency(model.traditionalCost)}</div>
          <div className="p-3 text-right text-foreground font-medium">{formatCurrency(model.swarmCost)}</div>
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground/60 italic font-serif">
        Traditional assembly: ~{model.timeToAssembleTraditional} days via hierarchical routing
      </div>
    </motion.div>
  );
};

export default FinancialView;
