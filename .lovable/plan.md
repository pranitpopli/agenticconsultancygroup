

## Two changes: merge Archive into Briefings + redesign the swarm for real emergence

---

### 1. Merge Archive into the Briefings tab

Remove "Archive" as a separate nav item. Instead, add a status filter pill "Completed" to the existing Briefings page that reveals archived briefs inline alongside active ones. The nav shrinks from 6 items to 5.

**How it works:**
- Add archived briefs to the `allBriefs` list in `Index.tsx` with a new status value `"completed"`
- Add `"Completed"` to `STATUS_FILTERS` in `OverviewDashboard.tsx`
- Show outcome badges (Deployed / Partial / Shelved) on completed cards via `InboxCard`
- Remove `"archive"` tab from `BriefingNav.tsx` and the `ArchiveView` route from `Index.tsx`
- Keep `ArchiveView.tsx` file but it's no longer routed — the data lives in the briefings list

The nav becomes: **Overview · Briefings · Portfolio · Insights · People**

---

### 2. Redesign the swarm — flat multi-agent emergence, not tournament

The current `swarmSimulator.ts` runs a bracket tournament: agents pair off, losers are eliminated, one winner remains. This is **selection**, not **emergence**. Real emergence comes from independent agents working in parallel, each producing different outputs, and the system synthesising patterns across all of them — not picking a winner.

**The user's core question is right**: the buyer doesn't do consultancy work. They submit a brief, wait, and get back a recommendation they can act on. The swarm should feel like that — multiple perspectives converging into a decision, not a competition.

**New swarm model — Convergence, not elimination:**

Each agent independently analyses the brief from a different lens:
- **Cost Agent** — optimises for budget
- **Risk Agent** — identifies what could go wrong
- **Speed Agent** — minimises time-to-delivery
- **Talent Agent** — finds the best internal people
- **Culture Agent** — assesses organisational fit
- **Precedent Agent** — finds similar past projects

All agents run simultaneously. No elimination. Instead:
- Each produces a score + reasoning for their dimension
- Where agents **agree**, confidence is high (convergent signal)
- Where agents **disagree**, that's surfaced as a tension the user should consider
- The final output is a synthesis — not one agent's answer, but the emergent pattern across all six

**What changes in the UI:**
- `SwarmThinking` animation shows all 6 agents working in parallel (not sequential lines)
- Each agent's lens is visible: "Cost Agent: £142k internal vs £390k external — proceed"
- Convergence/divergence is shown: "5/6 agents recommend proceeding. Risk Agent flags timeline pressure."
- The briefing document's recommendation section references which agents contributed to each conclusion

**Technical changes:**
- Rewrite `swarmTypes.ts`: agents get a `lens` field instead of win/loss tracking
- Rewrite `swarmSimulator.ts`: remove tournament logic, add parallel evaluation with convergence scoring
- Update `SwarmThinking.tsx`: show a grid of agents working simultaneously, each revealing their conclusion
- Update briefing documents to reference agent consensus in the recommendation section

**Files to create/edit:**
- `src/lib/swarmTypes.ts` — new agent shape with lens, conclusion, confidence
- `src/lib/swarmSimulator.ts` — convergence model replacing tournament
- `src/components/SwarmThinking.tsx` — parallel agent visualisation
- `src/components/BriefingNav.tsx` — remove Archive tab
- `src/pages/Index.tsx` — merge archived briefs into allBriefs, remove archive view/route
- `src/components/OverviewDashboard.tsx` — add "Completed" status filter
- `src/components/InboxCard.tsx` — show outcome badge for completed briefs

