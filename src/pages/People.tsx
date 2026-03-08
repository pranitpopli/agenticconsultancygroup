import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, ChevronDown } from "lucide-react";
import BriefingNav from "@/components/BriefingNav";
import { EMPLOYEES } from "@/lib/simulatedData";
import { useNavigate } from "react-router-dom";

const departmentFilters = ["All", ...new Set(EMPLOYEES.map((e) => e.department))];

// Extract unique active project names across all employees
const allProjects = [
  "All Projects",
  ...new Set(
    EMPLOYEES.flatMap((e) =>
      e.pastProjects.filter((p) => p.status === "active").map((p) => p.name)
    )
  ),
];

const availabilityFilters = ["Any", "available", "partial", "committed"] as const;

const availabilityStyle: Record<string, string> = {
  available: "text-[hsl(var(--status-positive))] border-[hsl(var(--status-positive)/0.3)] bg-[hsl(var(--status-positive-bg))]",
  partial: "text-[hsl(var(--status-warning))] border-[hsl(var(--status-warning)/0.3)] bg-[hsl(var(--status-warning-bg))]",
  committed: "text-muted-foreground border-border bg-muted",
};

const People = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [availFilter, setAvailFilter] = useState<string>("Any");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const filtered = useMemo(() => {
    return EMPLOYEES.filter((emp) => {
      const matchesSearch =
        !search ||
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.role.toLowerCase().includes(search.toLowerCase()) ||
        emp.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchesDept = deptFilter === "All" || emp.department === deptFilter;
      const matchesProject =
        projectFilter === "All Projects" ||
        emp.pastProjects.some((p) => p.name === projectFilter);
      const matchesAvail = availFilter === "Any" || emp.availability === availFilter;
      return matchesSearch && matchesDept && matchesProject && matchesAvail;
    });
  }, [search, deptFilter, projectFilter, availFilter]);

  const activeFilterCount = [
    deptFilter !== "All",
    projectFilter !== "All Projects",
    availFilter !== "Any",
  ].filter(Boolean).length;

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
            {activeFilterCount > 0 && (
              <span className="text-foreground/70"> · {filtered.length} matching filters</span>
            )}
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

          {/* Department filter */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Department</span>
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
          </div>

          {/* Project + Availability filters row */}
          <div className="flex items-start gap-6 flex-wrap">
            {/* Project filter dropdown */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Project</span>
              <div className="relative">
                <button
                  onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                  className={`flex items-center gap-2 text-xs px-3.5 py-1.5 border rounded-sm transition-colors min-w-[180px] justify-between ${
                    projectFilter !== "All Projects"
                      ? "border-foreground text-foreground bg-foreground/5 font-medium"
                      : "border-border text-muted-foreground hover:border-foreground/20"
                  }`}
                >
                  <span className="truncate">{projectFilter}</span>
                  <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${showProjectDropdown ? "rotate-180" : ""}`} strokeWidth={1.5} />
                </button>

                {showProjectDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProjectDropdown(false)} />
                    <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border shadow-lg z-50 max-h-60 overflow-y-auto">
                      {allProjects.map((proj) => (
                        <button
                          key={proj}
                          onClick={() => {
                            setProjectFilter(proj);
                            setShowProjectDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                            projectFilter === proj
                              ? "text-foreground font-medium bg-muted"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {proj}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Availability filter */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Availability</span>
              <div role="radiogroup" aria-label="Filter by availability" className="flex items-center gap-2">
                {availabilityFilters.map((avail) => (
                  <button
                    key={avail}
                    role="radio"
                    aria-checked={availFilter === avail}
                    onClick={() => setAvailFilter(avail)}
                    className={`text-xs px-3.5 py-1.5 border rounded-sm transition-colors capitalize focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                      availFilter === avail
                        ? "border-foreground text-foreground bg-foreground/5 font-medium"
                        : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                    }`}
                  >
                    {avail}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clear filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setDeptFilter("All");
                setProjectFilter("All Projects");
                setAvailFilter("Any");
              }}
              className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </motion.div>

        {/* Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((emp) => {
            const activeProjects = emp.pastProjects.filter((p) => p.status === "active");
            return (
              <motion.div
                key={emp.id}
                variants={itemVariants}
                onClick={() => navigate(`/people/${emp.id}`)}
                className="border border-border bg-card p-5 space-y-3 hover:border-foreground/20 transition-colors cursor-pointer"
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
