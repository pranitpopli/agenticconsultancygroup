import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Users, DollarSign, Clock, ChevronDown, ChevronUp } from "lucide-react";
import BriefingNav from "@/components/BriefingNav";
import {
  PORTFOLIO_PROJECTS,
  RESOURCE_CONFLICTS,
  SWARM_ALERTS,
  PORTFOLIO_TOTALS,
} from "@/lib/portfolioData";
import type { SwarmAlert } from "@/lib/portfolioData";

const STATUS_STYLES: Record<string, string> = {
  "on-track": "bg-[hsl(var(--status-positive-bg))] text-[hsl(var(--status-positive))]",
  "at-risk": "bg-[hsl(var(--status-warning-bg))] text-[hsl(var(--status-warning))]",
  "blocked": "bg-[hsl(var(--status-danger-bg))] text-[hsl(var(--status-danger))]",
};

const SEVERITY_STYLES: Record<string, string> = {
  critical: "border-l-[hsl(var(--status-danger))]",
  warning: "border-l-[hsl(var(--status-warning))]",
  info: "border-l-[hsl(var(--status-info))]",
};

const SEVERITY_DOT: Record<string, string> = {
  critical: "bg-[hsl(var(--status-danger))]",
  warning: "bg-[hsl(var(--status-warning))]",
  info: "bg-[hsl(var(--status-info))]",
};

const maxWeek = Math.max(...PORTFOLIO_PROJECTS.map((p) => p.endWeek));

