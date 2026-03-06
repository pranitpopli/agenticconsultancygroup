// OQR — Org Quarterly Review simulated data

export interface FinancialBreakdown {
  label: string;
  amount: number;
}

export interface AIProject {
  id: string;
  name: string;
  department: string;
  capability: string;
  status: "live" | "in-build" | "completed";
  startDate: string;
}

export interface DepartmentMaturity {
  name: string;
  score: number; // 0-100
  stage: "traditional" | "ai-augmented" | "ai-led";
}

export interface OQRData {
  totalSavings: number;
  previousQuarterSavings: number;
  currentQuarter: string;
  previousQuarter: string;
  financialBreakdown: FinancialBreakdown[];
  cfoSummary: string;
  aiProjects: AIProject[];
  activeDepartmentCount: number;
  orgMaturity: number;
  maturityDelta: number;
  departmentsCrossed: number;
  departments: DepartmentMaturity[];
}

export const OQR_DATA: OQRData = {
  totalSavings: 284000,
  previousQuarterSavings: 212000,
  currentQuarter: "Q1 2025",
  previousQuarter: "Q4 2024",
  financialBreakdown: [
    { label: "Recruitment avoided", amount: 112000 },
    { label: "Duplication prevented", amount: 68000 },
    { label: "Faster assembly", amount: 54000 },
    { label: "Rework saved", amount: 50000 },
  ],
  cfoSummary: "AI-assisted resourcing has reduced project spin-up costs by 34% since Q1.",
  aiProjects: [
    { id: "aip-1", name: "Platform Modernisation", department: "Engineering", capability: "Swarm Assembly", status: "live", startDate: "2025-01" },
    { id: "aip-2", name: "Customer Insights Pipeline", department: "Data & Analytics", capability: "Predictive Matching", status: "live", startDate: "2024-09" },
    { id: "aip-3", name: "Compliance Automation", department: "Legal", capability: "Duplicate Detection", status: "completed", startDate: "2024-06" },
    { id: "aip-4", name: "Design System Audit", department: "Design", capability: "Swarm Assembly", status: "completed", startDate: "2024-11" },
    { id: "aip-5", name: "Security Posture Review", department: "Infrastructure", capability: "Predictive Matching", status: "live", startDate: "2025-02" },
    { id: "aip-6", name: "Revenue Forecasting", department: "Finance", capability: "Predictive Matching", status: "in-build", startDate: "2025-03" },
    { id: "aip-7", name: "Talent Mobility Programme", department: "HR", capability: "Swarm Assembly", status: "live", startDate: "2024-08" },
    { id: "aip-8", name: "API Deprecation Tracker", department: "Engineering", capability: "Duplicate Detection", status: "live", startDate: "2025-01" },
    { id: "aip-9", name: "Vendor Risk Assessment", department: "Procurement", capability: "Predictive Matching", status: "in-build", startDate: "2025-02" },
    { id: "aip-10", name: "Onboarding Optimisation", department: "Product", capability: "Swarm Assembly", status: "live", startDate: "2024-10" },
    { id: "aip-11", name: "Content Localisation", department: "Marketing", capability: "Duplicate Detection", status: "completed", startDate: "2024-07" },
    { id: "aip-12", name: "Incident Triage", department: "Infrastructure", capability: "Predictive Matching", status: "live", startDate: "2024-12" },
    { id: "aip-13", name: "Sprint Velocity Insights", department: "Engineering", capability: "Predictive Matching", status: "live", startDate: "2025-01" },
    { id: "aip-14", name: "Knowledge Graph", department: "Data & Analytics", capability: "Swarm Assembly", status: "in-build", startDate: "2025-03" },
  ],
  activeDepartmentCount: 6,
  orgMaturity: 61,
  maturityDelta: 8,
  departmentsCrossed: 3,
  departments: [
    { name: "Engineering", score: 78, stage: "ai-augmented" },
    { name: "Data & Analytics", score: 72, stage: "ai-augmented" },
    { name: "Design", score: 55, stage: "ai-augmented" },
    { name: "Infrastructure", score: 65, stage: "ai-augmented" },
    { name: "Product", score: 48, stage: "traditional" },
    { name: "Finance", score: 35, stage: "traditional" },
    { name: "HR", score: 52, stage: "ai-augmented" },
    { name: "Legal", score: 28, stage: "traditional" },
    { name: "Marketing", score: 42, stage: "traditional" },
  ],
};
