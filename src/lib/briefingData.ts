import { EMPLOYEES } from "./simulatedData";
import type { Employee } from "./types";

export interface FeasibilityRow {
  label: string;
  value: string;
  detail: string;
  indicator: "green" | "amber" | "red";
}

export interface TeamMember {
  employee: Employee;
  justification: string;
}

export interface SystemMember {
  employee: Employee;
  responsibility: string;
}

export interface ProjectTeam {
  name: string;
  focus: string;
  members: SystemMember[];
}

export interface ProjectDepartment {
  name: string;
  role: string;
  teams: ProjectTeam[];
}

export interface ProposedSystem {
  narrative: string;
  departments: ProjectDepartment[];
}

export interface ComparisonRow {
  dimension: string;
  internal: string;
  external: string;
}

export interface Phase {
  number: number;
  title: string;
  weeks: string;
  description: string;
}

export interface BriefingSummary {
  id: string;
  title: string;
  submittedBy: { name: string; role: string };
  dateReceived: string;
  aiSummary: string;
  status: "swarm-ready" | "analysis-complete" | "swarm-searching";
}

export interface BriefingDocument {
  id: string;
  title: string;
  initiative: string[];
  feasibility: FeasibilityRow[];
  team: TeamMember[];
  teamContext: string;
  internalCost: number;
  externalCost: number;
  saving: number;
  costNarrative: string;
  comparison: ComparisonRow[];
  phases: Phase[];
}

export const BRIEFING_SUMMARIES: BriefingSummary[] = [
  {
    id: "brief-001",
    title: "Platform Modernisation Initiative",
    submittedBy: { name: "Amara Osei", role: "Engineering Manager" },
    dateReceived: "4 March 2025",
    aiSummary: "Cross-functional infrastructure rebuild spanning API layer, frontend framework, and observability stack. Five team members recommended from three departments.",
    status: "analysis-complete",
  },
  {
    id: "brief-002",
    title: "Customer Data Intelligence Layer",
    submittedBy: { name: "Priya Patel", role: "Lead Data Scientist" },
    dateReceived: "3 March 2025",
    aiSummary: "Unified analytics pipeline connecting product, finance, and customer success data. ML-driven churn prediction and revenue forecasting components identified.",
    status: "swarm-ready",
  },
];

