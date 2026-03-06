export interface Agent {
  id: string;
  name: string;
  score: number;
  reputation: number;
  monologue: string;
  output: string;
  status: "competing" | "winner" | "defeated" | "idle";
  wins: number;
  losses: number;
  rounds: number;
}

export interface Conflict {
  id: string;
  agentA: Agent;
  agentB: Agent;
  winnerId: string;
  timestamp: number;
  round: number;
}

export interface SwarmSession {
  id: string;
  task: string;
  agents: Agent[];
  conflicts: Conflict[];
  apexAgentId: string | null;
  status: "idle" | "running" | "complete";
  currentRound: number;
}
