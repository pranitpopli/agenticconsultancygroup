import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Briefcase, SlidersHorizontal, ArrowUpDown,
  X, ChevronLeft, ChevronRight, Pin, Plus, Check,
} from "lucide-react";
import BriefingNav from "@/components/BriefingNav";
import { EMPLOYEES } from "@/lib/simulatedData";
import { useNavigate } from "react-router-dom";

// ─── DERIVED FACETS ────────────────────────────────────────────────
const ALL_DEPARTMENTS = [...new Set(EMPLOYEES.map((e) => e.department))].sort();
const ALL_LOCATIONS = [...new Set(EMPLOYEES.map((e) => e.location))].sort();
const ALL_PROJECTS = [...new Set(EMPLOYEES.flatMap((e) => e.pastProjects.map((p) => p.name)))].sort();
const ALL_SKILLS = [...new Set(EMPLOYEES.flatMap((e) => e.skills))].sort();

type SortKey = "availability" | "experience" | "rate";
const SORT_OPTIONS: { key: SortKey; label: string; desc: string }[] = [
  { key: "availability", label: "Availability", desc: "Free people first — who can start now" },
  { key: "experience", label: "Seniority", desc: "Most experienced first for critical roles" },
  { key: "rate", label: "Day rate", desc: "Budget-conscious staffing decisions" },
];

const availabilityOrder: Record<string, number> = { available: 0, partial: 1, committed: 2 };
const PER_PAGE = 24;

const availabilityStyle: Record<string, string> = {
  available: "text-[hsl(var(--status-positive))] border-[hsl(var(--status-positive)/0.3)] bg-[hsl(var(--status-positive-bg))]",
  partial: "text-[hsl(var(--status-warning))] border-[hsl(var(--status-warning)/0.3)] bg-[hsl(var(--status-warning-bg))]",
  committed: "text-muted-foreground border-border bg-muted",
};

// ─── FILTER STATE TYPE ─────────────────────────────────────────────
interface Filters {
  departments: Set<string>;
  locations: Set<string>;
  projects: Set<string>;
  skills: Set<string>;
  availability: Set<string>;
}

interface SavedPreset {
  id: string;
  name: string;
  filters: {
    departments: string[];
    locations: string[];
    projects: string[];
    skills: string[];
    availability: string[];
  };
}

const emptyFilters = (): Filters => ({
  departments: new Set(),
  locations: new Set(),
  projects: new Set(),
  skills: new Set(),
  availability: new Set(),
});

const filtersActive = (f: Filters): number =>
  f.departments.size + f.locations.size + f.projects.size + f.skills.size + f.availability.size;

// ─── FACET SEARCH COMBOBOX ─────────────────────────────────────────
interface FacetGroupProps {
  label: string;
  options: string[];
  selected: Set<string>;
  onToggle: (val: string) => void;
  counts: Map<string, number>;
}

