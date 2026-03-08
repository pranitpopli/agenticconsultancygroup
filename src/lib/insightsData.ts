export type InsightSeverity = "critical" | "high" | "medium" | "low";
export type InsightCategory = "skill-gap" | "collaboration" | "failure-pattern" | "flight-risk" | "efficiency";

export interface SwarmInsight {
  id: string;
  category: InsightCategory;
  severity: InsightSeverity;
  title: string;
  detail: string;
  evidence: string[];
  affectedPeople: string[];
  affectedProjects: string[];
  recommendation: string;
  estimatedImpact: string;
  confidence: number; // 0-1
}

export const SWARM_INSIGHTS: SwarmInsight[] = [
  {
    id: "ins-001",
    category: "skill-gap",
    severity: "high",
    title: "Recurring external data engineering hires",
    detail: "In the last 6 months, 3 data engineering roles were filled externally at an average cost of £92k each. The organisation has 4 backend engineers with SQL and pipeline experience who could be upskilled in 8 weeks.",
    evidence: [
      "3 external data engineer hires in 6 months (avg £92k each)",
      "4 internal engineers with transferable skills identified",
      "Training cost estimated at £12k per person (8 weeks)",
    ],
    affectedPeople: ["emp-007", "emp-001"],
    affectedProjects: ["proj-002", "proj-005"],
    recommendation: "Invest £24k in training 2 internal engineers. Projected saving of £160k/year vs continued external hiring.",
    estimatedImpact: "£160,000/year saving",
    confidence: 0.82,
  },
  {
    id: "ins-002",
    category: "collaboration",
    severity: "medium",
    title: "Engineering and Design never co-staffed",
    detail: "Analysis of 24 projects over 2 years shows Engineering and Design have never been on the same project team simultaneously. Industry data suggests cross-functional pairing delivers 23% faster with 31% fewer post-launch revisions.",
    evidence: [
      "0 of 24 recent projects had Engineering + Design collaboration",
      "Industry benchmark: 23% faster delivery with cross-functional teams",
      "Post-launch revision rate: 2.1x higher on engineering-only projects",
    ],
    affectedPeople: ["emp-001", "emp-002", "emp-005", "emp-018"],
    affectedProjects: ["proj-001", "proj-003"],
    recommendation: "Embed a designer in the Platform Modernisation and Mobile App v4 teams. Start with 20% allocation to test the model.",
    estimatedImpact: "23% faster delivery",
    confidence: 0.71,
  },
  {
    id: "ins-003",
    category: "failure-pattern",
    severity: "critical",
    title: "Projects skipping stabilisation have 3x incident rate",
    detail: "Of 8 completed projects that compressed or removed the stabilisation phase, 6 experienced critical incidents within 30 days of launch. Projects with full stabilisation averaged 0.3 incidents in the same period.",
    evidence: [
      "6 of 8 compressed projects had critical post-launch incidents",
      "Average incident rate: 2.1/month (no stabilisation) vs 0.3/month (with)",
      "Mean recovery cost per incident: £18,000",
    ],
    affectedPeople: [],
    affectedProjects: ["proj-001", "proj-007"],
    recommendation: "Enforce minimum 2-week stabilisation phase on all projects. Flag any scenario model that removes it.",
    estimatedImpact: "£108,000/year avoided incident costs",
    confidence: 0.89,
  },
  {
    id: "ins-004",
    category: "flight-risk",
    severity: "critical",
    title: "4 of 6 senior engineers committed through Q3",
    detail: "The organisation has 6 senior+ engineers. 4 are committed to active projects through Q3 with no bench time. If any senior engineer leaves, 3 projects are immediately at risk of delay or failure.",
    evidence: [
      "Sarah Chen: Platform Modernisation + Payments v2 (weeks 1–20)",
      "Leo Martinelli: Platform Modernisation (weeks 1–16)",
      "James O'Brien: Platform Modernisation + SRE Programme (weeks 1–20)",
      "Raj Kapoor: committed status, Core Banking Modernisation",
    ],
    affectedPeople: ["emp-001", "emp-007", "emp-004", "emp-013"],
    affectedProjects: ["proj-001", "proj-004", "proj-007"],
    recommendation: "Begin cross-training mid-level engineers on critical workstreams. Create runbooks for all senior-led components by week 8.",
    estimatedImpact: "Risk mitigation for £641,000 in active projects",
    confidence: 0.94,
  },
  {
    id: "ins-005",
    category: "efficiency",
    severity: "medium",
    title: "Duplicate observability tooling across 3 teams",
    detail: "Infrastructure, Engineering, and SRE teams maintain separate monitoring stacks (Datadog, Prometheus+Grafana, and CloudWatch respectively). Consolidation would reduce tooling costs and eliminate conflicting alert sources.",
    evidence: [
      "3 separate monitoring stacks with overlapping coverage",
      "Annual tooling cost: £48,000 across all three",
      "Consolidated stack estimated at £22,000/year",
    ],
    affectedPeople: ["emp-004", "emp-019", "emp-011"],
    affectedProjects: ["proj-001", "proj-004"],
    recommendation: "Standardise on a single observability platform during Platform Modernisation. Migrate SRE to same stack.",
    estimatedImpact: "£26,000/year tooling saving",
    confidence: 0.76,
  },
  {
    id: "ins-006",
    category: "skill-gap",
    severity: "low",
    title: "No internal ML deployment expertise",
    detail: "While the organisation has strong ML research capability (Priya Patel, David Kim), there is no dedicated MLOps or model deployment expertise. Both recent ML projects required external support for production deployment.",
    evidence: [
      "2 of 2 ML projects needed external deployment support",
      "Average external deployment cost: £35,000 per project",
      "David Kim has partial MLOps skills but no production deployment experience",
    ],
    affectedPeople: ["emp-003", "emp-009"],
    affectedProjects: ["proj-002"],
    recommendation: "Send David Kim on MLOps certification (4 weeks, £4,500). Eliminates external dependency for future ML projects.",
    estimatedImpact: "£65,000/year saving on 2 planned ML projects",
    confidence: 0.68,
  },
];

export const INSIGHT_SUMMARY = {
  totalInsights: SWARM_INSIGHTS.length,
  criticalCount: SWARM_INSIGHTS.filter((i) => i.severity === "critical").length,
  totalEstimatedSaving: "£359,000/year",
  avgConfidence: Math.round(SWARM_INSIGHTS.reduce((s, i) => s + i.confidence, 0) / SWARM_INSIGHTS.length * 100),
  lastScanDate: "8 March 2025",
};