const Portfolio = () => {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <BriefingNav activeTab="portfolio" />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight mb-3">
            Portfolio Command Centre
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[600px]">
            Cross-project visibility. Resource contention. Budget burn. Swarm-detected risks across your active portfolio.
          </p>
          <div className="w-12 h-px bg-foreground/20 mt-4" />
        </motion.div>

        {/* Summary cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14"
        >
          {[
            { label: "Active projects", value: PORTFOLIO_TOTALS.activeProjects, icon: TrendingUp },
            { label: "People deployed", value: PORTFOLIO_TOTALS.totalPeople, icon: Users },
            { label: "Budget committed", value: `£${(PORTFOLIO_TOTALS.totalBudget / 1000).toFixed(0)}k`, icon: DollarSign },
            { label: "Avg progress", value: `${PORTFOLIO_TOTALS.avgProgress}%`, icon: Clock },
          ].map((card) => (
            <div key={card.label} className="border border-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <card.icon className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{card.label}</p>
              </div>
              <p className="text-2xl font-sans tabular-nums text-foreground">{card.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Stacked Gantt Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-14"
        >
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-muted-foreground tracking-[0.1em] font-sans text-sm tabular-nums">01</span>
            <h2 className="font-serif text-2xl text-foreground">Portfolio Timeline</h2>
          </div>

          <div className="border border-border overflow-x-auto">
            {/* Week header */}
            <div className="flex items-center border-b border-border min-w-[800px]">
              <div className="w-[200px] flex-shrink-0 p-3 border-r border-border">
                <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Project</span>
              </div>
              <div className="flex-1 flex">
                {Array.from({ length: Math.ceil(maxWeek / 4) }, (_, i) => (
                  <div key={i} className="flex-1 p-2 text-center border-r border-border last:border-r-0">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      Month {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project rows */}
            {PORTFOLIO_PROJECTS.map((proj, pi) => (
              <div
                key={proj.id}
                className={`flex items-center min-w-[800px] ${pi > 0 ? "border-t border-border" : ""}`}
              >
                <div className="w-[200px] flex-shrink-0 p-3 border-r border-border">
                  <p className="text-xs text-foreground font-medium truncate">{proj.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm ${STATUS_STYLES[proj.status]}`}>
                      {proj.status.replace("-", " ")}
                    </span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">{proj.progress}%</span>
                  </div>
                </div>
                <div className="flex-1 relative h-14">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex">
                    {Array.from({ length: maxWeek }, (_, i) => (
                      <div
                        key={i}
                        className={`flex-1 ${(i + 1) % 4 === 0 ? "border-r border-border/50" : ""}`}
                      />
                    ))}
                  </div>
                  {/* Bar */}
                  <motion.div
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 + pi * 0.08 }}
                    className={`absolute top-2.5 bottom-2.5 rounded-sm flex items-center px-2 ${
                      proj.status === "blocked"
                        ? "bg-[hsl(var(--status-danger)/0.15)]"
                        : proj.status === "at-risk"
                        ? "bg-[hsl(var(--status-warning)/0.15)]"
                        : "bg-foreground/10"
                    }`}
                    style={{
                      left: `${((proj.startWeek - 1) / maxWeek) * 100}%`,
                      width: `${((proj.endWeek - proj.startWeek + 1) / maxWeek) * 100}%`,
                    }}
                  >
                    {/* Progress fill */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 rounded-sm ${
                        proj.status === "blocked"
                          ? "bg-[hsl(var(--status-danger)/0.25)]"
                          : proj.status === "at-risk"
                          ? "bg-[hsl(var(--status-warning)/0.25)]"
                          : "bg-foreground/15"
                      }`}
                      style={{ width: `${proj.progress}%` }}
                    />
                    <span className="text-[9px] text-foreground/60 relative z-10 truncate">
                      W{proj.startWeek}–W{proj.endWeek}
                    </span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Swarm Alerts */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-14"
        >
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-muted-foreground tracking-[0.1em] font-sans text-sm tabular-nums">02</span>
            <h2 className="font-serif text-2xl text-foreground">Swarm Alerts</h2>
            <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground ml-auto">
              {SWARM_ALERTS.filter((a) => a.severity === "critical").length} critical · {SWARM_ALERTS.filter((a) => a.severity === "warning").length} warnings
            </span>
          </div>

          <div className="space-y-3">
            {SWARM_ALERTS.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                expanded={expandedAlert === alert.id}
                onToggle={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
              />
            ))}
          </div>
        </motion.section>

        {/* Resource Contention */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-14"
        >
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-muted-foreground tracking-[0.1em] font-sans text-sm tabular-nums">03</span>
            <h2 className="font-serif text-2xl text-foreground">Resource Contention</h2>
          </div>

          <div className="border border-border overflow-x-auto">
            {/* Header */}
            <div className="grid grid-cols-[200px_1fr_100px] border-b border-border min-w-[600px]">
              <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Person</div>
              <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border">Allocated to</div>
              <div className="p-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground border-l border-border">Severity</div>
            </div>
            {RESOURCE_CONFLICTS.map((conflict, i) => (
              <div
                key={conflict.employeeId}
                className={`grid grid-cols-[200px_1fr_100px] min-w-[600px] ${i > 0 ? "border-t border-border" : ""}`}
              >
                <div className="p-3">
                  <p className="text-xs text-foreground font-medium">{conflict.employee.name}</p>
                  <p className="text-[10px] text-muted-foreground">{conflict.employee.role}</p>
                </div>
                <div className="p-3 border-l border-border">
                  <div className="flex flex-wrap gap-1.5">
                    {conflict.projects.map((proj) => (
                      <span key={proj.projectId} className="text-[10px] px-2 py-0.5 border border-border text-foreground/80 rounded-sm">
                        {proj.projectName}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 border-l border-border flex items-center">
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                    conflict.severity === "critical" ? SEVERITY_DOT.critical : SEVERITY_DOT.warning
                  }`} />
                  <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {conflict.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Budget Burn */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-muted-foreground tracking-[0.1em] font-sans text-sm tabular-nums">04</span>
            <h2 className="font-serif text-2xl text-foreground">Budget Burn</h2>
          </div>

          <div className="border border-border">
            {/* Summary bar */}
            <div className="p-5 border-b border-border">
              <div className="flex items-baseline justify-between mb-3">
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Total: £{(PORTFOLIO_TOTALS.totalBudget / 1000).toFixed(0)}k committed
                </p>
                <p className="text-sm text-foreground tabular-nums font-sans">
                  £{(PORTFOLIO_TOTALS.totalSpent / 1000).toFixed(0)}k spent ({Math.round(PORTFOLIO_TOTALS.totalSpent / PORTFOLIO_TOTALS.totalBudget * 100)}%)
                </p>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(PORTFOLIO_TOTALS.totalSpent / PORTFOLIO_TOTALS.totalBudget) * 100}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-foreground/30 rounded-full"
                />
              </div>
            </div>

            {/* Per-project bars */}
            <div className="divide-y divide-border">
              {PORTFOLIO_PROJECTS.map((proj) => {
                const pct = Math.round((proj.spent / proj.budget) * 100);
                const overBurn = pct > proj.progress + 15;
                return (
                  <div key={proj.id} className="p-4 flex items-center gap-4">
                    <div className="w-[180px] flex-shrink-0">
                      <p className="text-xs text-foreground font-medium truncate">{proj.name}</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            overBurn ? "bg-[hsl(var(--status-danger))]" : "bg-foreground/25"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-[120px] flex-shrink-0 text-right">
                      <span className="text-xs tabular-nums text-foreground/80">
                        £{(proj.spent / 1000).toFixed(0)}k / £{(proj.budget / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

function AlertCard({ alert, expanded, onToggle }: { alert: SwarmAlert; expanded: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left border border-border border-l-[3px] p-4 transition-colors hover:bg-muted/30 ${SEVERITY_STYLES[alert.severity]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${SEVERITY_DOT[alert.severity]}`} />
          <div className="min-w-0">
            <p className="text-sm text-foreground font-medium">{alert.title}</p>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 space-y-3"
              >
                <p className="text-xs text-foreground/70 leading-relaxed">{alert.detail}</p>
                <div className="border-t border-border pt-3">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1">Recommendation</p>
                  <p className="text-xs text-foreground/80 leading-relaxed">{alert.recommendation}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
        )}
      </div>
    </button>
  );
}

export default Portfolio;
