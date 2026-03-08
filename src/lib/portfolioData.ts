import { EMPLOYEES } from "./simulatedData";
import type { Employee } from "./types";

export interface PortfolioProject {
  id: string;
  name: string;
  brief: string;
  startWeek: number;
  endWeek: number;
  budget: number;
  spent: number;
  progress: number;
  status: "on-track" | "at-risk" | "blocked";
  team: string[]; // employee IDs
  department: string;
}

export interface ResourceConflict {
  employeeId: string;
  employee: Employee;
  projects: { projectId: string; projectName: string; weeks: string }[];
  severity: "critical" | "warning";
}

export interface SwarmAlert {
  id: string;
  type: "contention" | "dependency" | "budget" | "timeline";
  severity: "critical" | "warning" | "info";
  title: string;
  detail: string;
  affectedProjects: string[];
  recommendation: string;
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "proj-001",
    name: "Platform Modernisation",
    brief: "brief-001",
    startWeek: 1,
    endWeek: 16,
    budget: 186000,
    spent: 72000,
    progress: 38,
    status: "at-risk",
    team: ["emp-001", "emp-004", "emp-005", "emp-007", "emp-008", "emp-011"],
    department: "Engineering",
  },
  {
    id: "proj-002",
    name: "Customer Data Intelligence",
    brief: "brief-002",
    startWeek: 3,
    endWeek: 22,
    budget: 242000,
    spent: 18000,
    progress: 12,
    status: "on-track",
    team: ["emp-003", "emp-009", "emp-017", "emp-010", "emp-012"],
    department: "Data & Analytics",
  },
  {
    id: "proj-003",
    name: "Mobile App v4",
    brief: "",
    startWeek: 2,
    endWeek: 14,
    budget: 145000,
    spent: 89000,
    progress: 62,
    status: "on-track",
    team: ["emp-015", "emp-016", "emp-002", "emp-014"],
    department: "Engineering",
  },
  {
    id: "proj-004",
    name: "SRE Maturity Programme",
    brief: "",
    startWeek: 1,
    endWeek: 20,
    budget: 95000,
    spent: 41000,
    progress: 45,
    status: "on-track",
    team: ["emp-019", "emp-004", "emp-011"],
    department: "Infrastructure",
  },
  {
    id: "proj-005",
    name: "Data Lake Migration",
    brief: "",
    startWeek: 4,
    endWeek: 18,
    budget: 178000,
    spent: 32000,
    progress: 22,
    status: "at-risk",
    team: ["emp-017", "emp-003", "emp-009"],
    department: "Data & Analytics",
  },
  {
    id: "proj-006",
    name: "Brand Refresh 2024",
    brief: "",
    startWeek: 6,
    endWeek: 12,
    budget: 62000,
    spent: 28000,
    progress: 55,
    status: "on-track",
    team: ["emp-018", "emp-002", "emp-010"],
    department: "Design",
  },
  {
    id: "proj-007",
    name: "Payments v2",
    brief: "",
    startWeek: 5,
    endWeek: 20,
    budget: 210000,
    spent: 45000,
    progress: 25,
    status: "blocked",
    team: ["emp-014", "emp-007", "emp-001", "emp-008"],
    department: "Engineering",
  },
];

function findConflicts(): ResourceConflict[] {
  const employeeProjects: Record<string, { projectId: string; projectName: string; weeks: string }[]> = {};

  PORTFOLIO_PROJECTS.forEach((proj) => {
    proj.team.forEach((empId) => {
      if (!employeeProjects[empId]) employeeProjects[empId] = [];
      employeeProjects[empId].push({
        projectId: proj.id,
        projectName: proj.name,
        weeks: `W${proj.startWeek}–W${proj.endWeek}`,
      });
    });
  });

  return Object.entries(employeeProjects)
    .filter(([, projects]) => projects.length > 1)
    .map(([empId, projects]) => ({
      employeeId: empId,
      employee: EMPLOYEES.find((e) => e.id === empId)!,
      projects,
      severity: projects.length >= 3 ? "critical" as const : "warning" as const,
    }))
    .filter((c) => c.employee)
    .sort((a, b) => (a.severity === "critical" ? -1 : 1) - (b.severity === "critical" ? -1 : 1));
}

export const RESOURCE_CONFLICTS: ResourceConflict[] = findConflicts();

export const SWARM_ALERTS: SwarmAlert[] = [
  {
    id: "alert-001",
    type: "contention",
    severity: "critical",
    title: "Sarah Chen is allocated to 3 concurrent projects",
    detail: "Platform Modernisation, Payments v2, and her availability is listed as 'available'. She cannot realistically contribute to both at full capacity during weeks 5–16.",
    affectedProjects: ["proj-001", "proj-007"],
    recommendation: "Reassign Payments v2 backend lead to Leo Martinelli (currently at 60% capacity) or defer Payments v2 Phase 1 by 4 weeks.",
  },
  {
    id: "alert-002",
    type: "dependency",
    severity: "critical",
    title: "Data Lake Migration blocks Customer Data Intelligence",
    detail: "The Customer Data Intelligence project depends on the unified data lake (proj-005). If Data Lake Migration slips past week 14, the ML model training phase has no data source.",
    affectedProjects: ["proj-002", "proj-005"],
    recommendation: "Prioritise Data Lake core schema delivery by week 12. Consider parallel track with synthetic data for ML training.",
  },
  {
    id: "alert-003",
    type: "budget",
    severity: "warning",
    title: "Portfolio budget utilisation at 68% with 45% delivery",
    detail: "Across all active projects, £325k of £1.12M has been spent but average progress is only 37%. At current burn rate, 3 projects will exceed budget.",
    affectedProjects: ["proj-001", "proj-005", "proj-007"],
    recommendation: "Review scope for at-risk projects. Consider MVP scenarios for Platform Modernisation and Payments v2.",
  },
  {
    id: "alert-004",
    type: "contention",
    severity: "warning",
    title: "Thomas Müller is double-booked across data projects",
    detail: "Both Data Lake Migration and Customer Data Intelligence require his data engineering expertise in overlapping weeks 4–18.",
    affectedProjects: ["proj-002", "proj-005"],
    recommendation: "Stagger his involvement: Data Lake weeks 4–12 (full), then transition to Customer Data Intelligence weeks 13–22.",
  },
  {
    id: "alert-005",
    type: "timeline",
    severity: "info",
    title: "Brand Refresh completing ahead of Mobile App v4 launch",
    detail: "Brand Refresh (proj-006) is on track to finish week 12, 2 weeks before Mobile App v4 (week 14). New brand assets can be incorporated into the app.",
    affectedProjects: ["proj-003", "proj-006"],
    recommendation: "Coordinate handoff: schedule brand asset integration sprint in Mobile App v4 during weeks 12–13.",
  },
];

export const PORTFOLIO_TOTALS = {
  totalBudget: PORTFOLIO_PROJECTS.reduce((s, p) => s + p.budget, 0),
  totalSpent: PORTFOLIO_PROJECTS.reduce((s, p) => s + p.spent, 0),
  activeProjects: PORTFOLIO_PROJECTS.length,
  totalPeople: new Set(PORTFOLIO_PROJECTS.flatMap((p) => p.team)).size,
  avgProgress: Math.round(PORTFOLIO_PROJECTS.reduce((s, p) => s + p.progress, 0) / PORTFOLIO_PROJECTS.length),
};
