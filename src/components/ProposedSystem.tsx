import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Users, Building2, Briefcase, Circle, History } from "lucide-react";
import type { ProposedSystem as ProposedSystemType } from "@/lib/briefingData";
import type { ProjectReference } from "@/lib/types";

interface Props {
  system: ProposedSystemType;
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  critical: { label: "Critical", className: "bg-destructive/10 text-destructive border-destructive/20" },
  high: { label: "High", className: "status-amber" },
  medium: { label: "Medium", className: "bg-muted text-muted-foreground border-border" },
  low: { label: "Low", className: "bg-muted/50 text-muted-foreground/60 border-border/50" },
};

const ProjectRow = ({ project }: { project: ProjectReference }) => {
  const priority = project.priority || "medium";
  const config = priorityConfig[priority];
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2 text-[11px]">
        {project.status === "active" && (
          <Circle className="w-2 h-2 fill-green-500 text-green-500 shrink-0" />
        )}
        <span className="text-foreground/80">{project.name}</span>
        <span className="text-muted-foreground/40">·</span>
        <span className="text-muted-foreground">{project.role}</span>
      </div>
      <span className={`text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 border ${config.className}`}>
        {config.label}
      </span>
    </div>
  );
};

const ProposedSystemView = ({ system }: Props) => {
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(
    new Set(system.departments.map((d) => d.name))
  );
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(
    new Set(system.departments.flatMap((d) => d.teams.map((t) => `${d.name}/${t.name}`)))
  );

  const toggleDept = (name: string) => {
    setExpandedDepts((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const toggleTeam = (key: string) => {
    setExpandedTeams((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const totalMembers = system.departments.reduce(
    (sum, d) => sum + d.teams.reduce((ts, t) => ts + t.members.length, 0), 0
  );

  return (
    <div className="space-y-6">
      <p className="text-sm text-foreground/80 leading-[1.8] mb-6">
        {system.narrative}
      </p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5" strokeWidth={1.5} />
          {system.departments.length} departments
        </span>
        <span>·</span>
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
          {totalMembers} members across {system.departments.reduce((s, d) => s + d.teams.length, 0)} teams
        </span>
      </div>

      <div className="space-y-3">
        {system.departments.map((dept, di) => {
          const deptOpen = expandedDepts.has(dept.name);
          return (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: di * 0.1 }}
              className="border border-border"
            >
              <button
                onClick={() => toggleDept(dept.name)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {deptOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{dept.name}</p>
                    <p className="text-xs text-muted-foreground">{dept.role}</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {dept.teams.length} {dept.teams.length === 1 ? "team" : "teams"}
                </span>
              </button>

              <AnimatePresence>
                {deptOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      {dept.teams.map((team) => {
                        const teamKey = `${dept.name}/${team.name}`;
                        const teamOpen = expandedTeams.has(teamKey);
                        return (
                          <div key={team.name} className="border-l-2 border-border pl-4">
                            <button
                              onClick={() => toggleTeam(teamKey)}
                              className="w-full flex items-center justify-between py-2 hover:text-foreground transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                {teamOpen ? (
                                  <ChevronDown className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
                                ) : (
                                  <ChevronRight className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
                                )}
                                <span className="text-xs font-medium text-foreground">{team.name}</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground">{team.focus}</span>
                            </button>

                            <AnimatePresence>
                              {teamOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="space-y-3 py-2">
                                    {team.members.map((m) => {
                                      const currentProjects = m.employee.pastProjects.filter(
                                        (p) => p.status === "active"
                                      );
                                      const pastProjects = m.employee.pastProjects.filter(
                                        (p) => p.status !== "active"
                                      );

                                      return (
                                        <div
                                          key={m.employee.id}
                                          className="py-2.5 pl-5 border-l border-border/50"
                                        >
                                          <div className="flex items-start justify-between mb-1.5">
                                            <div>
                                              <p className="text-xs font-medium text-foreground">
                                                {m.employee.name}
                                              </p>
                                              <p className="text-[11px] text-muted-foreground">
                                                {m.employee.role} · {m.employee.location}
                                              </p>
                                            </div>
                                            <span
                                              className={`text-[9px] uppercase tracking-[0.12em] px-2 py-0.5 border inline-block ${
                                                m.employee.availability === "available"
                                                  ? "status-green"
                                                  : m.employee.availability === "partial"
                                                  ? "status-amber"
                                                  : "text-muted-foreground bg-muted border-border"
                                              }`}
                                            >
                                              {m.employee.availability}
                                            </span>
                                          </div>

                                          <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                                            {m.responsibility}
                                          </p>

                                          {/* Current projects — what they're actively working on */}
                                          {currentProjects.length > 0 && (
                                            <div className="mt-2 pt-2 border-t border-border/30">
                                              <div className="flex items-center gap-1.5 mb-2">
                                                <Briefcase className="w-3 h-3 text-foreground/50" strokeWidth={1.5} />
                                                <span className="text-[10px] uppercase tracking-[0.12em] text-foreground/50 font-medium">
                                                  Currently working on
                                                </span>
                                              </div>
                                              <div className="space-y-0.5">
                                                {currentProjects.map((p) => (
                                                  <ProjectRow key={p.name} project={p} />
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {/* Past projects — completed work */}
                                          {pastProjects.length > 0 && (
                                            <div className="mt-3 pt-2 border-t border-border/20">
                                              <div className="flex items-center gap-1.5 mb-2">
                                                <History className="w-3 h-3 text-muted-foreground/40" strokeWidth={1.5} />
                                                <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/40">
                                                  Completed projects
                                                </span>
                                              </div>
                                              <div className="space-y-0.5">
                                                {pastProjects.map((p) => (
                                                  <ProjectRow key={p.name} project={p} />
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProposedSystemView;
