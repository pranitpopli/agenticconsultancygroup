import { create } from "zustand";

export type BriefDecision = "approved" | "deferred" | null;

export interface ActivityEntry {
  id: string;
  briefId: string;
  briefTitle: string;
  action: string;
  detail: string;
  user: string;
  timestamp: Date;
}

interface BriefingStore {
  decisions: Record<string, BriefDecision>;
  activity: ActivityEntry[];
  setDecision: (briefId: string, briefTitle: string, decision: BriefDecision, user: string) => void;
  getDecision: (briefId: string) => BriefDecision;
  addActivity: (entry: Omit<ActivityEntry, "id" | "timestamp">) => void;
}

export const useBriefingStore = create<BriefingStore>((set, get) => ({
  decisions: {},
  activity: [],

  setDecision: (briefId, briefTitle, decision, user) => {
    set((state) => ({
      decisions: { ...state.decisions, [briefId]: decision },
      activity: [
        {
          id: `act-${Date.now()}`,
          briefId,
          briefTitle,
          action: decision === "approved" ? "Approved" : decision === "deferred" ? "Deferred" : "Reset",
          detail: decision === "approved"
            ? "Briefing approved — team can proceed with delivery."
            : decision === "deferred"
              ? "Briefing deferred for further review."
              : "Decision was reset.",
          user,
          timestamp: new Date(),
        },
        ...state.activity,
      ],
    }));
  },

  getDecision: (briefId) => get().decisions[briefId] ?? null,

  addActivity: (entry) => {
    set((state) => ({
      activity: [
        { ...entry, id: `act-${Date.now()}`, timestamp: new Date() },
        ...state.activity,
      ],
    }));
  },
}));
