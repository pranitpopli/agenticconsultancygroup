import { EMPLOYEES } from "./simulatedData";
import type { Employee } from "./types";

// Interfaces for data structures
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

export interface RiskRow {
  risk: string;
  likelihood: "high" | "medium" | "low";
  impact: "high" | "medium" | "low";
  mitigation: string;
}

export interface SuccessMetric {
  metric: string;
  baseline: string;
  target: string;
  measurement: string;
}

export type DecisionRecommendation = "proceed" | "proceed-with-conditions" | "defer";

export interface Scenario {
  id: string;
  name: string;
  description: string;
  cost: number;
  weeks: number;
  risk: "low" | "medium" | "high";
  scopePercent: number;
  teamSize: number;
  recommended?: boolean;
  included: string[];
  deferred: string[];
  tradeOffNarrative: string;
}


export type RACIRole = "R" | "A" | "C" | "I" | "—";

export interface RACIEntry {
  memberName: string;
  role: string;
  phases: RACIRole[];
}

export interface Milestone {
  name: string;
  complete: boolean;
}

export interface PhaseDeliveryStatus {
  phaseNumber: number;
  phaseTitle: string;
  progressPercent: number;
  milestones: Milestone[];
  blockers: string[];
}

export interface DeliveryStatus {
  approvedDate: string;
  overallProgress: number;
  phases: PhaseDeliveryStatus[];
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
  system: ProposedSystem;
  internalCost: number;
  externalCost: number;
  saving: number;
  costNarrative: string;
  comparison: ComparisonRow[];
  phases: Phase[];
  risks?: RiskRow[];
  successMetrics?: SuccessMetric[];
  recommendation?: DecisionRecommendation;
  scenarios?: Scenario[];
  raciMatrix?: RACIEntry[];
  deliveryStatus?: DeliveryStatus;
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
    status: "analysis-complete",
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
    system: {
      narrative: "This initiative spans three departments and five teams. The org structure below represents the cross-functional system assembled to deliver this project, showing how each business unit contributes specialised capability to the overall programme.",
      departments: [
        {
          name: "Engineering",
          role: "Core platform development and frontend migration",
          teams: [
            {
              name: "Platform Team",
              focus: "API gateway consolidation & backend services",
              members: [
                { employee: EMPLOYEES[0], responsibility: "Technical lead — owns API gateway architecture and migration sequencing" },
                { employee: EMPLOYEES[6], responsibility: "Backend services — event pipeline refactoring and microservice decomposition" },
              ],
            },
            {
              name: "Frontend Team",
              focus: "Component architecture migration & rendering pipeline",
              members: [
                { employee: EMPLOYEES[4], responsibility: "Frontend migration lead — component library modernisation and performance" },
              ],
            },
          ],
        },
        {
          name: "Infrastructure",
          role: "Deployment toolchain and observability",
          teams: [
            {
              name: "DevOps & Cloud",
              focus: "CI/CD pipeline, zero-downtime deployments, observability stack",
              members: [
                { employee: EMPLOYEES[3], responsibility: "Infrastructure lead — deployment pipeline and observability baseline" },
                { employee: EMPLOYEES[10], responsibility: "Security review — authentication service hardening and zero-trust compliance" },
              ],
            },
          ],
        },
        {
          name: "Quality",
          role: "Test strategy and performance validation",
          teams: [
            {
              name: "QA & Performance",
              focus: "End-to-end test framework, load testing, quality gates",
              members: [
                { employee: EMPLOYEES[7], responsibility: "QA lead — test automation framework and performance benchmarking" },
              ],
            },
          ],
        },
      ],
    },
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
    risks: [
      { risk: "Legacy auth service coupling delays API gateway migration", likelihood: "medium", impact: "high", mitigation: "Parallel auth service rebuild in Phase 1; feature-flag cutover to limit blast radius" },
      { risk: "Frontend migration causes regression in critical user flows", likelihood: "medium", impact: "medium", mitigation: "Phased rollout with A/B traffic splitting; automated visual regression tests" },
      { risk: "Key team member unavailability (illness, reassignment)", likelihood: "low", impact: "high", mitigation: "Cross-training in Phase 1; documented runbooks for all workstreams" },
      { risk: "Observability stack integration conflicts with existing monitoring", likelihood: "low", impact: "medium", mitigation: "Run new stack in parallel for 2 weeks before decommissioning legacy" },
    ],
    successMetrics: [
      { metric: "Deploy time", baseline: "45 minutes", target: "< 10 minutes", measurement: "CI/CD pipeline metrics, measured weekly from Phase 2" },
      { metric: "Incident response time", baseline: "34 min avg", target: "< 15 min avg", measurement: "PagerDuty MTTR across all services" },
      { metric: "API gateway latency (p99)", baseline: "420ms", target: "< 200ms", measurement: "Datadog APM, measured post-Phase 1" },
      { metric: "Frontend Lighthouse score", baseline: "62", target: "> 90", measurement: "Automated Lighthouse CI on every merge to main" },
      { metric: "Blocked product teams", baseline: "3 teams", target: "0 teams", measurement: "Sprint retrospective survey, measured end of Phase 3" },
    ],
    recommendation: "proceed",
    scenarios: [
      {
        id: "s1-full",
        name: "Full Scope",
        description: "Complete platform modernisation — API gateway, frontend migration, and observability stack.",
        cost: 186000,
        weeks: 16,
        risk: "medium",
        scopePercent: 100,
        teamSize: 6,
        recommended: true,
        included: [
          "API gateway consolidation",
          "Frontend component migration",
          "Unified observability stack",
          "Zero-downtime deployment pipeline",
          "Security hardening & zero-trust",
          "Full performance validation",
        ],
        deferred: [],
        tradeOffNarrative: "Delivers the complete vision with no compromises. The 16-week timeline allows phased rollout with overlap between workstreams, reducing integration risk. This is the recommended option because the technical debt is compounding — every quarter of delay increases incident rates and blocks product delivery.",
      },
      {
        id: "s1-compressed",
        name: "Compressed",
        description: "Same scope, tighter timeline. Parallel workstreams with higher coordination overhead.",
        cost: 210000,
        weeks: 11,
        risk: "high",
        scopePercent: 100,
        teamSize: 8,
        recommended: false,
        included: [
          "API gateway consolidation",
          "Frontend component migration",
          "Unified observability stack",
          "Zero-downtime deployment pipeline",
          "Security hardening & zero-trust",
          "Full performance validation",
        ],
        deferred: [],
        tradeOffNarrative: "Achieves full scope 5 weeks faster by running all three phases in parallel and adding two contractors. Cost increases by £24k due to additional headcount and coordination overhead. Risk rises to high because parallel workstreams on shared infrastructure create integration conflicts — the auth service cutover and frontend migration will overlap, requiring daily cross-team sync.",
      },
      {
        id: "s1-mvp",
        name: "MVP",
        description: "API gateway and observability only. Frontend migration deferred to a follow-up initiative.",
        cost: 112000,
        weeks: 10,
        risk: "low",
        scopePercent: 60,
        teamSize: 4,
        recommended: false,
        included: [
          "API gateway consolidation",
          "Unified observability stack",
          "Zero-downtime deployment pipeline",
          "Security hardening & zero-trust",
        ],
        deferred: [
          "Frontend component migration",
          "Full performance validation",
          "Lighthouse score improvement",
        ],
        tradeOffNarrative: "Addresses the most critical infrastructure debt (API gateway and observability) at 60% of the cost and timeline. However, the frontend technical debt continues to compound — Lighthouse scores will remain low and the product team stays partially blocked. A follow-up initiative would be needed within 2 quarters, and re-mobilisation costs ~£20k.",
      },
    ],
    raciMatrix: [
      { memberName: "Sarah Chen", role: "Tech Lead", phases: ["A", "C", "C"] },
      { memberName: "Leo Martinelli", role: "Backend Engineer", phases: ["R", "C", "I"] },
      { memberName: "James O'Brien", role: "DevOps Engineer", phases: ["R", "R", "C"] },
      { memberName: "Mei Lin", role: "Frontend Engineer", phases: ["I", "R", "C"] },
      { memberName: "Fatima Al-Rashidi", role: "QA Lead", phases: ["C", "C", "R"] },
      { memberName: "Omar Hassan", role: "Security Engineer", phases: ["C", "I", "I"] },
    ],
    deliveryStatus: {
      approvedDate: "5 March 2025",
      overallProgress: 38,
      phases: [
        {
          phaseNumber: 1,
          phaseTitle: "Foundation & API Gateway",
          progressPercent: 72,
          milestones: [
            { name: "API gateway architecture finalised", complete: true },
            { name: "New auth service deployed to staging", complete: true },
            { name: "Observability baseline configured", complete: true },
            { name: "Legacy auth feature-flag cutover", complete: false },
            { name: "API gateway production rollout", complete: false },
          ],
          blockers: [
            "Legacy auth service has undocumented dependency on billing module — requires 3-day investigation",
          ],
        },
        {
          phaseNumber: 2,
          phaseTitle: "Frontend Migration",
          progressPercent: 15,
          milestones: [
            { name: "Component library audit complete", complete: true },
            { name: "Design system tokens migrated", complete: false },
            { name: "Critical user flows migrated", complete: false },
            { name: "A/B traffic splitting enabled", complete: false },
            { name: "Visual regression tests passing", complete: false },
          ],
          blockers: [],
        },
        {
          phaseNumber: 3,
          phaseTitle: "Stabilisation & Handover",
          progressPercent: 0,
          milestones: [
            { name: "Load testing at 2x peak traffic", complete: false },
            { name: "Runbooks documented for all services", complete: false },
            { name: "Knowledge transfer sessions complete", complete: false },
            { name: "Platform support team onboarded", complete: false },
          ],
          blockers: [],
        },
      ],
    },
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
    system: {
      narrative: "This initiative requires coordination across four departments. The system below maps how data, engineering, design, and product capabilities converge to deliver the unified intelligence layer.",
      departments: [
        {
          name: "Data & Analytics",
          role: "Core data pipeline and ML model development",
          teams: [
            {
              name: "Data Science",
              focus: "Churn prediction, revenue forecasting, model validation",
              members: [
                { employee: EMPLOYEES[2], responsibility: "Technical lead — unified analytics architecture and ML model ownership" },
              ],
            },
            {
              name: "ML Engineering",
              focus: "Model training infrastructure, MLOps, deployment pipeline",
              members: [
                { employee: EMPLOYEES[8], responsibility: "ML infrastructure — model serving, training pipelines, and A/B test framework" },
              ],
            },
          ],
        },
        {
          name: "Engineering",
          role: "Data ingestion layer and service integrations",
          teams: [
            {
              name: "Integration Team",
              focus: "API layer connecting product, finance, and CRM systems",
              members: [
                { employee: EMPLOYEES[0], responsibility: "API design and data ingestion — service contracts and event streaming" },
              ],
            },
          ],
        },
        {
          name: "Design",
          role: "Executive dashboard and data visualisation",
          teams: [
            {
              name: "UX Research",
              focus: "Dashboard usability, stakeholder interviews, visualisation validation",
              members: [
                { employee: EMPLOYEES[9], responsibility: "User research lead — ensuring dashboards serve executive decision-making" },
              ],
            },
          ],
        },
        {
          name: "Product",
          role: "Documentation and developer experience",
          teams: [
            {
              name: "Technical Writing",
              focus: "Data dictionary, API documentation, onboarding guides",
              members: [
                { employee: EMPLOYEES[11], responsibility: "Documentation lead — data contracts, API specs, and knowledge base" },
              ],
            },
          ],
        },
      ],
    },
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
    risks: [
      { risk: "Legacy data warehouse migration dependency blocks pipeline unification", likelihood: "high", impact: "high", mitigation: "Identify minimal viable data subset; build adapter layer to work with both old and new warehouse" },
      { risk: "ML model accuracy below threshold delays churn prediction launch", likelihood: "medium", impact: "medium", mitigation: "Set clear go/no-go accuracy gates at week 12; fallback to rule-based scoring" },
      { risk: "Cross-team data ownership disputes stall schema agreement", likelihood: "medium", impact: "high", mitigation: "Appoint data steward per domain in Phase 1; escalation path to VP Data" },
      { risk: "GDPR/privacy constraints limit customer data unification", likelihood: "low", impact: "high", mitigation: "Privacy impact assessment in week 1; anonymisation pipeline built into ingestion layer" },
    ],
    successMetrics: [
      { metric: "Customer churn rate", baseline: "8.2% quarterly", target: "< 7.0% quarterly", measurement: "CRM churn dashboard, measured quarterly post-launch" },
      { metric: "Revenue forecast accuracy", baseline: "±22%", target: "±8%", measurement: "Finance variance report, monthly comparison" },
      { metric: "ETL pipeline duplication", baseline: "3 separate pipelines", target: "1 unified pipeline", measurement: "Infrastructure audit at end of Phase 1" },
      { metric: "Time to generate board report", baseline: "3 weeks manual", target: "< 1 day automated", measurement: "Timed end-to-end from data refresh to PDF output" },
    ],
    recommendation: "proceed-with-conditions",
    scenarios: [
      {
        id: "s2-full",
        name: "Full Scope",
        description: "Complete data intelligence layer — unified pipeline, ML models, and executive dashboard.",
        cost: 210000,
        weeks: 20,
        risk: "medium",
        scopePercent: 100,
        teamSize: 5,
        recommended: false,
        included: [
          "Unified ETL pipeline",
          "Churn prediction model",
          "Revenue forecasting model",
          "Executive dashboard",
          "CRM integration",
          "Data dictionary & documentation",
        ],
        deferred: [],
        tradeOffNarrative: "Delivers everything but carries medium risk due to the legacy data warehouse dependency. If the warehouse migration slips, Phase 1 data unification could be blocked for 4–6 weeks. The 20-week timeline assumes no external delays.",
      },
      {
        id: "s2-phased",
        name: "Phased Delivery",
        description: "Pipeline and one ML model first. Dashboard and second model in a follow-up phase.",
        cost: 148000,
        weeks: 14,
        risk: "low",
        scopePercent: 70,
        teamSize: 4,
        recommended: true,
        included: [
          "Unified ETL pipeline",
          "Churn prediction model",
          "Data dictionary & documentation",
          "Adapter layer for legacy warehouse",
        ],
        deferred: [
          "Revenue forecasting model",
          "Executive dashboard",
          "CRM integration",
        ],
        tradeOffNarrative: "Reduces risk by building the adapter layer first, isolating the team from warehouse migration delays. Delivers the highest-impact ML model (churn prediction) within 14 weeks. The deferred dashboard and revenue model can follow in a 6-week Phase 2 once the pipeline is stable. Recommended because it de-risks the warehouse dependency while still delivering measurable business value.",
      },
      {
        id: "s2-mvp",
        name: "Pipeline Only",
        description: "Data unification only. No ML models, no dashboard. Foundation for future work.",
        cost: 84000,
        weeks: 9,
        risk: "low",
        scopePercent: 35,
        teamSize: 3,
        recommended: false,
        included: [
          "Unified ETL pipeline",
          "Data dictionary & documentation",
          "Adapter layer for legacy warehouse",
        ],
        deferred: [
          "Churn prediction model",
          "Revenue forecasting model",
          "Executive dashboard",
          "CRM integration",
        ],
        tradeOffNarrative: "Solves the infrastructure problem (3 duplicate pipelines → 1) but delivers no business-facing intelligence. The board's Q2 retention mandate won't be addressed until ML models are built in a follow-up. Cost-effective as a foundation but doesn't move the needle on customer churn.",
      },
    ],
  },
};

