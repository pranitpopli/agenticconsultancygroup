import { motion } from "framer-motion";
import { TrendingUp, Building2, Users, Zap } from "lucide-react";
import { OQR_DATA } from "@/lib/oqrData";
import { EMPLOYEES } from "@/lib/simulatedData";
import BriefingNav from "@/components/BriefingNav";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const capabilityData = [
  { domain: "Engineering", coverage: 82 },
  { domain: "Data & ML", coverage: 74 },
  { domain: "Design", coverage: 45 },
  { domain: "Infrastructure", coverage: 68 },
  { domain: "Security", coverage: 38 },
  { domain: "Quality", coverage: 52 },
];

const OQR = () => {
  const {
    totalSavings,
    previousQuarterSavings,
    currentQuarter,
    financialBreakdown,
    cfoSummary,
    aiProjects,
    activeDepartmentCount,
    orgMaturity,
    maturityDelta,
    departmentsCrossed,
    departments,
  } = OQR_DATA;

  const liveProjects = aiProjects.filter((p) => p.status === "live").length;
  const inBuild = aiProjects.filter((p) => p.status === "in-build").length;
  const completed = aiProjects.filter((p) => p.status === "completed").length;
  const savingsDelta = Math.round(((totalSavings - previousQuarterSavings) / previousQuarterSavings) * 100);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  const maturityChartData = departments.map((d) => ({
    dept: d.name,
    score: d.score,
    projected: Math.min(100, d.score + 15),
  }));

  const kpis = [
    {
      icon: TrendingUp,
      label: "Quarterly Savings",
      value: `£${(totalSavings / 1000).toFixed(0)}k`,
      sub: `+${savingsDelta}% vs last quarter`,
    },
    {
      icon: Building2,
      label: "Active Projects",
      value: `${liveProjects}`,
      sub: `${inBuild} in build`,
    },
    {
      icon: Users,
      label: "Headcount",
      value: `${liveProjects + inBuild + completed}`,
      sub: `${activeDepartmentCount} departments`,
    },
    {
      icon: Zap,
      label: "AI Maturity",
      value: `${orgMaturity}%`,
      sub: `+${maturityDelta} pts this quarter`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <BriefingNav activeTab="oqr" onTabChange={() => {}} />

      <motion.div
        className="max-w-[1000px] mx-auto px-8 pt-28 pb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ━━━ HEADING ━━━ */}
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="font-serif text-3xl text-foreground mb-1">
            Organisation Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            {currentQuarter} · Live snapshot
          </p>
        </motion.div>

        {/* ━━━ KPI CARDS ━━━ */}
        <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4 mb-10">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="border border-border bg-card rounded-lg shadow-sm p-5 space-y-3"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <kpi.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="text-[11px] text-muted-foreground">{kpi.label}</span>
              </div>
              <p className="font-serif text-3xl text-foreground leading-none">
                {kpi.value}
              </p>
              <p className="text-[11px] text-muted-foreground">{kpi.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* ━━━ TWO SPIDER CHARTS ━━━ */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-10">
          {/* Department Maturity */}
          <div className="border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                <span className="font-serif text-sm text-foreground">Department Maturity</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-[2px] bg-foreground inline-block" /> Current
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-[2px] border-t-2 border-dashed border-[hsl(var(--status-warning))] inline-block" /> Projected
                </span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">
              Current vs projected maturity based on active initiatives
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={maturityChartData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(35 15% 88%)" />
                <PolarAngleAxis
                  dataKey="dept"
                  tick={{ fontSize: 10, fill: "hsl(0 0% 45%)" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 8, fill: "hsl(0 0% 60%)" }}
                  axisLine={false}
                />
                <Tooltip
                  content={({ payload, label }) => {
                    if (!payload?.length) return null;
                    return (
                      <div className="bg-card border border-border px-3 py-2 shadow-sm">
                        <p className="text-[11px] font-serif text-foreground mb-1">{label}</p>
                        {payload.map((p: any) => (
                          <p key={p.name} className="text-[10px] text-muted-foreground">
                            {p.name}: <span className="text-foreground font-mono">{p.value}%</span>
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Radar
                  name="Projected"
                  dataKey="projected"
                  stroke="hsl(38 35% 58%)"
                  fill="hsl(38 35% 58%)"
                  fillOpacity={0.06}
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                  isAnimationActive
                  animationDuration={1200}
                />
                <Radar
                  name="Current"
                  dataKey="score"
                  stroke="hsl(0 0% 10%)"
                  fill="hsl(0 0% 10%)"
                  fillOpacity={0.08}
                  strokeWidth={1.5}
                  isAnimationActive
                  animationDuration={1000}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Capability Coverage */}
          <div className="border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
              <span className="font-serif text-sm text-foreground">Capability Coverage</span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">
              % of workforce with skills in each domain
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={capabilityData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(35 15% 88%)" />
                <PolarAngleAxis
                  dataKey="domain"
                  tick={{ fontSize: 10, fill: "hsl(0 0% 45%)" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 8, fill: "hsl(0 0% 60%)" }}
                  axisLine={false}
                />
                <Tooltip
                  content={({ payload, label }) => {
                    if (!payload?.length) return null;
                    return (
                      <div className="bg-card border border-border px-3 py-2 shadow-sm">
                        <p className="text-[11px] font-serif text-foreground mb-1">{label}</p>
                        {payload.map((p: any) => (
                          <p key={p.name} className="text-[10px] text-muted-foreground">
                            {p.name}: <span className="text-foreground font-mono">{p.value}%</span>
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Radar
                  name="Coverage"
                  dataKey="coverage"
                  stroke="hsl(38 55% 50%)"
                  fill="hsl(38 55% 50%)"
                  fillOpacity={0.1}
                  strokeWidth={1.5}
                  isAnimationActive
                  animationDuration={1200}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ━━━ FINANCIAL BREAKDOWN ━━━ */}
        <motion.div variants={itemVariants} className="border border-border bg-card p-6 mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
            Savings breakdown
          </p>
          <div className="space-y-3 mb-4">
            {financialBreakdown.map((item) => {
              const pct = Math.round((item.amount / totalSavings) * 100);
              return (
                <div key={item.label} className="flex items-center gap-4">
                  <span className="text-[11px] text-muted-foreground w-40 shrink-0">
                    {item.label}
                  </span>
                  <div className="flex-1 h-[3px] bg-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-foreground/20 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                  <span className="text-[11px] text-foreground font-mono w-14 text-right">
                    £{(item.amount / 1000).toFixed(0)}k
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground/70 italic font-serif">
            {cfoSummary}
          </p>
        </motion.div>

        {/* ━━━ AI PROJECTS ━━━ */}
        <motion.div variants={itemVariants} className="border border-border bg-card p-6 mb-10">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              AI projects in flight
            </p>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span>{liveProjects} live</span>
              <span>{inBuild} in build</span>
              <span>{completed} completed</span>
            </div>
          </div>
          <div className="space-y-2">
            {aiProjects.map((proj) => (
              <div
                key={proj.id}
                className="flex items-center justify-between border border-border px-4 py-3"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[12px] text-foreground">{proj.name}</span>
                  <span className="text-[10px] text-muted-foreground">{proj.department}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground">{proj.capability}</span>
                  <span
                    className={`text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 border ${
                      proj.status === "live"
                        ? "border-[hsl(var(--status-positive)/0.3)] text-[hsl(var(--status-positive))]"
                        : proj.status === "in-build"
                        ? "border-[hsl(var(--status-warning)/0.3)] text-[hsl(var(--status-warning))]"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {proj.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ━━━ DEPARTMENT MATURITY BARS ━━━ */}
        <motion.div variants={itemVariants} className="border border-border bg-card p-6 mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
            Org shift index · {orgMaturity}%
          </p>
          <div className="space-y-2.5 mb-4">
            {[...departments]
              .sort((a, b) => b.score - a.score)
              .map((dept) => (
                <div key={dept.name} className="flex items-center gap-4">
                  <span className="text-[11px] text-muted-foreground w-32 shrink-0">
                    {dept.name}
                  </span>
                  <div className="flex-1 h-[3px] bg-border rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        dept.stage === "ai-led"
                          ? "bg-[hsl(var(--status-positive))]"
                          : dept.stage === "ai-augmented"
                          ? "bg-foreground/25"
                          : "bg-foreground/10"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.score}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 w-20 text-right capitalize">
                    {dept.stage.replace("-", " ")}
                  </span>
                </div>
              ))}
          </div>
          <p className="text-[11px] text-muted-foreground/70">
            +{maturityDelta} pts this quarter — {departmentsCrossed} departments crossed into
            AI-Augmented.
          </p>
        </motion.div>

        {/* ━━━ FOOTER ━━━ */}
        <motion.p
          variants={itemVariants}
          className="text-xs text-muted-foreground/50 italic text-center font-serif"
        >
          Swarm last scanned {EMPLOYEES.length} nodes across Meridian Group — 4 minutes ago.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default OQR;
