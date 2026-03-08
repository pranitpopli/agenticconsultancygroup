import { motion } from "framer-motion";
import { OQR_DATA } from "@/lib/oqrData";
import { EMPLOYEES } from "@/lib/simulatedData";
import BriefingNav from "@/components/BriefingNav";

const OQR = () => {
  const {
    totalSavings,
    previousQuarterSavings,
    currentQuarter,
    previousQuarter,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  const maxSaving = Math.max(totalSavings, previousQuarterSavings);

  return (
    <div className="min-h-screen bg-background">
      <BriefingNav activeTab="oqr" onTabChange={() => {}} />

      <motion.div
        className="max-w-[780px] mx-auto px-8 pt-28 pb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ━━━ HEADLINE ━━━ */}
        <motion.div variants={itemVariants} className="mb-14">
          <h1 className="font-serif text-3xl text-foreground mb-2">
            Meridian Group is becoming an AI-led organisation.
          </h1>
          <p className="text-sm text-muted-foreground">Here is the evidence.</p>
        </motion.div>

        {/* ━━━ FINANCIAL IMPACT ━━━ */}
        <motion.div variants={itemVariants} className="mb-14">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6">
            {currentQuarter} · Financial impact
          </p>

          <div className="flex items-end gap-12 mb-8">
            <div>
              <p className="font-serif text-4xl text-foreground">
                £{(totalSavings / 1000).toFixed(0)}k
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Cost avoided this quarter
              </p>
            </div>
            <div className="flex items-end gap-3 pb-1">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-5 bg-foreground/15 rounded-sm"
                  style={{ height: `${(previousQuarterSavings / maxSaving) * 64}px` }}
                />
                <span className="text-[9px] text-muted-foreground">{previousQuarter}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-5 bg-foreground/30 rounded-sm"
                  style={{ height: `${(totalSavings / maxSaving) * 64}px` }}
                />
                <span className="text-[9px] text-muted-foreground">{currentQuarter}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-5">
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

        <div className="border-t border-border mb-14" />

        {/* ━━━ AI PROJECTS ━━━ */}
        <motion.div variants={itemVariants} className="mb-14">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            AI projects in flight
          </p>
          <p className="font-serif text-lg text-foreground mb-6">
            {aiProjects.length} AI-augmented projects active across {activeDepartmentCount} departments
          </p>

          <div className="flex items-center gap-6 mb-6 text-[11px] text-muted-foreground">
            <span>{liveProjects} live</span>
            <span>{inBuild} in build</span>
            <span>{completed} completed</span>
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

        <div className="border-t border-border mb-14" />

        {/* ━━━ ORG MATURITY ━━━ */}
        <motion.div variants={itemVariants} className="mb-14">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Org shift index
          </p>
          <div className="flex items-baseline gap-3 mb-6">
            <p className="font-serif text-4xl text-foreground">{orgMaturity}%</p>
            <span className="text-sm text-[hsl(var(--status-positive))]">+{maturityDelta}</span>
            <span className="text-[11px] text-muted-foreground">AI maturity</span>
          </div>

          <div className="space-y-2.5 mb-5">
            {departments
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