// ━━━ Archived briefs ━━━

export interface ArchivedBrief {
  id: string;
  title: string;
  completedDate: string;
  submittedBy: { name: string; role: string };
  outcome: "deployed" | "partially-deployed" | "shelved";
  outcomeNote: string;
  doc: BriefingDocument;
}

export const ARCHIVED_BRIEFS: ArchivedBrief[] = [
  {
    id: "arch-001",
    title: "Cloud Migration Programme",
    completedDate: "12 January 2025",
    submittedBy: { name: "David Kim", role: "CTO" },
    outcome: "deployed",
    outcomeNote: "Fully deployed to production. Infrastructure costs reduced by 34% within first quarter. Team retained for ongoing optimisation.",
    doc: {
      ...BRIEFING_DOCUMENTS["brief-001"],
      id: "arch-001",
      title: "Cloud Migration Programme",
      initiative: [
        "Migration of 47 on-premise services to cloud infrastructure. Included containerisation, CI/CD pipeline redesign, and zero-downtime cutover strategy across three data centres.",
      ],
      internalCost: 142000,
      externalCost: 390000,
      saving: 248000,
      costNarrative: "Internal team delivered 36% under budget. External quote from two consultancies averaged £390k for comparable scope.",
      phases: [
        { number: 1, title: "Assessment & Containerisation", weeks: "Weeks 1–4", description: "Service audit, dependency mapping, and Docker containerisation of 47 services." },
        { number: 2, title: "Pipeline & Migration", weeks: "Weeks 4–10", description: "CI/CD redesign, staged migration with canary deployments." },
        { number: 3, title: "Cutover & Validation", weeks: "Weeks 10–12", description: "Zero-downtime cutover, performance validation, cost monitoring." },
      ],
    },
  },
  {
    id: "arch-002",
    title: "Internal Knowledge Graph",
    completedDate: "28 November 2024",
    submittedBy: { name: "Elena Vasquez", role: "VP Knowledge Management" },
    outcome: "partially-deployed",
    outcomeNote: "Core graph deployed and indexed 12,000 documents. Recommendation engine deferred to Q2 2025 due to model accuracy thresholds not being met.",
    doc: {
      ...BRIEFING_DOCUMENTS["brief-002"],
      id: "arch-002",
      title: "Internal Knowledge Graph",
      initiative: [
        "Organisation-wide knowledge graph connecting documentation, Slack conversations, and project artefacts. Goal was to reduce time-to-find from an average of 23 minutes to under 2 minutes.",
      ],
      internalCost: 98000,
      externalCost: 310000,
      saving: 212000,
      costNarrative: "Significant savings from internal assembly. The partially-deployed system still delivers 60% of projected value.",
      phases: [
        { number: 1, title: "Data Ingestion", weeks: "Weeks 1–6", description: "Connected 14 data sources including Confluence, Slack, and GitHub." },
        { number: 2, title: "Graph Construction", weeks: "Weeks 5–12", description: "Entity extraction, relationship mapping, and search index." },
        { number: 3, title: "Recommendation Engine", weeks: "Weeks 12–18", description: "ML-powered recommendations — deferred after accuracy review." },
      ],
    },
  },
  {
    id: "arch-003",
    title: "Automated Compliance Reporting",
    completedDate: "15 September 2024",
    submittedBy: { name: "Marcus Obi", role: "Head of Compliance" },
    outcome: "shelved",
    outcomeNote: "Shelved after regulatory framework changed in Q4 2024. Core data pipeline repurposed for the Customer Data Intelligence Layer (active brief).",
    doc: {
      ...BRIEFING_DOCUMENTS["brief-001"],
      id: "arch-003",
      title: "Automated Compliance Reporting",
      initiative: [
        "Automated generation of quarterly compliance reports by connecting transaction monitoring, audit logs, and regulatory requirement databases. Aimed to reduce manual reporting effort from 3 weeks to 2 days.",
      ],
      internalCost: 76000,
      externalCost: 220000,
      saving: 144000,
      costNarrative: "Despite being shelved, the data pipeline work was repurposed — estimated £40k of effort carried forward to the active Customer Data Intelligence brief.",
      phases: [
        { number: 1, title: "Requirements & Data Mapping", weeks: "Weeks 1–3", description: "Regulatory requirement taxonomy and data source mapping." },
        { number: 2, title: "Pipeline & Templates", weeks: "Weeks 3–8", description: "Automated data pipeline and report template engine." },
        { number: 3, title: "Validation & Audit", weeks: "Weeks 8–10", description: "Parallel run with manual process for validation. Shelved during this phase." },
      ],
    },
  },
];

