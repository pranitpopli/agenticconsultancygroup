import { motion } from "framer-motion";
import { TrendingUp, Users, Briefcase, FileText, Building2, ArrowUpRight, Clock } from "lucide-react";
import { OQR_DATA } from "@/lib/oqrData";
import { EMPLOYEES } from "@/lib/simulatedData";
import { BRIEFING_SUMMARIES } from "@/lib/briefingData";

const formatCurrency = (n: number) =>
  `£${(n / 1000).toFixed(0)}k`;

const stageBadge = (stage: string) => {
  const styles: Record<string, string> = {
    "ai-led": "bg-emerald-100 text-emerald-800",
    "ai-augmented": "bg-sky-100 text-sky-800",
    traditional: "bg-stone-200 text-stone-600",
  };
  return styles[stage] || styles.traditional;
};

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
  const { totalSavings, previousQuarterSavings, currentQuarter, orgMaturity, maturityDelta, departments, aiProjects } = OQR_DATA;
  const savingsDelta = totalSavings - previousQuarterSavings;
  const savingsGrowth = ((savingsDelta / previousQuarterSavings) * 100).toFixed(0);

  // Gather all active projects across the org
  const activeProjects = EMPLOYEES.flatMap((emp) =>
    emp.pastProjects
      .filter((p) => p.status === "active")
      .map((p) => ({ ...p, owner: emp.name, department: emp.department }))
  );

  // Deduplicate by project name
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

  // Org structure summary
  const deptGroups = EMPLOYEES.reduce<Record<string, typeof EMPLOYEES>>((acc, emp) => {
    (acc[emp.department] ??= []).push(emp);
    return acc;
  }, {});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="pt-24 pb-16 px-8 max-w-[1200px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page heading */}
      <motion.div variants={itemVariants} className="mb-10">
        <h1 className="font-serif text-3xl text-foreground mb-1">Organisation Overview</h1>
        <p className="text-sm text-muted-foreground">{currentQuarter} · Live snapshot for leadership</p>
      </motion.div>

      {/* KPI row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <KPICard icon={<TrendingUp size={18} />} label="Quarterly Savings" value={formatCurrency(totalSavings)} delta={`+${savingsGrowth}% vs last quarter`} />
        <KPICard icon={<Briefcase size={18} />} label="Active Projects" value={String(aiProjects.filter((p) => p.status === "live").length)} delta={`${aiProjects.filter((p) => p.status === "in-build").length} in build`} />
        <KPICard icon={<Users size={18} />} label="Headcount" value={String(EMPLOYEES.length)} delta={`${Object.keys(deptGroups).length} departments`} />
        <KPICard icon={<ArrowUpRight size={18} />} label="AI Maturity" value={`${orgMaturity}%`} delta={`+${maturityDelta}pts this quarter`} />
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current OKR / AI Maturity */}
        <motion.section variants={itemVariants} className="border border-border rounded-lg p-6" style={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
          <h2 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-muted-foreground" /> OKR — AI Maturity by Department
          </h2>
          <div className="space-y-3">
            {departments
              .sort((a, b) => b.score - a.score)
              .map((dept) => (
                <div key={dept.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28 shrink-0 truncate">{dept.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-foreground/70"
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.score}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground w-8 text-right">{dept.score}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${stageBadge(dept.stage)}`}>
                    {dept.stage.replace("-", " ")}
                  </span>
                </div>
              ))}
          </div>
        </motion.section>

        {/* Org Structure */}
        <motion.section variants={itemVariants} className="border border-border rounded-lg p-6" style={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
          <h2 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2">
            <Building2 size={16} className="text-muted-foreground" /> Organisational Structure
          </h2>
          <div className="space-y-4">
            {Object.entries(deptGroups).map(([dept, members]) => (
              <div key={dept}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-foreground">{dept}</span>
                  <span className="text-[10px] text-muted-foreground">{members.length} {members.length === 1 ? "member" : "members"}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {members.map((m) => (
                    <span key={m.id} className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {m.avatarInitials} · {m.role.split(" ").slice(0, 2).join(" ")}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Current Projects */}
        <motion.section variants={itemVariants} className="border border-border rounded-lg p-6" style={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
          <h2 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2">
            <Briefcase size={16} className="text-muted-foreground" /> Current Projects
          </h2>
          <div className="space-y-3">
            {uniqueProjects.map((proj, i) => (
              <div key={i} className="flex items-start justify-between gap-3 py-2 border-b border-border/50 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{proj.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {proj.department} · {proj.people.length} {proj.people.length === 1 ? "person" : "people"} assigned
                  </p>
                </div>
                {proj.priority && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${priorityColor[proj.priority]}`}>
                    {proj.priority}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Upcoming Briefs */}
        <motion.section variants={itemVariants} className="border border-border rounded-lg p-6" style={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
          <h2 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2">
            <FileText size={16} className="text-muted-foreground" /> Upcoming Briefs
          </h2>
          <div className="space-y-3">
            {BRIEFING_SUMMARIES.map((brief) => {
              const statusLabel: Record<string, { text: string; style: string }> = {
                "analysis-complete": { text: "Analysis complete", style: "bg-emerald-100 text-emerald-700" },
                "swarm-ready": { text: "Ready for review", style: "bg-sky-100 text-sky-700" },
                "swarm-searching": { text: "Searching", style: "bg-amber-100 text-amber-700" },
              };
              const s = statusLabel[brief.status] ?? statusLabel["swarm-searching"];
              return (
                <div key={brief.id} className="py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{brief.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {brief.submittedBy.name} · {brief.dateReceived}
                      </p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${s.style}`}>{s.text}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{brief.aiSummary}</p>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>

      {/* AI Projects tracker */}
      <motion.section variants={itemVariants} className="border border-border rounded-lg p-6 mt-6" style={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
        <h2 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2">
          <Clock size={16} className="text-muted-foreground" /> AI Initiative Tracker
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {aiProjects.map((proj) => (
            <div key={proj.id} className="flex items-center gap-3 py-2 px-3 rounded-md bg-muted/40">
              <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot[proj.status]}`} />
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{proj.name}</p>
                <p className="text-[10px] text-muted-foreground">{proj.department} · {proj.capability}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

const KPICard = ({ icon, label, value, delta }: { icon: React.ReactNode; label: string; value: string; delta: string }) => (
  <div className="border border-border rounded-lg p-5" style={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
    <div className="flex items-center gap-2 text-muted-foreground mb-2">{icon}<span className="text-xs">{label}</span></div>
    <p className="font-serif text-2xl text-foreground">{value}</p>
    <p className="text-[11px] text-muted-foreground mt-1">{delta}</p>
  </div>
);

export default OverviewDashboard;
