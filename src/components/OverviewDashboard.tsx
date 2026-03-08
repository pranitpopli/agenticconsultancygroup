import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Briefcase,
  FileText,
  Building2,
  ArrowUpRight,
  Clock,
  ChevronRight,
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

const statusDot: Record<string, string> = {
  live: "bg-emerald-500",
  "in-build": "bg-amber-400",
  completed: "bg-stone-300",
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
  } = OQR_DATA;
  const savingsDelta = totalSavings - previousQuarterSavings;
  const savingsGrowth = ((savingsDelta / previousQuarterSavings) * 100).toFixed(0);

  // Active projects deduped
  const activeProjects = EMPLOYEES.flatMap((emp) =>
    emp.pastProjects
      .filter((p) => p.status === "active")
      .map((p) => ({ ...p, owner: emp.name, department: emp.department }))
  );
  const uniqueProjects = Array.from(
    activeProjects.reduce((map, p) => {
      if (!map.has(p.name)) {
        map.set(p.name, { ...p, people: [p.owner] });
      } else {
        map.get(p.name)!.people.push(p.owner);
      }
      return map;
    }, new Map<string, any>())
  ).map(([, v]) => v);

  // Org structure
  const deptGroups = EMPLOYEES.reduce<Record<string, typeof EMPLOYEES>>((acc, emp) => {
    (acc[emp.department] ??= []).push(emp);
    return acc;
  }, {});

  // Spider chart data — department maturity
  // Projected maturity: active AI projects boost their department's score
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

  // Spider chart data — capability coverage (skills across org)
  const capabilityDimensions = [
    { key: "Engineering", skills: ["React", "TypeScript", "Node.js", "Go", "Microservices"] },
    { key: "Data & ML", skills: ["Python", "Machine Learning", "TensorFlow", "PyTorch", "SQL"] },
    { key: "Design", skills: ["Figma", "User Research", "Design Systems", "Prototyping"] },
    { key: "Infrastructure", skills: ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD"] },
    { key: "Security", skills: ["Security Architecture", "Penetration Testing", "OWASP", "IAM"] },
    { key: "Quality", skills: ["Test Automation", "Cypress", "Performance Testing"] },
  ];

  const capabilityData = capabilityDimensions.map((dim) => {
    const matchCount = EMPLOYEES.filter((emp) =>
      emp.skills.some((s) => dim.skills.includes(s))
    ).length;
    return {
      department: dim.key,
      coverage: Math.round((matchCount / EMPLOYEES.length) * 100),
    };
  });

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

      {/* KPI Strip */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
      >
        <KPICard
          icon={<TrendingUp size={16} />}
          label="Quarterly Savings"
          value={formatCurrency(totalSavings)}
          delta={`+${savingsGrowth}%`}
          deltaLabel="vs last quarter"
        />
        <KPICard
          icon={<Briefcase size={16} />}
          label="Active Projects"
          value={String(aiProjects.filter((p) => p.status === "live").length)}
          delta={`${aiProjects.filter((p) => p.status === "in-build").length}`}
          deltaLabel="in build"
        />
        <KPICard
          icon={<Users size={16} />}
          label="Headcount"
          value={String(EMPLOYEES.length)}
          delta={String(Object.keys(deptGroups).length)}
          deltaLabel="departments"
        />
        <KPICard
          icon={<ArrowUpRight size={16} />}
          label="AI Maturity"
          value={`${orgMaturity}%`}
          delta={`+${maturityDelta}`}
          deltaLabel="pts this quarter"
        />
      </motion.div>

      {/* Spider Diagrams Row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8"
      >
        {/* Dept Maturity Radar */}
        <div className="border border-border rounded-lg p-5 bg-card/60">
          <h2 className="font-sans text-sm font-medium text-foreground mb-1 flex items-center gap-2">
            <TrendingUp size={14} className="text-muted-foreground" />
            Department Maturity
          </h2>
          <p className="font-sans text-[11px] text-muted-foreground mb-4">
            AI adoption score by department (0–100)
          </p>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
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
                <Radar
                  name="Maturity"
                  dataKey="score"
                  stroke="hsl(0 0% 10%)"
                  fill="hsl(0 0% 10%)"
                  fillOpacity={0.12}
                  strokeWidth={1.5}
                />
                <Tooltip
                  contentStyle={{
                    fontFamily: "DM Sans",
                    fontSize: 12,
                    borderRadius: 6,
                    border: "1px solid hsl(35 15% 88%)",
                    backgroundColor: "#FAF8F4",
                  }}
                  formatter={(value: number) => [`${value}`, "Score"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Capability Coverage Radar */}
        <div className="border border-border rounded-lg p-5 bg-card/60">
          <h2 className="font-sans text-sm font-medium text-foreground mb-1 flex items-center gap-2">
            <Users size={14} className="text-muted-foreground" />
            Capability Coverage
          </h2>
          <p className="font-sans text-[11px] text-muted-foreground mb-4">
            % of workforce with skills in each domain
          </p>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={capabilityData} cx="50%" cy="50%" outerRadius="70%">
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
                <Radar
                  name="Coverage"
                  dataKey="coverage"
                  stroke="hsl(38 80% 55%)"
                  fill="hsl(38 80% 55%)"
                  fillOpacity={0.15}
                  strokeWidth={1.5}
                />
                <Tooltip
                  contentStyle={{
                    fontFamily: "DM Sans",
                    fontSize: 12,
                    borderRadius: 6,
                    border: "1px solid hsl(35 15% 88%)",
                    backgroundColor: "#FAF8F4",
                  }}
                  formatter={(value: number) => [`${value}%`, "Coverage"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Maturity breakdown — horizontal bars (scannable) */}
      <motion.div variants={itemVariants} className="border border-border rounded-lg p-5 bg-card/60 mb-8">
        <h2 className="font-sans text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <ArrowUpRight size={14} className="text-muted-foreground" />
          AI Maturity Breakdown
        </h2>
        <div className="space-y-2.5">
          {departments
            .sort((a, b) => b.score - a.score)
            .map((dept) => {
              const stageStyles: Record<string, string> = {
                "ai-led": "bg-emerald-100 text-emerald-700",
                "ai-augmented": "bg-sky-100 text-sky-700",
                traditional: "bg-stone-200 text-stone-500",
              };
              return (
                <div key={dept.name} className="flex items-center gap-3">
                  <span className="font-sans text-xs text-muted-foreground w-[110px] shrink-0 truncate">
                    {dept.name}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-foreground/60"
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.score}%` }}
                      transition={{ duration: 0.7, delay: 0.15 }}
                    />
                  </div>
                  <span className="font-sans text-xs font-semibold tabular-nums text-foreground w-7 text-right">
                    {dept.score}
                  </span>
                  <span
                    className={`font-sans text-[10px] px-1.5 py-0.5 rounded-full ${stageStyles[dept.stage] || stageStyles.traditional}`}
                  >
                    {dept.stage.replace("-", " ")}
                  </span>
                </div>
              );
            })}
        </div>
      </motion.div>

      {/* Two-column: Org Structure + Current Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Org Structure */}
        <motion.section
          variants={itemVariants}
          className="border border-border rounded-lg p-5 bg-card/60"
        >
          <h2 className="font-sans text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Building2 size={14} className="text-muted-foreground" />
            Organisational Structure
          </h2>
          <div className="space-y-4">
            {Object.entries(deptGroups).map(([dept, members]) => (
              <div key={dept}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-sans text-xs font-medium text-foreground">{dept}</span>
                  <span className="font-sans text-[10px] tabular-nums text-muted-foreground">
                    {members.length} {members.length === 1 ? "member" : "members"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {members.map((m) => (
                    <span
                      key={m.id}
                      className="font-sans text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground"
                    >
                      {m.avatarInitials} · {m.role.split(" ").slice(0, 2).join(" ")}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Current Projects */}
        <motion.section
          variants={itemVariants}
          className="border border-border rounded-lg p-5 bg-card/60"
        >
          <h2 className="font-sans text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Briefcase size={14} className="text-muted-foreground" />
            Current Projects
          </h2>
          <div className="space-y-1">
            {uniqueProjects.map((proj, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 py-2.5 border-b border-border/40 last:border-0"
              >
                <div className="min-w-0">
                  <p className="font-sans text-[13px] font-medium text-foreground leading-tight">
                    {proj.name}
                  </p>
                  <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                    {proj.department} · {proj.people.length}{" "}
                    {proj.people.length === 1 ? "person" : "people"}
                  </p>
                </div>
                {proj.priority && (
                  <span
                    className={`font-sans text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${priorityColor[proj.priority]}`}
                  >
                    {proj.priority}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Upcoming Briefs */}
      <motion.section
        variants={itemVariants}
        className="border border-border rounded-lg p-5 bg-card/60 mb-8"
      >
        <h2 className="font-sans text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <FileText size={14} className="text-muted-foreground" />
          Upcoming Briefs
        </h2>
        <div className="space-y-1">
          {BRIEFING_SUMMARIES.map((brief) => {
            const statusLabel: Record<string, { text: string; style: string }> = {
              "analysis-complete": { text: "Analysis complete", style: "bg-emerald-100 text-emerald-700" },
              "swarm-ready": { text: "Ready for review", style: "bg-sky-100 text-sky-700" },
              "swarm-searching": { text: "Searching", style: "bg-amber-100 text-amber-700" },
            };
            const s = statusLabel[brief.status] ?? statusLabel["swarm-searching"];
            return (
              <div
                key={brief.id}
                className="flex items-start justify-between gap-4 py-3 border-b border-border/40 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-sans text-[13px] font-medium text-foreground leading-tight">
                      {brief.title}
                    </p>
                    <ChevronRight size={12} className="text-muted-foreground shrink-0" />
                  </div>
                  <p className="font-sans text-[11px] text-muted-foreground">
                    {brief.submittedBy.name} · {brief.dateReceived}
                  </p>
                  <p className="font-sans text-xs text-muted-foreground mt-1 leading-relaxed">
                    {brief.aiSummary}
                  </p>
                </div>
                <span
                  className={`font-sans text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${s.style}`}
                >
                  {s.text}
                </span>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* AI Initiative Tracker */}
      <motion.section
        variants={itemVariants}
        className="border border-border rounded-lg p-5 bg-card/60"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans text-sm font-medium text-foreground flex items-center gap-2">
            <Clock size={14} className="text-muted-foreground" />
            AI Initiative Tracker
          </h2>
          <div className="flex items-center gap-4">
            {(["live", "in-build", "completed"] as const).map((status) => (
              <span key={status} className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />
                <span className="font-sans text-[10px] text-muted-foreground capitalize">
                  {status.replace("-", " ")}
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {aiProjects.map((proj) => (
            <div
              key={proj.id}
              className="flex items-center gap-3 py-2 px-3 rounded-md bg-muted/30"
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot[proj.status]}`} />
              <div className="min-w-0">
                <p className="font-sans text-[11px] font-medium text-foreground truncate">
                  {proj.name}
                </p>
                <p className="font-sans text-[10px] text-muted-foreground">
                  {proj.department}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

const KPICard = ({
  icon,
  label,
  value,
  delta,
  deltaLabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  deltaLabel: string;
}) => (
  <div className="border border-border rounded-lg p-4 sm:p-5 bg-card/60">
    <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
      {icon}
      <span className="font-sans text-[11px] tracking-wide">{label}</span>
    </div>
    <p className="font-sans text-2xl sm:text-3xl font-semibold tabular-nums text-foreground leading-none">
      {value}
    </p>
    <p className="font-sans text-[11px] text-muted-foreground mt-1.5">
      <span className="font-medium text-foreground/70">{delta}</span>{" "}
      {deltaLabel}
    </p>
  </div>
);

export default OverviewDashboard;