// Build archive docs map for lookup
export const ARCHIVE_DOCUMENTS: Record<string, BriefingDocument> = Object.fromEntries(
  ARCHIVED_BRIEFS.map((b) => [b.id, b.doc])
);

// Generate a briefing document from user-submitted text
export function createBriefDocument(id: string, text: string): { summary: BriefingSummary; doc: BriefingDocument } {
  const title = text.length > 60 ? text.slice(0, 57) + "…" : text;
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const summary: BriefingSummary = {
    id,
    title,
    submittedBy: { name: "James Whitfield", role: "Director" },
    dateReceived: dateStr,
    aiSummary: `Custom initiative analysed by swarm agents. ${EMPLOYEES.length} employee nodes scanned, cross-referencing skills and availability.`,
    status: "analysis-complete",
  };

  const doc: BriefingDocument = {
    id,
    title,
    initiative: [text],
    feasibility: [
      { label: "Complexity", value: "Medium", detail: "Initial assessment based on brief analysis", indicator: "amber" },
      { label: "Timeline", value: "12–16 weeks estimated", detail: "Subject to team availability", indicator: "amber" },
      { label: "Risk", value: "Low", detail: "No conflicting workstreams detected", indicator: "green" },
    ],
    team: [
      { employee: EMPLOYEES[0], justification: "Strong technical leadership and cross-functional delivery experience." },
      { employee: EMPLOYEES[2], justification: "Domain expertise aligned with initiative requirements." },
      { employee: EMPLOYEES[4], justification: "Frontend and user experience capability." },
    ],
    teamContext: "This team was assembled based on skill matching and availability analysis.",
    system: {
      narrative: "Cross-functional system assembled to deliver this initiative.",
      departments: [
        {
          name: "Engineering",
          role: "Core development",
          teams: [{
            name: "Delivery Team",
            focus: "Primary implementation",
            members: [
              { employee: EMPLOYEES[0], responsibility: "Technical lead" },
              { employee: EMPLOYEES[4], responsibility: "Frontend development" },
            ],
          }],
        },
        {
          name: "Data & Analytics",
          role: "Data capability",
          teams: [{
            name: "Analytics",
            focus: "Data and insights",
            members: [
              { employee: EMPLOYEES[2], responsibility: "Data lead" },
            ],
          }],
        },
      ],
    },
    internalCost: 156000,
    externalCost: 420000,
    saving: 264000,
    costNarrative: "Internal assembly avoids external consultancy costs and retains institutional knowledge.",
    comparison: [
      { dimension: "Cost", internal: "£156,000", external: "£420,000" },
      { dimension: "Time to assemble", internal: "35 seconds", external: "4–6 weeks" },
      { dimension: "Org knowledge retained", internal: "Full", external: "None" },
      { dimension: "Post-project value", internal: "Team stays in org", external: "Knowledge leaves" },
    ],
    phases: [
      { number: 1, title: "Discovery & Setup", weeks: "Weeks 1–4", description: "Requirements validation, architecture design, and team onboarding." },
      { number: 2, title: "Core Development", weeks: "Weeks 4–12", description: "Primary implementation phase with iterative delivery." },
      { number: 3, title: "Validation & Launch", weeks: "Weeks 12–16", description: "Testing, performance validation, and phased rollout." },
    ],
  };

  return { summary, doc };
}
