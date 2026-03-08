export type AgentLens = "cost" | "risk" | "speed" | "talent" | "culture" | "precedent";

export type AgentSignal = "proceed" | "caution" | "flag";

export interface Agent {
  id: string;
  name: string;
  lens: AgentLens;
  status: "analysing" | "concluded";
  confidence: number;
  conclusion: string;
  signal: AgentSignal;
  reasoning: string;
}

export interface ConvergenceResult {
  agreeCount: number;
  totalAgents: number;
  convergent: string[];
  divergent: string[];
  overallSignal: "proceed" | "proceed-with-conditions" | "defer";
  confidence: number;
  summary: string;
}

export interface SwarmSession {
  id: string;
  task: string;
  agents: Agent[];
  convergence: ConvergenceResult | null;
  status: "idle" | "running" | "converging" | "complete";
}
