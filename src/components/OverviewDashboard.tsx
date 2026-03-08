import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Briefcase,
  ArrowUpRight,
  AlertTriangle,
  ChevronRight,
  CircleDot,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { OQR_DATA } from "@/lib/oqrData";
import { EMPLOYEES } from "@/lib/simulatedData";
import { BRIEFING_SUMMARIES } from "@/lib/briefingData";

const formatCurrency = (n: number) => `£${(n / 1000).toFixed(0)}k`;

const priorityColor: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-amber-100 text-amber-700",
  medium: "bg-sky-100 text-sky-700",
  low: "bg-stone-100 text-stone-500",
};

const availabilityLabel: Record<string, { text: string; style: string }> = {
  available: { text: "Available", style: "text-emerald-600" },
  partial: { text: "Partial", style: "text-amber-600" },
  committed: { text: "Committed", style: "text-red-500" },
};

const OverviewDashboard = () => {
  const {
    totalSavings,
    previousQuarterSavings,
    currentQuarter,
    orgMaturity,
    maturityDelta,
    departments,
    aiProjects,
    cfoSummary,
  } = OQR_DATA;
  const savingsDelta = totalSavings - previousQuarterSavings;
  const savingsGrowth = ((savingsDelta / previousQuarterSavings) * 100).toFixed(0);

  // Active projects deduped with risk signals
  const activeProjects = EMPLOYEES.flatMap((emp) =>
    emp.pastProjects
      .filter((p) => p.status === "active")
      .map((p) => ({ ...p, owner: emp.name, department: emp.department, availability: emp.availability }))
  );
  const uniqueProjects = Array.from(
    activeProjects.reduce((map, p) => {
      if (!map.has(p.name)) {
        map.set(p.name, { ...p, people: [p.owner], availabilities: [p.availability] });
      } else {
        const existing = map.get(p.name)!;
        existing.people.push(p.owner);
        existing.availabilities.push(p.availability);
      }
      return map;
    }, new Map<string, any>())
  ).map(([, v]) => v);

  // Risk: critical projects where people are only partially available or committed
  const riskyProjects = uniqueProjects.filter(
    (p) =>
      (p.priority === "critical" || p.priority === "high") &&
      p.availabilities.some((a: string) => a === "partial" || a === "committed")
  );

  // Dept capacity: available / partial / committed counts
  const deptGroups = EMPLOYEES.reduce<Record<string, typeof EMPLOYEES>>((acc, emp) => {
    (acc[emp.department] ??= []).push(emp);
    return acc;
  }, {});

  const deptCapacity = Object.entries(deptGroups).map(([dept, members]) => {
    const available = members.filter((m) => m.availability === "available").length;
    const partial = members.filter((m) => m.availability === "partial").length;
    const committed = members.filter((m) => m.availability === "committed").length;
    return { dept, total: members.length, available, partial, committed };
  });

  // Spider chart — projected maturity
  const projectBoost = aiProjects.reduce<Record<string, number>>((acc, proj) => {
    const boost = proj.status === "in-build" ? 8 : proj.status === "live" ? 5 : 0;
    acc[proj.department] = (acc[proj.department] || 0) + boost;
    return acc;
  }, {});

  const radarData = departments.map((d) => ({
    department: d.name.length > 12 ? d.name.slice(0, 10) + "…" : d.name,
    fullName: d.name,
    score: d.score,
    projected: Math.min(100, d.score + (projectBoost[d.name] || 0)),
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <motion.div
      className="pt-24 pb-20 px-6 sm:px-8 max-w-[1200px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl text-foreground mb-0.5">
          Organisation Overview
        </h1>
        <p className="font-sans text-sm text-muted-foreground tracking-wide">
          {currentQuarter} · Live snapshot
        </p>
      </motion.div>

      {/* ━━━ SECTION 1: REQUIRES YOUR ATTENTION ━━━ */}
      {(BRIEFING_SUMMARIES.length > 0 || riskyProjects.length > 0) && (
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3">
            Requires your attention
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Briefs awaiting decision */}
            {BRIEFING_SUMMARIES.map((brief) => {
              const statusLabel: Record<string, { text: string; style: string }> = {
                "analysis-complete": { text: "Ready for decision", style: "bg-emerald-100 text-emerald-700" },
                "swarm-ready": { text: "Awaiting review", style: "bg-sky-100 text-sky-700" },
                "swarm-searching": { text: "Processing", style: "bg-amber-100 text-amber-700" },
              };
              const s = statusLabel[brief.status] ?? statusLabel["swarm-searching"];
              return (
                <div
                  key={brief.id}
                  className="border border-border rounded-lg p-4 bg-card/60 flex items-start gap-3 cursor-pointer hover:bg-card/80 transition-colors"
                >
                  <CircleDot size={14} className="text-accent shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="font-sans text-[13px] font-medium text-foreground leading-tight truncate">
                        {brief.title}
                      </p>
                      <span className={`font-sans text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${s.style}`}>
                        {s.text}
                      </span>
                    </div>
                    <p className="font-sans text-[11px] text-muted-foreground">
                      Submitted by {brief.submittedBy.name} · {brief.dateReceived}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                      {brief.aiSummary}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground shrink-0 mt-0.5" />
                </div>
              );
            })}

            {/* Risk alerts */}
            {riskyProjects.map((proj, i) => {
              const partialCount = proj.availabilities.filter((a: string) => a !== "available").length;
              return (
                <div
                  key={`risk-${i}`}
                  className="border border-red-200 rounded-lg p-4 bg-red-50/40 flex items-start gap-3"
                >
                  <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-sans text-[13px] font-medium text-foreground leading-tight">
                      {proj.name}
                    </p>
                    <p className="font-sans text-[11px] text-red-600 mt-0.5">
                      {proj.priority} priority · {partialCount} of {proj.people.length} team members have limited availability
                    </p>
                  </div>
                  <span className={`font-sans text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${priorityColor[proj.priority]}`}>
                    {proj.priority}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ━━━ SECTION 2: KPIs ━━━ */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <KPICard
          label="Cost Avoided"
          value={formatCurrency(totalSavings)}
          delta={`+${savingsGrowth}%`}
          deltaLabel="vs last quarter"
        />
        <KPICard
          label="Active Projects"
          value={String(aiProjects.filter((p) => p.status === "live").length)}
          delta={`${aiProjects.filter((p) => p.status === "in-build").length}`}
          deltaLabel="in pipeline"
        />
        <KPICard
          label="Available Capacity"
          value={`${EMPLOYEES.filter((e) => e.availability === "available").length}/${EMPLOYEES.length}`}
          delta={`${EMPLOYEES.filter((e) => e.availability === "partial").length}`}
          deltaLabel="partially committed"
        />
        <KPICard
          label="AI Maturity"
          value={`${orgMaturity}%`}
          delta={`+${maturityDelta}`}
          deltaLabel="pts this quarter"
        />
      </motion.div>
      <motion.p variants={itemVariants} className="font-sans text-[11px] text-muted-foreground mb-8 leading-relaxed">
        {cfoSummary}
      </motion.p>

      {/* ━━━ SECTION 3: STRATEGIC VIEW — Maturity Spider ━━━ */}
      <motion.div variants={itemVariants} className="border border-border rounded-lg p-5 bg-card/60 mb-8">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="font-sans text-sm font-medium text-foreground flex items-center gap-2">
              <TrendingUp size={14} className="text-muted-foreground" />
              Strategic Maturity — Current vs Projected
            </h2>
            <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
              Projected gains based on {aiProjects.filter((p) => p.status === "live" || p.status === "in-build").length} active AI initiatives
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full bg-foreground/80 inline-block" />
              <span className="font-sans text-[10px] text-muted-foreground">Current</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full inline-block" style={{ backgroundColor: "hsl(38 80% 55%)" }} />
              <span className="font-sans text-[10px] text-muted-foreground">Projected</span>
            </span>
          </div>
        </div>
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
              <PolarGrid stroke="hsl(35 15% 88%)" />
              <PolarAngleAxis
                dataKey="department"
                tick={{ fontSize: 10, fontFamily: "DM Sans", fill: "hsl(0 0% 45%)" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 9, fontFamily: "DM Sans", fill: "hsl(0 0% 55%)" }}
                tickCount={5}
              />
              <Radar name="Current" dataKey="score" stroke="hsl(0 0% 10%)" fill="hsl(0 0% 10%)" fillOpacity={0.1} strokeWidth={1.5} />
              <Radar name="Projected" dataKey="projected" stroke="hsl(38 80% 55%)" fill="hsl(38 80% 55%)" fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="4 3" />
              <Tooltip
                contentStyle={{ fontFamily: "DM Sans", fontSize: 12, borderRadius: 6, border: "1px solid hsl(35 15% 88%)", backgroundColor: "#FAF8F4" }}
                formatter={(value: number, name: string) => [`${value}`, name === "score" ? "Current" : name === "projected" ? "Projected" : name]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ━━━ SECTION 4: OPERATIONAL — Projects + Capacity side by side ━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Current Projects with risk */}
        <motion.section variants={itemVariants} className="border border-border rounded-lg p-5 bg-card/60">
          <h2 className="font-sans text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Briefcase size={14} className="text-muted-foreground" />
            Active Projects
          </h2>
          <div className="space-y-0.5">
            {uniqueProjects
              .sort((a: any, b: any) => {
                const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
                return (order[a.priority] ?? 4) - (order[b.priority] ?? 4);
              })
              .map((proj: any, i: number) => {
                const hasRisk = proj.availabilities.some((a: string) => a !== "available") && (proj.priority === "critical" || proj.priority === "high");
                return (
                  <div key={i} className={`flex items-center justify-between gap-3 py-2.5 border-b border-border/40 last:border-0 ${hasRisk ? "bg-red-50/30 -mx-2 px-2 rounded" : ""}`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {hasRisk && <AlertTriangle size={11} className="text-red-400 shrink-0" />}
                        <p className="font-sans text-[13px] font-medium text-foreground leading-tight truncate">
                          {proj.name}
                        </p>
                      </div>
                      <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                        {proj.department} · {proj.people.length} {proj.people.length === 1 ? "person" : "people"}
                      </p>
                    </div>
                    {proj.priority && (
                      <span className={`font-sans text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${priorityColor[proj.priority]}`}>
                        {proj.priority}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </motion.section>

        {/* Department Capacity */}
        <motion.section variants={itemVariants} className="border border-border rounded-lg p-5 bg-card/60">
          <h2 className="font-sans text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Users size={14} className="text-muted-foreground" />
            Department Capacity
          </h2>
          <div className="space-y-3">
            {deptCapacity
              .sort((a, b) => b.total - a.total)
              .map((dept) => (
                <div key={dept.dept}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-sans text-xs font-medium text-foreground">{dept.dept}</span>
                    <span className="font-sans text-[10px] tabular-nums text-muted-foreground">
                      {dept.total} people
                    </span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                    {dept.available > 0 && (
                      <div
                        className="bg-emerald-400 h-full"
                        style={{ width: `${(dept.available / dept.total) * 100}%` }}
                        title={`${dept.available} available`}
                      />
                    )}
                    {dept.partial > 0 && (
                      <div
                        className="bg-amber-300 h-full"
                        style={{ width: `${(dept.partial / dept.total) * 100}%` }}
                        title={`${dept.partial} partial`}
                      />
                    )}
                    {dept.committed > 0 && (
                      <div
                        className="bg-red-300 h-full"
                        style={{ width: `${(dept.committed / dept.total) * 100}%` }}
                        title={`${dept.committed} committed`}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {dept.available > 0 && (
                      <span className="font-sans text-[10px] text-emerald-600 tabular-nums">{dept.available} available</span>
                    )}
                    {dept.partial > 0 && (
                      <span className="font-sans text-[10px] text-amber-600 tabular-nums">{dept.partial} partial</span>
                    )}
                    {dept.committed > 0 && (
                      <span className="font-sans text-[10px] text-red-500 tabular-nums">{dept.committed} committed</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/40">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span className="font-sans text-[10px] text-muted-foreground">Available</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-300" /><span className="font-sans text-[10px] text-muted-foreground">Partial</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-300" /><span className="font-sans text-[10px] text-muted-foreground">Committed</span></span>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

const KPICard = ({
  label,
  value,
  delta,
  deltaLabel,
}: {
  label: string;
  value: string;
  delta: string;
  deltaLabel: string;
}) => (
  <div className="border border-border rounded-lg p-4 sm:p-5 bg-card/60">
    <span className="font-sans text-[11px] text-muted-foreground tracking-wide">{label}</span>
    <p className="font-sans text-2xl sm:text-3xl font-semibold tabular-nums text-foreground leading-none mt-1.5">
      {value}
    </p>
    <p className="font-sans text-[11px] text-muted-foreground mt-1.5">
      <span className="font-medium text-foreground/70">{delta}</span>{" "}
      {deltaLabel}
    </p>
  </div>
);

export default OverviewDashboard;
