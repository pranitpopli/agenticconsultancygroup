import type {
  SwarmSession, ProjectBrief, TalentMatch, BriefRequirement,
} from "./types";
import { EMPLOYEES, OVERLAPPING_PROJECTS } from "./simulatedData";

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const AGENT_NAMES = ["Cipher", "Meridian", "Vesper", "Aether", "Prism"];

const MATCH_REASONS: Record<string, string[]> = {
  Engineering: [
    "Led two API migration projects with cross-functional teams",
    "Built and shipped the internal component library used across 4 products",
    "Architected the event-driven pipeline handling 2M daily events",
    "Delivered zero-downtime deployment system for all production services",
  ],
  Design: [
    "Designed the current design system used by every product team",
    "Led end-to-end UX research that increased onboarding conversion by 34%",
    "Created accessibility standards now adopted org-wide",
  ],
  "Data & Analytics": [
    "Built the recommendation engine driving 22% of user engagement",
    "Shipped churn prediction model with 89% accuracy in production",
    "Led analytics platform migration processing 50TB weekly",
  ],
  Infrastructure: [
    "Migrated entire cloud infrastructure with zero customer-facing downtime",
    "Implemented zero-trust security architecture across all services",
    "Built observability stack reducing incident response time by 60%",
  ],
  default: [
    "Strong cross-functional experience with relevant domain background",
    "Proven track record delivering complex initiatives on time",
  ],
};

const DOMAIN_LABELS = [
  "Infrastructure", "Platform", "Data", "Product", "Frontend",
  "Backend", "Security", "Design", "Analytics", "DevOps",
];

function parseBrief(text: string): ProjectBrief {
  const allSkills = [
    "React", "TypeScript", "Node.js", "Python", "AWS", "PostgreSQL", "Docker",
    "Kubernetes", "Machine Learning", "Design Systems", "Figma", "GraphQL",
    "Go", "Microservices", "Security", "Testing", "CI/CD", "Data Visualization",
    "NLP", "User Research", "Technical Writing", "Agile", "Project Management",
  ];

  const textLower = text.toLowerCase();
  const matched = allSkills.filter(s => textLower.includes(s.toLowerCase()));

  if (matched.length === 0) {
    if (textLower.includes("web") || textLower.includes("app") || textLower.includes("platform")) {
      matched.push("React", "TypeScript", "Node.js");
    }
    if (textLower.includes("data") || textLower.includes("analytics") || textLower.includes("ml") || textLower.includes("ai")) {
      matched.push("Python", "Machine Learning", "Data Visualization");
    }
    if (textLower.includes("design") || textLower.includes("ux") || textLower.includes("ui")) {
      matched.push("Figma", "Design Systems", "User Research");
    }
    if (textLower.includes("cloud") || textLower.includes("infrastructure") || textLower.includes("devops")) {
      matched.push("AWS", "Docker", "Kubernetes");
    }
    if (textLower.includes("security") || textLower.includes("compliance")) {
      matched.push("Security", "Testing");
    }
    if (matched.length === 0) {
      matched.push("React", "TypeScript", "Project Management");
    }
  }

  const domain = textLower.includes("data") || textLower.includes("analytics") ? "Data & Analytics" :
    textLower.includes("infra") || textLower.includes("cloud") || textLower.includes("devops") ? "Infrastructure" :
    textLower.includes("design") || textLower.includes("ux") ? "Design" : "Product & Engineering";

  return {
    id: `brief-${Date.now()}`,
    title: text.length > 60 ? text.slice(0, 60) + "…" : text,
    description: text,
    requiredSkills: [...new Set(matched)],
    teamSize: textLower.includes("large") || textLower.includes("complex") ? 6 :
      textLower.includes("small") || textLower.includes("quick") ? 3 : 5,
    domain,
  };
}

function generateThinkingLines(brief: ProjectBrief): string[] {
  return [
    "parsing brief...",
    `identifying domain: ${brief.domain.toLowerCase()}`,
    "scanning 847 employee nodes...",
    "cross-referencing project archive...",
    "checking active workstreams...",
    `${OVERLAPPING_PROJECTS.length} overlapping projects detected`,
    "14 candidate profiles matched",
    "calculating domain relevance scores...",
    "generating value model...",
    "assembling results...",
  ];
}

