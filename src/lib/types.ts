export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  skills: string[];
  availability: "available" | "partial" | "committed";
  hourlyRate: number;
  location: string;
  pastProjects: ProjectReference[];
  seniorityLevel: "junior" | "mid" | "senior" | "lead" | "principal";
  yearsExperience: number;
  avatarInitials: string;
  collaborators: string[]; // employee IDs
  technologies: string[];
  domainExpertise: string[];
}

export interface ProjectReference {
  name: string;
  year: number;
  role: string;
}

export interface OverlappingProject {
  id: string;
  name: string;
  year: number;
  department: string;
  outcome: "completed" | "stalled" | "cancelled";
  learnings: string[];
  peopleInvolved: string[]; // employee IDs
  estimatedTimeSaved: string;
}

export interface TalentMatch {
  employee: Employee;
  whyMatch: string; // plain language one-liner
  domainRelevance: { label: string; strength: number }; // 0-1
  reasoning: string; // one sentence trust signal
  relevantProjects: ProjectReference[];
  collaborationContext: string | null; // e.g. "Worked with 3 others on your shortlist"
  discoveredBy: string;
}

export interface BriefRequirement {
  label: string;
  covered: boolean;
}

export interface TeamSummary {
  shortlisted: TalentMatch[];
  requirements: BriefRequirement[];
  savingsAmount: string;
  savingsCurrency: string;
  assemblyTime: string;
}

export interface ProjectBrief {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  teamSize: number;
  domain: string;
}

export type AppStage = "brief" | "thinking" | "silo-check" | "overlap-detail" | "team-assembly";

export interface SwarmSession {
  id: string;
  brief: ProjectBrief;
  overlaps: OverlappingProject[];
  discoveries: TalentMatch[];
  teamSummary: TeamSummary;
  thinkingLines: string[];
}
