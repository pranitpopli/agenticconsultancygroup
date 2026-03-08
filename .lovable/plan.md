

## Product Gap Analysis — ACG Platform

After reviewing the entire codebase, here is the current flow and what's missing:

### Current Flow
```text
Dashboard ──→ Click Brief ──→ Swarm Thinking ──→ Silo Check ──→ Briefing Doc ──→ Conversation ──→ Export
                                                     │
                                                     ├── Review Overlaps (drawer)
                                                     └── Skip to Team

Tabs: Briefings | OQR | Archive
```

### What's Missing

**1. New brief submission is a dead end**
Submitting a brief shows a toast ("Your agents are analysing...") then resets. It never creates a new card or triggers the swarm → silo → doc flow. This is the most obvious gap — the primary action does nothing.

**2. Archive briefs can't be reopened**
Archived items expand inline with summary data, but there's no way to open them in the full interactive briefing document view. Users should be able to click through to the read-only doc.

**3. No mobile responsiveness**
The OQR page uses a 4-column KPI grid and 2-column chart layout that will break on small screens. The briefing document's comparison tables and Gantt chart also have no mobile handling.

**4. Orphaned components**
`InboxView`, `BriefInput`, `TaskInput`, `SwarmFeed`, `SwarmLeadNav`, `OikosNav`, `NavLink`, `AgentCard`, `TalentCard`, `TeamAssembly`, `TeamSummary` — none of these are imported or rendered anywhere. They're dead code.

**5. No team member interaction**
In the briefing document, team members are listed but not clickable. There's no way to view a person's full profile, past projects, or availability detail.

**6. No confirmation when leaving active conversation**
If a user is mid-conversation on a briefing doc and clicks "Back to briefings", all conversation state is lost with no warning.

**7. Export buttons are all stubs**
Every export action (PDF, PPTX, Jira push) shows a toast saying "This feature will be available in the next release." The slide deck preview works visually but nothing downloads.

**8. No brief status progression**
`BriefingSummary` has a `status` field (`swarm-ready`, `analysis-complete`, `swarm-searching`) but it's only used for display. There's no flow difference — all briefs behave identically regardless of status.

### Recommended Priority

| Priority | Gap | Impact |
|----------|-----|--------|
| 1 | New brief submission triggers swarm flow | Core product loop broken |
| 2 | Archive → open full briefing doc (read-only) | Natural user expectation |
| 3 | Mobile responsiveness for OQR + briefing doc | Usability |
| 4 | Clean up orphaned components | Code hygiene |
| 5 | Team member click-through profiles | Feature depth |
| 6 | Unsaved conversation warning | UX polish |

### Implementation Approach

**For #1 (new brief flow):** When the user submits a brief, generate a temporary brief ID, add it to the briefing summaries list with `swarm-searching` status, show a brief animation, then transition the status to `analysis-complete` and allow clicking through to the full swarm → silo → doc flow. This keeps everything client-side with simulated data.

**For #2 (archive reopening):** Add a "View full briefing" button inside the expanded archive card that navigates to `?view=briefing-doc&brief=arch-001` with the archived doc data. Render it in read-only mode (no conversation layer or input bar).

**For #3 (mobile):** Convert OQR KPI grid to `grid-cols-2` on mobile, stack charts vertically, and make comparison tables horizontally scrollable.

**For #4 (cleanup):** Delete the 10+ orphaned component files that aren't imported anywhere.

