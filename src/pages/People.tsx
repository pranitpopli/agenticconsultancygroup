import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Briefcase, ChevronDown, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import BriefingNav from "@/components/BriefingNav";
import { EMPLOYEES } from "@/lib/simulatedData";
import { useNavigate } from "react-router-dom";

const departmentFilters = ["All", ...new Set(EMPLOYEES.map((e) => e.department))];

const allProjects = [
  "All Projects",
  ...new Set(
    EMPLOYEES.flatMap((e) =>
      e.pastProjects.filter((p) => p.status === "active").map((p) => p.name)
    )
  ),
];

const availabilityFilters = ["Any", "available", "partial", "committed"] as const;

type SortKey = "name" | "department" | "availability" | "experience" | "rate";
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "department", label: "Department" },
  { key: "availability", label: "Availability" },
  { key: "experience", label: "Experience" },
  { key: "rate", label: "Hourly rate" },
];

const availabilityStyle: Record<string, string> = {
  available: "text-[hsl(var(--status-positive))] border-[hsl(var(--status-positive)/0.3)] bg-[hsl(var(--status-positive-bg))]",
  partial: "text-[hsl(var(--status-warning))] border-[hsl(var(--status-warning)/0.3)] bg-[hsl(var(--status-warning-bg))]",
  committed: "text-muted-foreground border-border bg-muted",
};

const availabilityOrder: Record<string, number> = { available: 0, partial: 1, committed: 2 };

const People = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [availFilter, setAvailFilter] = useState<string>("Any");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    const list = EMPLOYEES.filter((emp) => {
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

    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "department": cmp = a.department.localeCompare(b.department); break;
        case "availability": cmp = (availabilityOrder[a.availability] ?? 2) - (availabilityOrder[b.availability] ?? 2); break;
        case "experience": cmp = a.yearsExperience - b.yearsExperience; break;
        case "rate": cmp = a.hourlyRate - b.hourlyRate; break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return list;
  }, [search, deptFilter, projectFilter, availFilter, sortKey, sortAsc]);

  const activeFilters: { label: string; onClear: () => void }[] = [];
  if (deptFilter !== "All") activeFilters.push({ label: deptFilter, onClear: () => setDeptFilter("All") });
  if (projectFilter !== "All Projects") activeFilters.push({ label: projectFilter, onClear: () => setProjectFilter("All Projects") });
  if (availFilter !== "Any") activeFilters.push({ label: availFilter, onClear: () => setAvailFilter("Any") });

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
            {filtered.length} of {EMPLOYEES.length} team members
          </p>
        </motion.div>

        {/* ━━━ TOOLBAR ━━━ */}
        <motion.div variants={itemVariants} className="mb-6 space-y-3">
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative flex-1">
              <label htmlFor="people-search" className="sr-only">Search people</label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
              <input
                id="people-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, role, or skill…"
                className="w-full text-sm bg-background border border-border pl-10 pr-4 py-2 outline-none focus:border-foreground/30 focus:ring-1 focus:ring-ring transition-colors placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => { setFiltersOpen(!filtersOpen); setSortOpen(false); }}
              className={`flex items-center gap-2 text-xs px-4 py-2 border transition-colors shrink-0 ${
                filtersOpen || activeFilters.length > 0
                  ? "border-foreground text-foreground bg-foreground/5"
                  : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.5} />
              Filter
              {activeFilters.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-foreground text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                  {activeFilters.length}
                </span>
              )}
            </button>

            {/* Sort toggle */}
            <div className="relative">
              <button
                onClick={() => { setSortOpen(!sortOpen); setFiltersOpen(false); }}
                className={`flex items-center gap-2 text-xs px-4 py-2 border transition-colors shrink-0 ${
                  sortOpen
                    ? "border-foreground text-foreground bg-foreground/5"
                    : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" strokeWidth={1.5} />
                Sort
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 w-48 bg-card border border-border shadow-lg z-50"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => {
                            if (sortKey === opt.key) {
                              setSortAsc(!sortAsc);
                            } else {
                              setSortKey(opt.key);
                              setSortAsc(true);
                            }
                            setSortOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-xs transition-colors ${
                            sortKey === opt.key
                              ? "text-foreground font-medium bg-muted"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {opt.label}
                          {sortKey === opt.key && (
                            <span className="text-[10px] text-muted-foreground">{sortAsc ? "↑" : "↓"}</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ━━━ FILTER PANEL (collapsible) ━━━ */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="border border-border bg-card p-5 space-y-4">
                  {/* Department */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Department</span>
                    <div role="radiogroup" aria-label="Filter by department" className="flex items-center gap-1.5 flex-wrap">
                      {departmentFilters.map((dept) => (
                        <button
                          key={dept}
                          role="radio"
                          aria-checked={deptFilter === dept}
                          onClick={() => setDeptFilter(dept)}
                          className={`text-xs px-3 py-1.5 border rounded-sm transition-colors ${
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

                  <div className="flex gap-6 flex-wrap">
                    {/* Project */}
                    <div className="space-y-2 flex-1 min-w-[180px]">
                      <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Project</span>
                      <div className="relative">
                        <select
                          value={projectFilter}
                          onChange={(e) => setProjectFilter(e.target.value)}
                          className="w-full text-xs bg-background border border-border px-3 py-1.5 outline-none appearance-none cursor-pointer focus:border-foreground/30 text-foreground"
                        >
                          {allProjects.map((proj) => (
                            <option key={proj} value={proj}>{proj}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Availability</span>
                      <div role="radiogroup" aria-label="Filter by availability" className="flex items-center gap-1.5">
                        {availabilityFilters.map((avail) => (
                          <button
                            key={avail}
                            role="radio"
                            aria-checked={availFilter === avail}
                            onClick={() => setAvailFilter(avail)}
                            className={`text-xs px-3 py-1.5 border rounded-sm transition-colors capitalize ${
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ━━━ ACTIVE FILTER TAGS ━━━ */}
          {activeFilters.length > 0 && !filtersOpen && (
            <div className="flex items-center gap-2 flex-wrap">
              {activeFilters.map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-1.5 text-xs text-foreground bg-foreground/5 border border-foreground/15 px-2.5 py-1 rounded-sm"
                >
                  {f.label}
                  <button
                    onClick={f.onClear}
                    className="hover:text-destructive transition-colors"
                    aria-label={`Remove ${f.label} filter`}
                  >
                    <X className="w-3 h-3" strokeWidth={2} />
                  </button>
                </span>
              ))}
              <button
                onClick={() => {
                  setDeptFilter("All");
                  setProjectFilter("All Projects");
                  setAvailFilter("Any");
                }}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors ml-1"
              >
                Clear all
              </button>
            </div>
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
