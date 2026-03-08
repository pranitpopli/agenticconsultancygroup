import type { Agent, AgentLens, AgentSignal, ConvergenceResult, SwarmSession } from "./swarmTypes";

const LENS_CONFIG: Record<AgentLens, { name: string; label: string }> = {
  cost: { name: "Atlas", label: "Cost" },
  risk: { name: "Sentinel", label: "Risk" },
  speed: { name: "Meridian", label: "Speed" },
  talent: { name: "Cipher", label: "Talent" },
  culture: { name: "Vesper", label: "Culture" },
  precedent: { name: "Echo", label: "Precedent" },
};

export interface BriefAgentData {
  lens: AgentLens;
  conclusion: string;
  signal: AgentSignal;
  confidence: number;
  reasoning: string;
}

export function createSession(task: string, agentData: BriefAgentData[]): SwarmSession {
  const agents: Agent[] = agentData.map((d, i) => ({
    id: `agent-${d.lens}-${Date.now()}`,
    name: LENS_CONFIG[d.lens].name,
    lens: d.lens,
    status: "analysing" as const,
    confidence: d.confidence,
    conclusion: d.conclusion,
    signal: d.signal,
    reasoning: d.reasoning,
  }));

  return {
    id: `session-${Date.now()}`,
    task,
    agents,
    convergence: null,
    status: "idle",
  };
}

export function computeConvergence(agents: Agent[]): ConvergenceResult {
  const proceedCount = agents.filter((a) => a.signal === "proceed").length;
  const cautionCount = agents.filter((a) => a.signal === "caution").length;
  const flagCount = agents.filter((a) => a.signal === "flag").length;

  const convergent = agents
    .filter((a) => a.signal === "proceed")
    .map((a) => `${LENS_CONFIG[a.lens].label}: ${a.conclusion}`);

  const divergent = agents
    .filter((a) => a.signal !== "proceed")
    .map((a) => `${LENS_CONFIG[a.lens].label}: ${a.conclusion}`);

  const avgConfidence = agents.reduce((sum, a) => sum + a.confidence, 0) / agents.length;

  let overallSignal: ConvergenceResult["overallSignal"];
  if (flagCount >= 2) overallSignal = "defer";
  else if (cautionCount >= 2 || flagCount >= 1) overallSignal = "proceed-with-conditions";
  else overallSignal = "proceed";

  const summary =
    overallSignal === "proceed"
      ? `${proceedCount}/${agents.length} agents recommend proceeding. High convergence across all dimensions.`
      : overallSignal === "proceed-with-conditions"
        ? `${proceedCount}/${agents.length} agents recommend proceeding. ${cautionCount + flagCount} raised concerns requiring attention.`
        : `Only ${proceedCount}/${agents.length} agents recommend proceeding. Significant divergence detected — review recommended.`;

  return {
    agreeCount: proceedCount,
    totalAgents: agents.length,
    convergent,
    divergent,
    overallSignal,
    confidence: parseFloat(avgConfidence.toFixed(2)),
    summary,
  };
}

// Pre-built agent conclusions per brief
export const BRIEF_AGENTS: Record<string, BriefAgentData[]> = {
  "brief-001": [
    { lens: "cost", conclusion: "£186k internal vs £470k external — 60% saving", signal: "proceed", confidence: 0.92, reasoning: "Clear cost advantage. Internal team has existing context, eliminating ramp-up costs." },
    { lens: "risk", conclusion: "Legacy auth coupling introduces migration risk", signal: "caution", confidence: 0.71, reasoning: "Auth service dependency is under-documented. Feature-flag cutover mitigates but doesn't eliminate." },
    { lens: "speed", conclusion: "14–18 weeks achievable with phased rollout", signal: "proceed", confidence: 0.85, reasoning: "Timeline aligns with comparable past projects. Phase overlap reduces critical path." },
    { lens: "talent", conclusion: "5 strong matches from 3 departments", signal: "proceed", confidence: 0.94, reasoning: "All candidates have directly relevant experience. 3 have collaborated before." },
    { lens: "culture", conclusion: "Engineering-led initiative, low organisational friction", signal: "proceed", confidence: 0.88, reasoning: "All affected teams are within engineering. No cross-divisional politics expected." },
    { lens: "precedent", conclusion: "Similar scope completed in Platform Consolidation 2023", signal: "proceed", confidence: 0.90, reasoning: "Previous initiative took 12 weeks at smaller scope. Patterns are directly transferable." },
  ],
  "brief-002": [
    { lens: "cost", conclusion: "£210k internal vs £580k external — 64% saving", signal: "proceed", confidence: 0.89, reasoning: "Significant saving. ML infrastructure costs are lower internally due to existing SageMaker setup." },
    { lens: "risk", conclusion: "Legacy warehouse dependency is a blocking risk", signal: "flag", confidence: 0.62, reasoning: "Data warehouse migration timeline is uncertain. If it slips, Phase 1 is blocked entirely." },
    { lens: "speed", conclusion: "18–22 weeks with model training uncertainty", signal: "caution", confidence: 0.68, reasoning: "ML model accuracy is unpredictable. Training cycles may need extension. Phased delivery recommended." },
    { lens: "talent", conclusion: "5 matches from 4 departments — strong data team", signal: "proceed", confidence: 0.91, reasoning: "Aisha and Kenji are a proven ML pair. Sarah bridges engineering and data well." },
    { lens: "culture", conclusion: "Cross-team data ownership may cause friction", signal: "caution", confidence: 0.65, reasoning: "Three teams currently own overlapping data. Schema agreement requires executive sponsorship." },
    { lens: "precedent", conclusion: "Partial precedent from Knowledge Graph project", signal: "proceed", confidence: 0.78, reasoning: "Knowledge Graph tackled similar data unification. Recommendation engine failure provides learning." },
  ],
};

export const DEFAULT_BRIEF_AGENTS: BriefAgentData[] = [
  { lens: "cost", conclusion: "Internal approach shows significant cost advantage", signal: "proceed", confidence: 0.85, reasoning: "Standard internal vs external cost comparison favours in-house delivery." },
  { lens: "risk", conclusion: "No critical risks identified in initial assessment", signal: "proceed", confidence: 0.80, reasoning: "No conflicting workstreams or blocking dependencies detected." },
  { lens: "speed", conclusion: "12–16 weeks estimated delivery timeline", signal: "proceed", confidence: 0.78, reasoning: "Timeline based on comparable past initiatives." },
  { lens: "talent", conclusion: "3 candidate profiles matched across 2 departments", signal: "proceed", confidence: 0.82, reasoning: "Skill matching indicates sufficient internal capability." },
  { lens: "culture", conclusion: "Low organisational friction expected", signal: "proceed", confidence: 0.83, reasoning: "Initiative scope is contained within aligned business units." },
  { lens: "precedent", conclusion: "Limited but relevant precedent found", signal: "caution", confidence: 0.70, reasoning: "No exact match in project archive. Closest parallel provides partial guidance." },
];
