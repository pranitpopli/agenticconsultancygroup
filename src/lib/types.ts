export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  skills: string[];
  availability: number; // 0-100 percentage
  hourlyRate: number;
  location: string;
  pastProjects: string[];
  seniorityLevel: "junior" | "mid" | "senior" | "lead" | "principal";
  yearsExperience: number;
}

export interface SkillMatch {
  skill: string;
  required: boolean;
  matchStrength: number; // 0-1
}

export interface TalentMatch {
  employee: Employee;
  matchScore: number; // 0-100
  skillMatches: SkillMatch[];
  reasoning: string;
  discoveredBy: string; // agent name
}

export interface SwarmAgent {
  id: string;
  name: string;
  focus: string; // e.g. "Skills Analyst", "Availability Scout"
  status: "scanning" | "analyzing" | "reporting" | "idle" | "complete";
  monologue: string;
  reputation: number;
  discoveryCount: number;
  currentAction: string;
}

export interface FinancialModel {
  traditionalCost: number;
  swarmCost: number;
  savingsPercent: number;
  timeToAssembleTraditional: number; // days
  timeToAssembleSwarm: number; // days
  utilisationImprovement: number; // percentage
  breakdown: {
    label: string;
    traditional: number;
    swarm: number;
  }[];
}

export interface OrgNarrative {
  title: string;
  body: string;
  keyInsights: string[];
}

export interface ProjectBrief {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  teamSize: number;
  timeline: string;
  priority: "low" | "medium" | "high" | "critical";
}

export interface SwarmSession {
  id: string;
  brief: ProjectBrief;
  agents: SwarmAgent[];
  discoveries: TalentMatch[];
  financialModel: FinancialModel | null;
  narrative: OrgNarrative | null;
  status: "idle" | "discovering" | "analyzing" | "complete";
  currentPhase: string;
  progress: number; // 0-100
  logs: SwarmLog[];
}

export interface SwarmLog {
  id: string;
  timestamp: number;
  agentName: string;
  message: string;
  type: "discovery" | "analysis" | "insight" | "consensus";
}
