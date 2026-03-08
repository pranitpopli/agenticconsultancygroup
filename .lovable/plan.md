

## Final Product Critique — ACG (Agentic Consultancy Group)

This is a comprehensive assessment across UX, product logic, design system, technical architecture, and commercial viability. Organised from most impactful to least.

---

### 1. The product has no backend — everything resets on refresh

Every decision, activity entry, and submitted brief lives in Zustand (in-memory) or localStorage (auth only). Approve a brief, refresh the page, and the approval is gone. The activity feed is always empty on first load. Dynamic briefs vanish. This makes the product feel like a prototype, not software.

**What to build:**
- Connect Supabase for persistent storage: briefs, decisions, activity log, user preferences
- Auth should use Supabase Auth instead of localStorage email derivation (current auth is trivially bypassable)
- Settings page notifications/preferences should persist

---

### 2. Mobile navigation is completely broken

On screens below ~768px, the nav items (Dashboard, Briefings, Organisation, People, avatar) overflow horizontally with no wrapping, no hamburger menu, and no scrolling. The ACG logo and "DASHBOARD" merge into one unreadable string. This makes the entire product unusable on mobile.

**What to build:**
- Hamburger menu on mobile with a slide-out drawer containing all nav items
- Or a bottom tab bar pattern (more native-feeling for a tool used frequently)

---

### 3. No loading or empty states anywhere

- Dashboard shows "Briefs Awaiting Decision" only if `status === "analysis-complete"` — but this is hardcoded static data. A new user would see an empty page with no guidance.
- Briefings page shows "No briefs yet" but the submit form is buried at the bottom of the page, below the empty card list. It should be promoted when there are no briefs.
- Organisation tabs have no loading skeletons — they pop in instantly because data is static, but with a real backend they'd flash blank.
- Person profile shows "Person not found" as plain text with no visual treatment.

**What to build:**
- Empty state illustrations or guided prompts for each page
- Skeleton loaders for all data-dependent sections
- Move "Submit a new brief" above the brief list when the list is empty

---

### 4. The swarm analysis is theatrical but non-interactive

The SwarmThinking animation shows agents "analysing" with a timed reveal, but:
- The user cannot influence which agents run or what they analyse
- There's no way to ask "what if" during analysis (the Conversation Layer only appears after the document is generated)
- The convergence result is predetermined — the same brief always produces the same output
- Skip button jumps to Silo Check, but there's no way to go back to the swarm view once you've left it

**What to build:**
- Allow the user to ask clarifying questions during the swarm phase (move Conversation Layer earlier)
- Let the user adjust agent weights or priorities before running ("focus on cost" vs "focus on speed")
- Make the analysis actually variable — randomise confidence values, introduce branching conclusions

---

### 5. Briefing documents are dense but not actionable enough

The BriefingDocument is impressive in scope (RACI, Gantt, risk register, scenarios, benchmarks, delivery tracker, impact ledger) but:
- The Table of Contents exists but doesn't scroll-to-section (no anchor links)
- The Executive Decision Summary (approve/defer) is buried at the bottom — the most important action requires scrolling past 15+ sections
- Export/print is a banner, not a proper PDF generation
- The Conversation Layer responses are keyword-matched strings, not contextual — "replace sarah" works but "can we swap Sarah for someone cheaper?" does not

**What to build:**
- Move Executive Decision Summary to a sticky sidebar or floating action bar
- Add working anchor navigation from the Table of Contents
- Implement proper PDF export (html2pdf or server-side)
- Replace keyword matching in ConversationLayer with fuzzy matching or an LLM call

---

### 6. Organisation page tabs don't cross-link

- Health tab shows "Active Projects: 2" but clicking doesn't navigate to the Portfolio tab
- Portfolio alerts mention specific people ("Sarah Chen is allocated to 3 projects") but clicking doesn't go to her profile
- Insights cards reference briefs and people but have no links
- The Gantt chart in Portfolio is a simplified bar chart — it doesn't show dependencies, milestones, or critical path

**What to build:**
- Make all entity references (people names, project names, brief titles) clickable links
- Add dependency arrows to the Gantt timeline
- Add drill-down from KPI cards to filtered views

---

### 7. People directory is disconnected from the workflow

