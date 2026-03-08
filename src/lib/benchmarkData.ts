export interface BenchmarkAnnotation {
  section: string; // which briefing section this applies to
  metric: string;
  currentValue: string;
  orgAverage: string;
  comparison: "above" | "below" | "inline";
  narrative: string;
}

export const BENCHMARKS: Record<string, BenchmarkAnnotation[]> = {
  "brief-001": [
    {
      section: "cost",
      metric: "Cost per engineer-week",
      currentValue: "£2,325",
      orgAverage: "£1,960",
      comparison: "above",
      narrative: "This project's cost-per-engineer-week is 18% above your org average, driven by senior-heavy staffing.",
    },
    {
      section: "timeline",
      metric: "Timeline for similar scope",
      currentValue: "16 weeks",
      orgAverage: "14 weeks",
      comparison: "above",
      narrative: "Similar-scope projects in your company took 14 weeks on average. This estimate of 16 weeks is conservative — accounts for legacy auth complexity.",
    },
    {
      section: "risk",
      metric: "Scope changes per project",
      currentValue: "Est. 2",
      orgAverage: "2.3",
      comparison: "inline",
      narrative: "Teams of this size typically have 2.3 scope changes. Budget accordingly — this project has built-in scenario flexibility.",
    },
    {
      section: "team",
      metric: "Team experience ratio",
      currentValue: "80% senior+",
      orgAverage: "55% senior+",
      comparison: "above",
      narrative: "This team skews more experienced than your org norm. Reduces execution risk but increases cost.",
    },
  ],
  "brief-002": [
    {
      section: "cost",
      metric: "Cost per data scientist-week",
      currentValue: "£2,580",
      orgAverage: "£2,100",
      comparison: "above",
      narrative: "Data science staffing costs are 23% above org average. Consider blending senior and mid-level to reduce cost.",
    },
    {
      section: "timeline",
      metric: "ML project typical duration",
      currentValue: "22 weeks",
      orgAverage: "18 weeks",
      comparison: "above",
      narrative: "ML projects in your org average 18 weeks. The 22-week estimate includes model validation cycles not present in simpler analytics projects.",
    },
    {
      section: "risk",
      metric: "Data project failure rate",
      currentValue: "Medium risk",
      orgAverage: "35% incomplete",
      comparison: "above",
      narrative: "35% of data projects in your org history were marked incomplete or descoped. Ensure stakeholder alignment on deliverables early.",
    },
  ],
};
