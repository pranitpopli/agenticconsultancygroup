

## What consultancies actually sell (that this product doesn't yet do)

Having explored the full codebase, here's what exists today:

**You have**: Brief intake → swarm analysis → team assembly → briefing document → scenario modelling → risk register → RACI → Gantt → delivery tracking → board deck export → OQR org health metrics → people search

**What's missing** — the things that make a company renew a consultancy engagement year after year:

---

### 1. Portfolio Command Centre (highest impact)

Consultancies never look at one project in isolation. They see the whole portfolio. Right now each briefing is independent — there's no view that says "across your 12 active projects, 4 are competing for the same 3 engineers, and if Project Alpha slips by 2 weeks it blocks Project Gamma."

**What to build**: A `/portfolio` page showing:
- All active projects on a single timeline (stacked Gantt)
- Resource contention heatmap — which people are double-booked across projects
- Budget burn across the portfolio (total committed vs. available)
- Swarm-generated alerts: "Project B and Project D both need a senior data engineer in weeks 4-8. Only one is available."

This is the single feature that would make a CFO or COO say "we need this."

---

### 2. Impact Ledger (post-delivery accountability)

Consultancies promise value but rarely prove it. The swarm can. After a project completes, track whether the predicted savings and success metrics actually materialised.

**What to build**: A section in each completed briefing (and a roll-up on the dashboard) showing:
- Predicted vs. actual cost savings
- Success metrics at baseline vs. current measured value
- Time-to-value: how quickly did the project start delivering
- A "confidence score" that improves over time as the swarm learns which predictions were accurate

This creates a feedback loop — the swarm gets better at estimating because it learns from its own track record.

---

### 3. Organisational Pattern Detection (emergent swarm behaviour)

This is what makes the swarm genuinely different from a human consultant. A consultant sees maybe 3-4 projects at once. The swarm sees everything simultaneously and detects patterns no human would notice.

**What to build**: A `/insights` page (or a section in the OQR) with swarm-surfaced patterns:
- **Skill gaps**: "You've hired 3 external data engineers in the last 6 months. Training 2 internal engineers would save £180k/year."
- **Collaboration blind spots**: "Engineering and Design have never been on the same project team. Projects with cross-functional pairing deliver 23% faster."
- **Recurring failures**: "Projects that skip the stabilisation phase have a 3x higher post-launch incident rate."
- **Talent flight risk**: "4 of your 6 senior engineers are committed to projects through Q3. If any leave, 3 projects are immediately at risk."

Each insight has a severity, affected projects/people, and a recommended action.

---

### 4. Change Readiness Assessment

Consultancies spend 30-40% of their time on change management — not the technical work, but ensuring the organisation can actually absorb the change. This is completely absent from the product.

**What to build**: A change readiness score per briefing, generated alongside the feasibility analysis:
- Stakeholder mapping: who benefits, who loses, who blocks
- Adoption risk: how many teams are affected, how different is the new process
- Communication plan: auto-generated timeline of announcements, training sessions, feedback checkpoints
- Historical pattern: "Similar changes in this department took 8 weeks to reach 80% adoption"

---

### 5. Benchmark Intelligence

Consultancies justify their fees partly by saying "we've seen this at 50 other companies." The swarm equivalent: aggregate anonymised patterns across the organisation's own history.

**What to build**: Contextual benchmarks embedded in briefings:
- "This project's cost-per-engineer-week is 18% above your org average"
- "Similar-scope projects in your company took 14 weeks on average; this estimate of 16 weeks is conservative"
- "Teams of this size typically have 2.3 scope changes; budget accordingly"

These appear as subtle annotations in the briefing document, not a separate page.

---

### Implementation priority

| Priority | Feature | Why it sells |
|----------|---------|-------------|
| 1 | Portfolio Command Centre | Executives can't get this view today without a programme office |
| 2 | Pattern Detection / Insights | This is the "AI magic" — emergent behaviour humans can't replicate |
| 3 | Impact Ledger | Proves ROI, creates retention loop |
| 4 | Benchmark Intelligence | Low effort (annotations in existing briefings), high perceived value |
| 5 | Change Readiness | Differentiator, but more complex to simulate convincingly |

### Technical approach

- Portfolio page: new route `/portfolio`, reads from existing briefing data, adds a cross-project timeline component (extends the existing `GanttChart`) and a resource contention grid
- Insights: new route `/insights`, simulated pattern data in a new `insightsData.ts`, card-based layout with severity and affected entities
- Impact Ledger: extends existing `DeliveryTracker` with a "post-delivery" state and predicted-vs-actual comparison rows
- Benchmarks: inline annotations in `BriefingDocument.tsx`, data from a `benchmarkData.ts` file
- Change Readiness: new section in the briefing document, new component `ChangeReadiness.tsx`

All simulated data — no backend required. The swarm simulation already exists; these features are what the swarm *outputs*.

