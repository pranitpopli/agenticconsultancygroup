

## Product Gap Analysis — What Consultancies Deliver That ACG Doesn't Yet

After reviewing the full codebase and product flow, here's what's missing compared to what a real consultancy engagement delivers. These are ranked by how much they'd differentiate ACG and reduce the user's need for external help.

---

### What ACG does well already
- Team assembly with cost comparison
- Feasibility assessment
- Phased delivery plan with Gantt
- Org maturity impact (OQR)
- Conversational iteration on the briefing
- Board presentation generation

### What's missing

**1. Risk Register — consultancies always deliver this**
Every feasibility brief from McKinsey/Deloitte includes a risk matrix. ACG has a 3-line feasibility table (complexity, timeline, risk) but no detailed risk register with mitigations. A senior leader can't present to a board without addressing "what could go wrong."

Add a new Section 03.5 to the briefing doc: a risk table with columns for risk, likelihood (high/medium/low), impact, and mitigation. Data already exists in `briefingData.ts` feasibility rows — extend it.

**2. RACI / Stakeholder Map — who approves, who's accountable**
The briefing shows WHO is on the team but not their governance role. Consultancies always provide a RACI (Responsible, Accountable, Consulted, Informed) matrix. This is critical for the user — they need to know who signs off, not just who codes.

Add a RACI grid below the Proposed System section. Map each team member to R/A/C/I per phase. Data derives from existing `team` and `phases` arrays.

**3. Success Metrics / KPIs — how do you know it worked?**
The briefing has no measurable outcomes. It says "reduce deploy time from 45 to 10 minutes" in the initiative text but doesn't surface this as a trackable KPI. Consultancies always define 3-5 measurable success criteria with baselines and targets.

Add a "Success Criteria" section with a simple table: metric, current baseline, target, measurement method.

**4. Scenario Modelling — what if we cut scope or extend timeline?**
The conversation layer handles "compress to 10 weeks" but the response is a single text block. Consultancies present side-by-side scenarios: "Option A: 14 weeks, full scope, £186k" vs "Option B: 10 weeks, reduced scope, £142k" vs "Option C: 8 weeks, MVP only, £98k."

Add a scenario comparison view that shows 2-3 options with trade-offs. This makes ACG a decision tool, not just a document generator.

**5. Executive Decision Summary — the one-pager**
The briefing is 6 sections long. A senior leader sometimes needs a 30-second view: what is it, what does it cost, what's the risk, should I approve it. Consultancies always provide this as page 1.

Add a collapsible "Decision Summary" card at the top of the briefing — before Section 01. Shows: recommendation (proceed/defer/reject), cost, risk level, timeline, and an "Approve" / "Request changes" action.

**6. Post-Approval Status Tracking**
Once a briefing is approved and work begins, ACG has no way to track progress. The archive shows outcomes retroactively, but there's no live tracking. Consultancies provide weekly status reports and milestone tracking.

Add a "In Progress" tab or state to briefs. Show phase progress bars, milestone completion, and blockers. This keeps users inside ACG after the briefing is approved.

---

### Recommended Implementation Priority

| Feature | Effort | Impact | Why |
|---------|--------|--------|-----|
| Risk Register | Small | High | Board-blocking gap — can't present without it |
| Success Metrics / KPIs | Small | High | Makes outcomes measurable, not just aspirational |
| Executive Decision Summary | Medium | High | Saves the most time for the user's actual goal |
| Scenario Modelling | Medium | High | Transforms ACG from document to decision tool |
| RACI / Stakeholder Map | Small | Medium | Governance clarity, especially for cross-functional work |
| Post-Approval Tracking | Large | Medium | Keeps users in ACG long-term, but big build |

### What I'd build first (Batch 1)

1. **Risk Register** — new section in briefing doc with risk/likelihood/impact/mitigation table. Add `risks` array to `BriefingDocument` interface and seed data.
2. **Success Metrics** — new section with KPI table. Add `successMetrics` array to `BriefingDocument` interface.
3. **Executive Decision Summary** — collapsible card at top of briefing with recommendation, key numbers, and approve/defer actions.

These three additions would make ACG's output indistinguishable from a consultancy deliverable — but generated in seconds instead of weeks.

