export interface Stakeholder {
  name: string;
  role: string;
  stance: "champion" | "supporter" | "neutral" | "resistant";
  influence: "high" | "medium" | "low";
}

export interface CommunicationEvent {
  week: number;
  type: "announcement" | "training" | "feedback" | "review";
  audience: string;
  description: string;
}

export interface ChangeReadinessData {
  overallScore: number; // 0-100
  adoptionRisk: "low" | "medium" | "high";
  teamsAffected: number;
  historicalPattern: string;
  stakeholders: Stakeholder[];
  communicationPlan: CommunicationEvent[];
}

export const CHANGE_READINESS: Record<string, ChangeReadinessData> = {
  "brief-001": {
    overallScore: 72,
    adoptionRisk: "medium",
    teamsAffected: 5,
    historicalPattern: "Similar infrastructure changes in Engineering took 8 weeks to reach 80% adoption. Developer tooling changes historically face initial resistance but high long-term satisfaction (NPS +34 after 3 months).",
    stakeholders: [
      { name: "Amara Osei", role: "Engineering Manager", stance: "champion", influence: "high" },
      { name: "Raj Kapoor", role: "Platform Architect", stance: "supporter", influence: "high" },
      { name: "Lena Johansson", role: "Product Manager", stance: "neutral", influence: "medium" },
      { name: "Henrik Nilsson", role: "SRE Lead", stance: "supporter", influence: "medium" },
      { name: "Richard Okonkwo", role: "Finance Director", stance: "neutral", influence: "high" },
    ],
    communicationPlan: [
      { week: 1, type: "announcement", audience: "All Engineering", description: "Initiative kickoff — scope, timeline, and why now" },
      { week: 2, type: "training", audience: "Platform Team", description: "New API gateway architecture walkthrough" },
      { week: 4, type: "feedback", audience: "Affected teams", description: "First migration checkpoint — collect friction points" },
      { week: 6, type: "announcement", audience: "All Engineering", description: "Phase 1 progress update and Phase 2 preview" },
      { week: 8, type: "training", audience: "Frontend Team", description: "Component library migration guide and pairing sessions" },
      { week: 10, type: "feedback", audience: "All Engineering", description: "Mid-project retrospective — adoption blockers" },
      { week: 14, type: "review", audience: "Leadership", description: "Final review — metrics, adoption rate, remaining work" },
      { week: 16, type: "announcement", audience: "All Engineering", description: "Project completion — new runbooks and support channels" },
    ],
  },
  "brief-002": {
    overallScore: 58,
    adoptionRisk: "high",
    teamsAffected: 4,
    historicalPattern: "Data platform changes affect workflow habits across multiple teams. Previous analytics migration (2023) took 14 weeks to reach 60% adoption. Teams using legacy dashboards continued for 3 months post-migration.",
    stakeholders: [
      { name: "Priya Patel", role: "Lead Data Scientist", stance: "champion", influence: "high" },
      { name: "Thomas Müller", role: "Data Engineer", stance: "supporter", influence: "medium" },
      { name: "Richard Okonkwo", role: "Finance Director", stance: "resistant", influence: "high" },
      { name: "Elena Rodriguez", role: "UX Researcher", stance: "neutral", influence: "low" },
    ],
    communicationPlan: [
      { week: 1, type: "announcement", audience: "Data & Analytics + Finance", description: "Vision for unified data layer — benefits per team" },
      { week: 3, type: "training", audience: "Data Team", description: "New pipeline architecture and migration plan" },
      { week: 6, type: "feedback", audience: "All data consumers", description: "Dashboard migration preview — collect requirements" },
      { week: 10, type: "training", audience: "Finance + Product", description: "New reporting tools walkthrough" },
      { week: 14, type: "feedback", audience: "All stakeholders", description: "Adoption check — identify teams still on legacy" },
      { week: 18, type: "review", audience: "Leadership", description: "Impact assessment — data quality and adoption metrics" },
    ],
  },
};
