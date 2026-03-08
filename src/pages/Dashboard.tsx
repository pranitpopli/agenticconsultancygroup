import { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, TrendingUp, Zap, ArrowRight, Building2, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BriefingNav from "@/components/BriefingNav";
import EmptyState from "@/components/EmptyState";
import { BRIEFING_SUMMARIES } from "@/lib/briefingData";
import { useBriefingStore } from "@/lib/briefingStore";
import { PORTFOLIO_PROJECTS, SWARM_ALERTS, PORTFOLIO_TOTALS } from "@/lib/portfolioData";
import { SWARM_INSIGHTS, INSIGHT_SUMMARY } from "@/lib/insightsData";
import { OQR_DATA } from "@/lib/oqrData";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const decisions = useBriefingStore((s) => s.decisions);
  const firstName = user?.name?.split(" ")[0] || "there";

  // Briefs awaiting decision (not yet approved/deferred)
  const awaitingBriefs = useMemo(
    () => BRIEFING_SUMMARIES.filter((b) => !decisions[b.id] && b.status === "analysis-complete"),
    [decisions]
  );

  // Projects at risk
  const atRiskProjects = useMemo(
    () => PORTFOLIO_PROJECTS.filter((p) => p.status === "at-risk" || p.status === "blocked"),
    []
  );

  // Critical alerts
  const criticalAlerts = useMemo(
    () => SWARM_ALERTS.filter((a) => a.severity === "critical"),
    []
  );

  // Top insight
  const topInsight = SWARM_INSIGHTS.find((i) => i.severity === "critical" || i.severity === "high");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <div className="min-h-screen bg-background">
      <BriefingNav />

      <motion.main
        id="main-content"
        className="max-w-[900px] mx-auto px-4 sm:px-8 pt-28 pb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="font-serif text-3xl text-foreground mb-2">
            {getGreeting()}, {firstName}.
          </h1>
          <p className="text-sm text-muted-foreground">
            Here's what needs your attention today.
          </p>
        </motion.div>

        {/* Quick stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Briefs awaiting", value: awaitingBriefs.length, icon: Zap },
            { label: "Active projects", value: PORTFOLIO_TOTALS.activeProjects, icon: Building2 },
            { label: "Quarterly savings", value: `£${(OQR_DATA.totalSavings / 1000).toFixed(0)}k`, icon: TrendingUp },
            { label: "Org maturity", value: `${OQR_DATA.orgMaturity}%`, icon: TrendingUp },
          ].map((stat) => (
            <div key={stat.label} className="border border-border p-5 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <stat.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="text-[10px] uppercase tracking-[0.12em]">{stat.label}</span>
              </div>
              <p className="text-2xl font-sans tabular-nums text-foreground">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Briefs awaiting decision */}
        {awaitingBriefs.length > 0 ? (
          <motion.section variants={itemVariants} className="mb-12">
            <div className="flex items-baseline justify-between mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-muted-foreground tracking-[0.1em] font-sans text-sm tabular-nums">01</span>
                <h2 className="font-serif text-2xl text-foreground">Briefs Awaiting Decision</h2>
              </div>
              <button
                onClick={() => navigate("/briefings")}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View all <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
              </button>
            </div>
            <div className="space-y-3">
              {awaitingBriefs.slice(0, 3).map((brief) => (
                <button
                  key={brief.id}
                  onClick={() => navigate(`/briefings?view=briefing-doc&brief=${brief.id}`)}
                  className="w-full text-left border border-border p-5 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-foreground font-medium group-hover:text-foreground">{brief.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{brief.aiSummary}</p>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Submitted by {brief.submittedBy.name} · {brief.dateReceived}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground mt-1 shrink-0 transition-colors" strokeWidth={1.5} />
                  </div>
                </button>
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section variants={itemVariants} className="mb-12">
            <EmptyState
              icon={FileText}
              title="All caught up"
              description="No briefs awaiting your decision right now. Submit a new brief to get started."
              action={{ label: "Go to Briefings", onClick: () => navigate("/briefings") }}
            />
          </motion.section>
        )}

        {/* Projects at risk */}
        {atRiskProjects.length > 0 && (
          <motion.section variants={itemVariants} className="mb-12">
            <div className="flex items-baseline justify-between mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-muted-foreground tracking-[0.1em] font-sans text-sm tabular-nums">02</span>
                <h2 className="font-serif text-2xl text-foreground">Projects at Risk</h2>
              </div>
              <button
                onClick={() => navigate("/organisation?tab=portfolio")}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Portfolio <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
              </button>
            </div>
            <div className="space-y-3">
              {atRiskProjects.slice(0, 3).map((proj) => (
                <div
                  key={proj.id}
                  className="border border-border p-5 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-[hsl(var(--status-warning))]" strokeWidth={1.5} />
                      <p className="text-sm text-foreground font-medium">{proj.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {proj.progress}% complete · £{(proj.spent / 1000).toFixed(0)}k / £{(proj.budget / 1000).toFixed(0)}k budget
                    </p>
                  </div>
                  <span className={`text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 border ${
                    proj.status === "blocked"
                      ? "border-[hsl(var(--status-danger)/0.3)] text-[hsl(var(--status-danger))]"
                      : "border-[hsl(var(--status-warning)/0.3)] text-[hsl(var(--status-warning))]"
                  }`}>
                    {proj.status.replace("-", " ")}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Critical alerts */}
        {criticalAlerts.length > 0 && (
          <motion.section variants={itemVariants} className="mb-12">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-muted-foreground tracking-[0.1em] font-sans text-sm tabular-nums">03</span>
              <h2 className="font-serif text-2xl text-foreground">Critical Alerts</h2>
            </div>
            <div className="space-y-3">
              {criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="border border-border border-l-[3px] border-l-[hsl(var(--status-danger))] p-5"
                >
                  <p className="text-sm text-foreground font-medium mb-1">{alert.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{alert.recommendation}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Top insight */}
        {topInsight && (
          <motion.section variants={itemVariants}>
            <div className="flex items-baseline justify-between mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-muted-foreground tracking-[0.1em] font-sans text-sm tabular-nums">04</span>
                <h2 className="font-serif text-2xl text-foreground">Top Insight</h2>
              </div>
              <button
                onClick={() => navigate("/organisation?tab=insights")}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                All insights <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
              </button>
            </div>
            <button
              onClick={() => navigate("/organisation?tab=insights")}
              className="w-full text-left border border-border p-5 hover:bg-muted/30 transition-colors group"
            >
              <p className="text-sm text-foreground font-medium">{topInsight.title}</p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">{topInsight.detail}</p>
              <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
                <span>Impact: <span className="text-foreground">{topInsight.estimatedImpact}</span></span>
                <span>Confidence: <span className="text-foreground tabular-nums">{Math.round(topInsight.confidence * 100)}%</span></span>
              </div>
            </button>
          </motion.section>
        )}
      </motion.main>
    </div>
  );
};

export default Dashboard;