const FacetGroup = ({ label, options, selected, onToggle, counts }: FacetGroupProps) => {
  const [facetSearch, setFacetSearch] = useState("");
  const filtered = options.filter((o) =>
    o.toLowerCase().includes(facetSearch.toLowerCase())
  );
  const showSearch = options.length > 6;

  return (
    <div className="space-y-2">
      <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">{label}</span>
      {showSearch && (
        <input
          value={facetSearch}
          onChange={(e) => setFacetSearch(e.target.value)}
          placeholder={`Search ${label.toLowerCase()}…`}
          className="w-full text-[11px] bg-background border border-border px-2.5 py-1.5 outline-none focus:border-foreground/30 transition-colors placeholder:text-muted-foreground/40 text-foreground"
        />
      )}
      <div className={`space-y-0.5 ${showSearch ? "max-h-36 overflow-y-auto" : ""}`}>
        {filtered.map((opt) => {
          const count = counts.get(opt) ?? 0;
          const isSelected = selected.has(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={`w-full flex items-center justify-between px-2 py-1.5 text-xs transition-colors rounded-sm group ${
                isSelected
                  ? "bg-foreground/5 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 border flex items-center justify-center transition-colors ${
                  isSelected ? "border-foreground bg-foreground" : "border-border group-hover:border-foreground/30"
                }`}>
                  {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={2.5} />}
                </span>
                <span className="truncate">{opt}</span>
              </span>
              <span className="text-[10px] text-muted-foreground/50 tabular-nums">{count}</span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-[11px] text-muted-foreground/50 px-2 py-1">No matches</p>
        )}
      </div>
    </div>
  );
};

// ─── MAIN PAGE ─────────────────────────────────────────────────────
const People = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(emptyFilters());
  const [sortKey, setSortKey] = useState<SortKey>("availability");
  const [sortAsc, setSortAsc] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Presets
  const [presets, setPresets] = useState<SavedPreset[]>([
    { id: "p-1", name: "Available engineers", filters: { departments: ["Engineering"], locations: [], projects: [], skills: [], availability: ["available"] } },
    { id: "p-2", name: "London team", filters: { departments: [], locations: ["London"], projects: [], skills: [], availability: [] } },
    { id: "p-3", name: "Data specialists", filters: { departments: ["Data & Analytics"], locations: [], projects: [], skills: [], availability: [] } },
  ]);
  const [savingPreset, setSavingPreset] = useState(false);
  const [presetName, setPresetName] = useState("");

  const toggleFilter = useCallback((key: keyof Filters, val: string) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: new Set(prev[key]) };
      next[key].has(val) ? next[key].delete(val) : next[key].add(val);
      return next;
    });
    setPage(1);
  }, []);

  // Compute filtered + sorted
  const { results, facetCounts } = useMemo(() => {
    // First pass: match everything except each facet (for counts)
    const baseMatch = (emp: typeof EMPLOYEES[0], excludeFacet?: keyof Filters) => {
      const s = search.toLowerCase();
      const matchesSearch = !s ||
        emp.name.toLowerCase().includes(s) ||
        emp.role.toLowerCase().includes(s) ||
        emp.skills.some((sk) => sk.toLowerCase().includes(s));
      const matchesDept = excludeFacet === "departments" || filters.departments.size === 0 || filters.departments.has(emp.department);
      const matchesLoc = excludeFacet === "locations" || filters.locations.size === 0 || filters.locations.has(emp.location);
      const matchesProj = excludeFacet === "projects" || filters.projects.size === 0 || emp.pastProjects.some((p) => filters.projects.has(p.name));
      const matchesSkill = excludeFacet === "skills" || filters.skills.size === 0 || emp.skills.some((sk) => filters.skills.has(sk));
      const matchesAvail = excludeFacet === "availability" || filters.availability.size === 0 || filters.availability.has(emp.availability);
      return matchesSearch && matchesDept && matchesLoc && matchesProj && matchesSkill && matchesAvail;
    };

    // Full filtered results
    const list = EMPLOYEES.filter((e) => baseMatch(e));

    // Sort
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "availability": cmp = (availabilityOrder[a.availability] ?? 2) - (availabilityOrder[b.availability] ?? 2); break;
        case "experience": cmp = a.yearsExperience - b.yearsExperience; break;
        case "rate": cmp = a.hourlyRate - b.hourlyRate; break;
      }
      // Secondary sort: name for stable ordering
      if (cmp === 0) cmp = a.name.localeCompare(b.name);
      return sortAsc ? cmp : -cmp;
    });

    // Facet counts (how many match if this facet value were toggled)
    const deptCounts = new Map<string, number>();
    const locCounts = new Map<string, number>();
    const projCounts = new Map<string, number>();
    const skillCounts = new Map<string, number>();
    const availCounts = new Map<string, number>();

    for (const emp of EMPLOYEES) {
      if (baseMatch(emp, "departments")) deptCounts.set(emp.department, (deptCounts.get(emp.department) ?? 0) + 1);
      if (baseMatch(emp, "locations")) locCounts.set(emp.location, (locCounts.get(emp.location) ?? 0) + 1);
      if (baseMatch(emp, "projects")) emp.pastProjects.forEach((p) => projCounts.set(p.name, (projCounts.get(p.name) ?? 0) + 1));
      if (baseMatch(emp, "skills")) emp.skills.forEach((sk) => skillCounts.set(sk, (skillCounts.get(sk) ?? 0) + 1));
      if (baseMatch(emp, "availability")) availCounts.set(emp.availability, (availCounts.get(emp.availability) ?? 0) + 1);
    }

    return {
      results: list,
      facetCounts: {
        departments: deptCounts,
        locations: locCounts,
        projects: projCounts,
        skills: skillCounts,
        availability: availCounts,
      },
    };
  }, [search, filters, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const paged = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const activeCount = filtersActive(filters);

  const applyPreset = (preset: SavedPreset) => {
    setFilters({
      departments: new Set(preset.filters.departments),
      locations: new Set(preset.filters.locations),
      projects: new Set(preset.filters.projects),
      skills: new Set(preset.filters.skills),
      availability: new Set(preset.filters.availability),
    });
    setPage(1);
  };

  const savePreset = () => {
    if (!presetName.trim()) return;
    const newPreset: SavedPreset = {
      id: `p-${Date.now()}`,
      name: presetName.trim(),
      filters: {
        departments: [...filters.departments],
        locations: [...filters.locations],
        projects: [...filters.projects],
        skills: [...filters.skills],
        availability: [...filters.availability],
      },
    };
    setPresets((prev) => [...prev, newPreset]);
    setPresetName("");
    setSavingPreset(false);
  };

  const removePreset = (id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
  };

  // Build active filter tags from sets
  const activeFilterTags: { label: string; group: keyof Filters; value: string }[] = [];
  filters.departments.forEach((v) => activeFilterTags.push({ label: v, group: "departments", value: v }));
  filters.locations.forEach((v) => activeFilterTags.push({ label: v, group: "locations", value: v }));
  filters.projects.forEach((v) => activeFilterTags.push({ label: v, group: "projects", value: v }));
  filters.skills.forEach((v) => activeFilterTags.push({ label: v, group: "skills", value: v }));
  filters.availability.forEach((v) => activeFilterTags.push({ label: v, group: "availability", value: v }));

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } };
  const itemVariants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

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
        className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-28 pb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="font-serif text-3xl text-foreground mb-1">People</h1>
          <p className="text-sm text-muted-foreground">
            {results.length} of {EMPLOYEES.length} team members
            {activeCount > 0 && <span className="text-foreground/60"> · {activeCount} filter{activeCount !== 1 ? "s" : ""} active</span>}
          </p>
        </motion.div>

        {/* ━━━ PRESETS ━━━ */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4 flex-wrap">
          <Pin className="w-3 h-3 text-muted-foreground/50" strokeWidth={1.5} />
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="group flex items-center gap-1.5 text-xs px-3 py-1.5 border border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground transition-colors rounded-sm"
            >
              {preset.name}
              <span
                onClick={(e) => { e.stopPropagation(); removePreset(preset.id); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
              >
                <X className="w-3 h-3" strokeWidth={2} />
              </span>
            </button>
          ))}
          {activeCount > 0 && !savingPreset && (
            <button
              onClick={() => setSavingPreset(true)}
              className="flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              <Plus className="w-3 h-3" strokeWidth={1.5} />
              Save view
            </button>
          )}
          {savingPreset && (
            <div className="flex items-center gap-1.5">
              <input
                autoFocus
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && savePreset()}
                placeholder="View name…"
                className="text-xs border border-border bg-background px-2.5 py-1 w-36 outline-none focus:border-foreground/30 text-foreground placeholder:text-muted-foreground/40"
              />
              <button onClick={savePreset} className="text-xs text-foreground hover:underline">Save</button>
              <button onClick={() => setSavingPreset(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
            </div>
          )}
        </motion.div>

        {/* ━━━ TOOLBAR ━━━ */}
        <motion.div variants={itemVariants} className="mb-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <label htmlFor="people-search" className="sr-only">Search people</label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
              <input
                id="people-search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, role, or skill…"
                className="w-full text-sm bg-background border border-border pl-10 pr-4 py-2 outline-none focus:border-foreground/30 focus:ring-1 focus:ring-ring transition-colors placeholder:text-muted-foreground/50"
              />
            </div>

            <button
              onClick={() => { setFiltersOpen(!filtersOpen); setSortOpen(false); }}
              className={`flex items-center gap-2 text-xs px-4 py-2 border transition-colors shrink-0 ${
                filtersOpen || activeCount > 0
                  ? "border-foreground text-foreground bg-foreground/5"
                  : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.5} />
              Filter
              {activeCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-foreground text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                  {activeCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => { setSortOpen(!sortOpen); setFiltersOpen(false); }}
                className={`flex items-center gap-2 text-xs px-4 py-2 border transition-colors shrink-0 ${
                  sortOpen ? "border-foreground text-foreground bg-foreground/5" : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" strokeWidth={1.5} />
                {SORT_OPTIONS.find(o => o.key === sortKey)?.label ?? "Sort"} {sortAsc ? "↑" : "↓"}
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 w-56 bg-card border border-border shadow-lg z-50 py-1"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => {
                            if (sortKey === opt.key) setSortAsc(!sortAsc);
                            else { setSortKey(opt.key); setSortAsc(opt.key === "experience" || opt.key === "rate" ? false : true); }
                            setSortOpen(false);
                          }}
                          className={`w-full flex flex-col items-start px-4 py-2.5 text-left transition-colors ${
                            sortKey === opt.key ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <span className="flex items-center gap-2 w-full">
                            <span className={`text-xs ${sortKey === opt.key ? "font-medium" : ""}`}>{opt.label}</span>
                            {sortKey === opt.key && <span className="ml-auto text-[10px] text-muted-foreground">{sortAsc ? "↑" : "↓"}</span>}
                          </span>
                          <span className="text-[10px] text-muted-foreground/60 leading-tight mt-0.5">{opt.desc}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ━━━ FACETED FILTER PANEL ━━━ */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="border border-border bg-card p-5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                    <FacetGroup
                      label="Department"
                      options={ALL_DEPARTMENTS}
                      selected={filters.departments}
                      onToggle={(v) => toggleFilter("departments", v)}
                      counts={facetCounts.departments}
                    />
                    <FacetGroup
                      label="Location"
                      options={ALL_LOCATIONS}
                      selected={filters.locations}
                      onToggle={(v) => toggleFilter("locations", v)}
                      counts={facetCounts.locations}
                    />
                    <FacetGroup
                      label="Project"
                      options={ALL_PROJECTS}
                      selected={filters.projects}
                      onToggle={(v) => toggleFilter("projects", v)}
                      counts={facetCounts.projects}
                    />
                    <FacetGroup
                      label="Skill"
                      options={ALL_SKILLS}
                      selected={filters.skills}
                      onToggle={(v) => toggleFilter("skills", v)}
                      counts={facetCounts.skills}
                    />
                    <FacetGroup
                      label="Availability"
                      options={["available", "partial", "committed"]}
                      selected={filters.availability}
                      onToggle={(v) => toggleFilter("availability", v)}
                      counts={facetCounts.availability}
                    />
                  </div>

                  {activeCount > 0 && (
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-border/50">
                      <span className="text-[11px] text-muted-foreground">{results.length} result{results.length !== 1 ? "s" : ""}</span>
                      <button
                        onClick={() => { setFilters(emptyFilters()); setPage(1); }}
                        className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ━━━ ACTIVE TAGS (when panel closed) ━━━ */}
          {activeFilterTags.length > 0 && !filtersOpen && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {activeFilterTags.map((tag) => (
                <span
                  key={`${tag.group}-${tag.value}`}
                  className="inline-flex items-center gap-1.5 text-xs text-foreground bg-foreground/5 border border-foreground/15 px-2.5 py-1 rounded-sm"
                >
                  {tag.label}
                  <button
                    onClick={() => toggleFilter(tag.group, tag.value)}
                    className="hover:text-destructive transition-colors"
                    aria-label={`Remove ${tag.label} filter`}
                  >
                    <X className="w-3 h-3" strokeWidth={2} />
                  </button>
                </span>
              ))}
              <button
                onClick={() => { setFilters(emptyFilters()); setPage(1); }}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </motion.div>

        {/* ━━━ CARDS ━━━ */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paged.map((emp) => {
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
                    <span key={skill} className="text-[10px] text-muted-foreground border border-border px-2 py-0.5">
                      {skill}
                    </span>
                  ))}
                  {emp.skills.length > 4 && (
                    <span className="text-[10px] text-muted-foreground/50">+{emp.skills.length - 4}</span>
                  )}
                </div>

                {activeProjects.length > 0 && (
                  <div className="pt-2 border-t border-border/50">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60 flex items-center gap-1.5 mb-1.5">
                      <Briefcase className="w-3 h-3" strokeWidth={1.5} />
                      Active ({activeProjects.length})
                    </span>
                    {activeProjects.slice(0, 2).map((p) => (
                      <p key={p.name} className="text-[11px] text-foreground/70 truncate">{p.name}</p>
                    ))}
                    {activeProjects.length > 2 && (
                      <p className="text-[10px] text-muted-foreground/50">+{activeProjects.length - 2} more</p>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {results.length === 0 && (
          <div className="border border-border p-10 text-center mt-4">
            <p className="text-sm text-muted-foreground">No team members match your search and filters.</p>
            {activeCount > 0 && (
              <button
                onClick={() => { setFilters(emptyFilters()); setSearch(""); setPage(1); }}
                className="mt-2 text-xs text-foreground underline underline-offset-4"
              >
                Clear all and start over
              </button>
            )}
          </div>
        )}

        {/* ━━━ PAGINATION ━━━ */}
        {totalPages > 1 && (
          <motion.div variants={itemVariants} className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, results.length)} of {results.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 text-xs px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3 h-3" strokeWidth={1.5} />
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 text-xs transition-colors ${
                    p === page
                      ? "bg-foreground text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 text-xs px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
};

export default People;
