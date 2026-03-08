import type { ImpactLedgerData } from "@/components/ImpactLedger";

export const IMPACT_LEDGER_DATA: Record<string, ImpactLedgerData> = {
  "brief-001": {
    predictedSaving: 284000,
    actualSaving: 312000,
    confidenceScore: 87,
    timeToValue: "6 weeks",
    metrics: [
      { metric: "Deploy time", predicted: "< 10 min", actual: "7 min", status: "exceeded" },
      { metric: "Incident response (MTTR)", predicted: "< 15 min", actual: "12 min", status: "exceeded" },
      { metric: "API latency (p99)", predicted: "< 200ms", actual: "185ms", status: "exceeded" },
      { metric: "Lighthouse score", predicted: "> 90", actual: "88", status: "below" },
      { metric: "Blocked teams", predicted: "0", actual: "0", status: "met" },
    ],
  },
  "brief-002": {
    predictedSaving: 370000,
    actualSaving: null,
    confidenceScore: 72,
    timeToValue: "Pending",
    metrics: [
      { metric: "Pipeline consolidation", predicted: "1 unified pipeline", actual: null, status: "pending" },
      { metric: "Metric consistency", predicted: "< 2% variance", actual: null, status: "pending" },
      { metric: "Churn prediction accuracy", predicted: "> 85%", actual: null, status: "pending" },
      { metric: "Infra cost reduction", predicted: "£34k/quarter", actual: null, status: "pending" },
    ],
  },
};