function scoreAndMatch(employee: typeof EMPLOYEES[0], brief: ProjectBrief): TalentMatch {
  const hasSkillOverlap = brief.requiredSkills.some(s =>
    employee.skills.some(es => es.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(es.toLowerCase()))
  );

  const strength = hasSkillOverlap ? 0.6 + Math.random() * 0.4 : 0.2 + Math.random() * 0.3;
  const domainLabel = randomFrom(employee.domainExpertise) || randomFrom(DOMAIN_LABELS);

  const deptReasons = MATCH_REASONS[employee.department] || MATCH_REASONS.default;

  // Check how many collaborators are in the employee list (for collaboration context)
  const shortlistCollabs = employee.collaborators.length;

  return {
    employee,
    whyMatch: randomFrom(deptReasons),
    domainRelevance: { label: domainLabel, strength },
    reasoning: `Ranked high due to ${employee.pastProjects.length} matching projects and shared tech stack with your brief.`,
    relevantProjects: employee.pastProjects.slice(0, 3),
    collaborationContext: shortlistCollabs > 0
      ? `Has collaborated with ${shortlistCollabs} others in the org on similar initiatives`
      : null,
    discoveredBy: randomFrom(AGENT_NAMES),
  };
}

function generateRequirements(brief: ProjectBrief): BriefRequirement[] {
  const reqs: string[] = [];

  if (brief.requiredSkills.length > 0) {
    // Group into higher-level requirements
    const hasBackend = brief.requiredSkills.some(s => ["Node.js", "Go", "PostgreSQL", "GraphQL", "Microservices"].includes(s));
    const hasFrontend = brief.requiredSkills.some(s => ["React", "TypeScript", "CSS", "Figma"].includes(s));
    const hasData = brief.requiredSkills.some(s => ["Python", "Machine Learning", "Data Visualization", "NLP"].includes(s));
    const hasInfra = brief.requiredSkills.some(s => ["AWS", "Docker", "Kubernetes", "CI/CD"].includes(s));
    const hasDesign = brief.requiredSkills.some(s => ["Figma", "Design Systems", "User Research"].includes(s));
    const hasSecurity = brief.requiredSkills.some(s => ["Security", "Testing"].includes(s));

    if (hasFrontend) reqs.push("Frontend Development");
    if (hasBackend) reqs.push("Backend Architecture");
    if (hasData) reqs.push("Data & ML");
    if (hasInfra) reqs.push("Infrastructure");
    if (hasDesign) reqs.push("Design & UX");
    if (hasSecurity) reqs.push("Security & QA");
  }

  if (reqs.length === 0) {
    reqs.push("Technical Delivery", "Project Coordination", "Quality Assurance");
  }

  reqs.push("Cross-functional Coordination");

  return reqs.map(label => ({ label, covered: false }));
}

export function createSession(taskText: string): SwarmSession {
  const brief = parseBrief(taskText);
  const thinkingLines = generateThinkingLines(brief);

  // Score all employees and sort
  const allMatches = EMPLOYEES.map(emp => scoreAndMatch(emp, brief));
  allMatches.sort((a, b) => b.domainRelevance.strength - a.domainRelevance.strength);

  // Calculate savings
  const totalHourly = allMatches.slice(0, brief.teamSize).reduce((sum, m) => sum + m.employee.hourlyRate, 0);
  const externalRate = totalHourly * 1.6;
  const savings = Math.round((externalRate - totalHourly) * 160); // one month

  return {
    id: `session-${Date.now()}`,
    brief,
    overlaps: OVERLAPPING_PROJECTS,
    discoveries: allMatches,
    thinkingLines,
    teamSummary: {
      shortlisted: [],
      requirements: generateRequirements(brief),
      savingsAmount: `£${savings.toLocaleString()}`,
      savingsCurrency: "GBP",
      assemblyTime: "38 seconds",
    },
  };
}