- The People page is a well-built filterable directory, but it exists in isolation
- There's no way to go from a person's profile to the briefs they're involved in
- There's no way to assign people to briefs from the People page
- The "collaborators" section on PersonProfile links to other people but not to shared projects
- Filter presets are stored in component state — they reset on navigation

**What to build:**
- Add "Active briefs" section to PersonProfile showing which briefs this person is on
- Allow starring/shortlisting people from the directory for use in brief assembly
- Persist filter presets in localStorage or Supabase

---

### 8. Design system inconsistencies

- Login page uses frosted glass (`backdrop-blur-md bg-card/70`); no other page uses this treatment
- Some borders use `rounded-sm`, others use no rounding at all — inconsistent corner radii
- Status badges use different implementations: some are `text-[10px] uppercase` inline spans, others use the `badge` component from shadcn
- The `--radius` CSS variable is set to `0.25rem` but most custom components use `rounded-sm` or no rounding
- Font sizes jump between `text-[10px]`, `text-[11px]`, `text-xs`, `text-sm` without a clear scale
- Some cards use `p-5`, others `p-6`, others `p-8` — no consistent spacing token

**What to build:**
- Establish a spacing scale: `p-4` (compact), `p-6` (standard), `p-8` (feature cards)
- Standardise all status badges into a single `StatusBadge` component
- Audit font sizes: pick 4 sizes and stick to them
- Remove `border-radius` entirely (the product's aesthetic is sharp/editorial) or apply it consistently

---

### 9. No notifications, no real-time updates

- The Settings page has notification toggles (brief updates, team changes, weekly digest) but they do nothing
- There's no notification bell or indicator anywhere in the nav
- When a brief is approved, there's no notification to the submitter
- The Dashboard has no way to surface "what changed since your last visit"

**What to build:**
- Add a notification centre (bell icon in nav with dropdown)
- Track "last seen" timestamp and highlight new items on Dashboard
- Wire notification preferences to actual delivery (even simulated for demo)

---

### 10. Language switcher is cosmetic

The nav dropdown has English/Svenska toggle but:
- No i18n framework is installed
- Changing language does nothing — all strings are hardcoded in English
- The setting resets on page reload (stored in component state)

**What to fix:**
- Either remove the language switcher entirely (it sets false expectations) or implement `react-i18next` with at least two languages

---

### 11. Accessibility gaps

- The nav dropdown uses `role="menu"` but items don't have `role="menuitem"` consistently
- The swarm animation canvas has no `aria-label` or alternative text
- Focus management: after login, focus isn't moved to the main content
- The Briefings status filter uses `role="radiogroup"` correctly but filter buttons on other pages don't
- Color contrast: muted text at `text-muted-foreground/40` and `text-muted-foreground/60` likely fails WCAG AA on the warm background
- No skip-to-content link

---

### 12. Performance considerations

- The SwarmBackground canvas runs a 60fps animation loop even when the login page is not visible (no cleanup on unmount verification needed)
- All portfolio data, employee data, briefing data, and insight data is imported eagerly — no code splitting
- The People page re-computes facet counts on every keystroke across the full employee dataset
- No `React.memo` on expensive list items (InboxCard, employee cards)

---

### 13. What's missing to replace a consultancy

| Capability | Current state | Gap |
|---|---|---|
| Multi-stakeholder review | Single user approves/defers | No commenting, no shared links, no approval chains |
| Delivery management | Passive tracker with hardcoded milestones | No milestone updates, no blockers workflow, no status reports |
| Learning loop | Impact Ledger shows predicted vs actual | No feedback into future predictions |
| Document versioning | ConversationLayer modifies doc in-place | No version history, no diff view, no undo |
| Client-facing output | Print button exists | No branded PDF, no presentation mode, no board deck |
| Integration | None | No calendar, no Slack, no Jira, no email |
| Billing/pricing | None | No way to model commercial engagement |

---

### Priority implementation order

1. **Mobile nav** — product is broken on half of devices
2. **Supabase backend** — persistence makes everything else meaningful
3. **Executive Decision sticky bar** — the core action shouldn't require scrolling
4. **Cross-linking entities** — people, projects, briefs should all be interconnected
5. **Empty states and onboarding** — first-time experience is currently blank
6. **Notification system** — close the feedback loop
7. **Remove language switcher** — stop shipping broken features
8. **Accessibility audit** — contrast, focus management, screen reader support