export const BRIEFING_DOCUMENTS: Record<string, BriefingDocument> = {
  "brief-001": {
    id: "brief-001",
    title: "Platform Modernisation Initiative",
    initiative: [
      "The engineering organisation is proposing a comprehensive modernisation of the core platform infrastructure. The current system, built incrementally over five years, has accumulated significant technical debt across the API layer, frontend rendering pipeline, and deployment toolchain. Three teams are currently blocked by shared dependencies on a legacy authentication service, and incident response times have increased 40% quarter-on-quarter due to observability gaps.",
      "This initiative would consolidate the API gateway, migrate the frontend to a modern component architecture, and establish a unified observability stack. The work directly supports the organisation's Q2 objective of reducing time-to-deploy from 45 minutes to under 10 minutes, and would unblock the product roadmap for the next two quarters.",
    ],
    feasibility: [
      { label: "Complexity", value: "Medium", detail: "Similar initiatives have been completed in this org before", indicator: "amber" },
      { label: "Timeline", value: "14–18 weeks estimated", detail: "Based on comparable scope from Platform Consolidation 2023", indicator: "amber" },
      { label: "Risk", value: "Low", detail: "No active conflicts or duplicate workstreams detected", indicator: "green" },
    ],
    team: [
      { employee: EMPLOYEES[0], justification: "Led API migration 2022, cross-functional delivery experience. Architected the current API Gateway." },
      { employee: EMPLOYEES[6], justification: "Built event-driven pipeline handling 2M daily events. Core backend expertise in Go and microservices." },
      { employee: EMPLOYEES[3], justification: "Infrastructure lead for Cloud Migration 2023. Zero-downtime deployment specialist." },
      { employee: EMPLOYEES[4], justification: "Frontend component library author, performance optimisation lead. React and TypeScript expert." },
      { employee: EMPLOYEES[7], justification: "QA framework architect, load testing specialist. Will ensure quality gates throughout migration." },
    ],
    teamContext: "This team was assembled based on 4 matching prior projects and 3 existing collaboration relationships.",
    internalCost: 186000,
    externalCost: 470000,
    saving: 284000,
    costNarrative: "Assembling this team internally avoids a six-figure consultancy engagement and retains institutional knowledge.",
    comparison: [
      { dimension: "Cost", internal: "£186,000", external: "£470,000" },
      { dimension: "Time to assemble", internal: "38 seconds", external: "4–6 weeks" },
      { dimension: "Org knowledge retained", internal: "Full", external: "None" },
      { dimension: "Post-project value", internal: "Team stays in org", external: "Knowledge leaves" },
    ],
    phases: [
      { number: 1, title: "Foundation & API Gateway", weeks: "Weeks 1–6", description: "Consolidate API gateway, establish new authentication service, and set up observability baseline across all affected services." },
      { number: 2, title: "Frontend Migration", weeks: "Weeks 5–12", description: "Migrate frontend to modern component architecture with parallel rendering pipeline. Phased rollout to reduce risk." },
      { number: 3, title: "Stabilisation & Handover", weeks: "Weeks 12–16", description: "Performance validation, load testing at scale, documentation, and knowledge transfer to platform support team." },
    ],
  },
  "brief-002": {
    id: "brief-002",
    title: "Customer Data Intelligence Layer",
    initiative: [
      "The data and analytics team is proposing a unified intelligence layer that connects currently siloed data streams from product analytics, financial reporting, and customer success tooling. At present, three separate teams maintain overlapping ETL pipelines, resulting in inconsistent metrics and duplicated infrastructure costs estimated at £34,000 per quarter.",
      "The proposed system would introduce a single source of truth for customer data, powered by a real-time event pipeline and augmented with machine learning models for churn prediction and revenue forecasting. This directly supports the board's Q2 mandate to improve customer retention by 15% and establish predictive revenue reporting.",
    ],
    feasibility: [
      { label: "Complexity", value: "High", detail: "Requires coordination across three data-owning teams", indicator: "red" },
      { label: "Timeline", value: "18–22 weeks estimated", detail: "Includes model training and validation cycles", indicator: "amber" },
      { label: "Risk", value: "Medium", detail: "Dependency on legacy data warehouse migration completing first", indicator: "amber" },
    ],
    team: [
      { employee: EMPLOYEES[2], justification: "Built recommendation engine driving 22% engagement. Led analytics platform migration processing 50TB weekly." },
      { employee: EMPLOYEES[8], justification: "NLP pipeline architect, ML infrastructure specialist. PyTorch and SageMaker expertise." },
      { employee: EMPLOYEES[0], justification: "API design expert, will build data ingestion layer and service integrations." },
      { employee: EMPLOYEES[11], justification: "Technical documentation lead, will ensure data dictionary and API specs are comprehensive." },
      { employee: EMPLOYEES[9], justification: "UX researcher for dashboard design, ensuring data visualisations serve decision-makers." },
    ],
    teamContext: "This team was assembled based on 3 matching data projects and 2 existing collaboration relationships.",
    internalCost: 210000,
    externalCost: 580000,
    saving: 370000,
    costNarrative: "Internal assembly avoids a major data consultancy engagement and builds lasting analytical capability within the organisation.",
    comparison: [
      { dimension: "Cost", internal: "£210,000", external: "£580,000" },
      { dimension: "Time to assemble", internal: "42 seconds", external: "6–8 weeks" },
      { dimension: "Org knowledge retained", internal: "Full", external: "Partial at best" },
      { dimension: "Post-project value", internal: "Models improve over time", external: "Static deliverable" },
    ],
    phases: [
      { number: 1, title: "Data Unification", weeks: "Weeks 1–8", description: "Consolidate ETL pipelines into unified event stream. Establish data contracts between product, finance, and customer success teams." },
      { number: 2, title: "ML Model Development", weeks: "Weeks 6–16", description: "Train and validate churn prediction and revenue forecasting models against historical data. Deploy to staging for A/B testing." },
      { number: 3, title: "Dashboard & Integration", weeks: "Weeks 14–20", description: "Build executive dashboard with real-time metrics, integrate predictions into CRM and finance tooling, and conduct user research validation." },
    ],
  },
};
