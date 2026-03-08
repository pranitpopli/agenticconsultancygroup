import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase } from "lucide-react";
import BriefingNav from "@/components/BriefingNav";
import { EMPLOYEES } from "@/lib/simulatedData";
import { useNavigate } from "react-router-dom";

const departmentFilters = ["All", ...new Set(EMPLOYEES.map((e) => e.department))];

const availabilityStyle: Record<string, string> = {
  available: "text-[hsl(var(--status-positive))] border-[hsl(var(--status-positive)/0.3)] bg-[hsl(var(--status-positive-bg))]",
  partial: "text-[hsl(var(--status-warning))] border-[hsl(var(--status-warning)/0.3)] bg-[hsl(var(--status-warning-bg))]",
  committed: "text-muted-foreground border-border bg-muted",
};

const People = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  const filtered = EMPLOYEES.filter((emp) => {
    const matchesSearch =
      !search ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase()) ||
      emp.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesDept = deptFilter === "All" || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-background">
      <BriefingNav
        activeTab="people"
        onTabChange={(tab) => {
          if (tab === "briefings") navigate("/");
          if (tab === "archive") navigate("/?tab=archive");
        }}
      />

      <motion.main
        className="max-w-[1000px] mx-auto px-4 sm:px-8 pt-28 pb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="font-serif text-3xl text-foreground mb-1">People</h1>
          <p className="text-sm text-muted-foreground">
            {EMPLOYEES.length} team members across the organisation
          </p>
        </motion.div>

        {/* Search + filters */}
        <motion.div variants={itemVariants} className="space-y-3 mb-8">
          <div className="relative">
            <label htmlFor="people-search" className="sr-only">Search people</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
            <input
              id="people-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, role, or skill…"
              className="w-full text-sm bg-background border border-border pl-10 pr-4 py-2.5 outline-none focus:border-foreground/30 focus:ring-1 focus:ring-ring transition-colors placeholder:text-muted-foreground/50"
            />
          </div>
          <div role="radiogroup" aria-label="Filter by department" className="flex items-center gap-2 flex-wrap">
            {departmentFilters.map((dept) => (
              <button
                key={dept}
                role="radio"
                aria-checked={deptFilter === dept}
                onClick={() => setDeptFilter(dept)}
                className={`text-xs px-3.5 py-1.5 border rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                  deptFilter === dept
                    ? "border-foreground text-foreground bg-foreground/5 font-medium"
                    : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((emp) => {
            const activeProjects = emp.pastProjects.filter((p) => p.status === "active");
            return (
              <motion.div
                key={emp.id}
                variants={itemVariants}
                className="border border-border bg-card p-5 space-y-3 hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-[11px] text-muted-foreground font-medium">
                      {emp.avatarInitials}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{emp.name}</p>
                      <p className="text-[11px] text-muted-foreground">{emp.role}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 border ${availabilityStyle[emp.availability] || ""}`}>
                    {emp.availability}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" strokeWidth={1.5} />
                    {emp.location}
                  </span>
                  <span>·</span>
                  <span>{emp.department}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {emp.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] text-muted-foreground border border-border px-2 py-0.5"
                    >
                      {skill}
                    </span>
                  ))}
                  {emp.skills.length > 4 && (
                    <span className="text-[10px] text-muted-foreground/50">
                      +{emp.skills.length - 4}
                    </span>
                  )}
                </div>

                {activeProjects.length > 0 && (
                  <div className="pt-2 border-t border-border/50">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60 flex items-center gap-1.5 mb-1.5">
                      <Briefcase className="w-3 h-3" strokeWidth={1.5} />
                      Active projects
                    </span>
                    {activeProjects.map((p) => (
                      <p key={p.name} className="text-[11px] text-foreground/70">{p.name}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {filtered.length === 0 && (
          <div className="border border-border p-10 text-center mt-4">
            <p className="text-sm text-muted-foreground">No team members match your search.</p>
          </div>
        )}
      </motion.main>
    </div>
  );
};

export default People;
