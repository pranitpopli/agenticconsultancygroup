

## Critique: the IA is broken — here's what's wrong and how to fix it

### What the user actually does (in priority order)

1. **Act on recommendations** — review briefs that need a decision (approve / defer / modify)
2. **Submit new work** — get the swarm analysing something
3. **Monitor active projects** — are approved things on track?
4. **Understand org health** — am I improving over time?

### What the nav currently looks like

**Overview · Briefings · Portfolio · Insights · People**

### The problems

**1. Three executive dashboards, no action page.** Overview (OQR) shows org health metrics. Portfolio shows cross-project timelines and budget. Insights shows pattern detection. These are all "look at data" pages aimed at the same person (COO/CFO). The user's #1 task — "what needs my decision right now?" — has no dedicated surface. It's buried inside Briefings alongside submission and archive.

**2. Briefings page does three jobs.** It's an inbox (briefs needing action), a submission form (new briefs), and an archive (completed briefs). Three different intents, one scrolling page. The greeting says "3 briefs ready for review" but the user has to scroll past completed/deferred items to find them.

**3. Overview (OQR) and Portfolio overlap.** Both show project lists, department breakdowns, and financial data. A user looking at Portfolio sees "budget burn across projects" — then clicks Overview and sees "savings breakdown across projects." Same data, different angles, no link between them.

**4. Insights is orphaned.** Pattern detection cards sit on their own page with no connection to the briefs or projects they reference. "You've hired 3 external data engineers" — but clicking doesn't take you anywhere.

**5. People is a directory, not a decision tool.** It's useful during team assembly but irrelevant 90% of the time. It sits at the same nav level as the user's core workflow.

### Proposed IA restructure

```text
┌─────────────────────────────────────────────────────┐
│  ACG        Dashboard · Briefings · Organisation    │
│                                        [People] [⚙] │
└─────────────────────────────────────────────────────┘

Dashboard (new home page — action-oriented)
├── Briefs awaiting decision (count badge) → click → briefing doc
├── Projects at risk (from Portfolio alerts) → click → project detail
├── Top swarm insight (from Insights) → click → full insight
└── Quick stats: active projects, total savings, org maturity score

Briefings (focused on lifecycle)
├── Submit new brief (top, always visible)
├── Active briefs (needing action / in analysis)
└── Completed briefs (filterable, collapsed by default)

Organisation (merges Overview + Portfolio + Insights)
├── Tab: Health — OQR metrics, department maturity, capability radar
├── Tab: Portfolio — stacked Gantt, resource contention, budget burn
└── Tab: Insights — pattern detection cards with links to affected briefs/people
```

**People** moves to a utility position (avatar menu or secondary nav) — it's a reference tool, not a primary workflow.

### What this fixes

- **Task hierarchy matches nav hierarchy.** Dashboard = act now. Briefings = manage work. Organisation = understand context.
- **No redundancy.** One place for org-level data, tabbed by lens.
- **Action-oriented home.** The first thing the user sees is what needs their decision — like a consultancy partner walking in and saying "here's what matters today."
- **Route-aware nav.** BriefingNav uses `useLocation()` to derive active tab — no more manual `activeTab` props from every page.

### Technical changes

| File | Change |
|------|--------|
| `BriefingNav.tsx` | Replace `activeTab` prop with `useLocation()` path matching. Reduce tabs to Dashboard / Briefings / Organisation. Move People to utility position. |
| `src/pages/Dashboard.tsx` | New page — pulls top 3 actionable briefs, top portfolio alert, top insight. Links into existing pages. |
| `src/pages/Organisation.tsx` | New page — tabs for Health (current OQR content), Portfolio (current Portfolio content), Insights (current Insights content). |
| `src/pages/Index.tsx` | Becomes the Briefings page only. Remove greeting (moves to Dashboard). Separate "submit" section from "inbox" more clearly. |
| `App.tsx` | Update routes: `/` → Dashboard, `/briefings` → Index, `/organisation` → Organisation. Keep `/people` and `/people/:id`. |
| `OQR.tsx`, `Portfolio.tsx`, `Insights.tsx` | Content extracted into reusable components, rendered as tabs inside Organisation. Original pages become thin wrappers or are removed. |

### What this product still can't do (vs a consultancy)

- **No implementation support** — consultancies stay for delivery. The Delivery Tracker exists but it's passive. The swarm should proactively flag when milestones slip and suggest corrective actions.
- **No stakeholder alignment** — the brief goes to one user. Real consultancies present to a room. There's no shared review, no commenting, no approval workflows with multiple stakeholders.
- **No follow-up questions** — the swarm analyses and produces a doc. The user can't ask "what if we reduce scope by 30%?" before the doc is generated. The Conversation Layer exists inside the doc but it should be available during swarm analysis too.
- **No learning loop** — the Impact Ledger compares predicted vs actual, but there's no evidence this feeds back into future swarm predictions. The swarm should visibly get better over time.

These are the next features that would make a buyer say "cancel the consultancy retainer."

