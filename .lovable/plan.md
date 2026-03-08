

## What I Can Implement (No Supabase Required)

Here's everything remaining from the critique that's purely frontend work I can do right now:

---

### 1. Sticky Executive Decision Bar
The approve/defer action is buried at the bottom of long briefing documents. I'll add a floating action bar that stays visible as you scroll, showing the brief title and approve/defer buttons. It collapses when the full ExecutiveDecisionSummary section is in view.

**Files:** `src/components/BriefingDocument.tsx`, new `src/components/StickyDecisionBar.tsx`

---

### 2. Cross-Linking Entities
Make people names, project names, and brief references clickable throughout the app:
- Portfolio alerts mentioning people (e.g. "Sarah Chen") link to `/people/:id`
- Dashboard at-risk projects link to `/organisation` portfolio tab
- PersonProfile gets an "Active Briefs" section showing related briefs
- OrgHealth KPI cards (e.g. "Active Projects: 2") click through to the Portfolio tab

**Files:** `src/components/org/OrgPortfolio.tsx`, `src/components/org/OrgHealth.tsx`, `src/pages/Dashboard.tsx`, `src/pages/PersonProfile.tsx`

---

### 3. Notification Centre
Add a bell icon in the nav with a dropdown showing recent activity from the briefing store (approvals, deferrals, brief submissions). Badge count shows unread items. Persists "last seen" timestamp in localStorage to track what's new.

**Files:** new `src/components/NotificationCentre.tsx`, `src/components/BriefingNav.tsx`, `src/components/MobileNav.tsx`

---

### 4. Remove Language Switcher
Already identified as a non-functional feature. Strip it from the nav dropdown entirely.

**Files:** `src/components/BriefingNav.tsx`

---

### 5. Briefing Document UX Improvements
- **Table of Contents anchor links** — already partially working via `scrollIntoView`, but sections need consistent `id` attributes and smooth scroll offset for the fixed nav
- **ConversationLayer fuzzy matching** — replace exact key lookup with fuzzy substring/keyword matching so "can we swap Sarah" triggers the "replace sarah" response

**Files:** `src/components/ConversationLayer.tsx`, `src/components/BriefingTableOfContents.tsx`

---

### 6. Performance & Accessibility Polish
- Add `React.memo` to `InboxCard` and people list items
- Add `aria-label` to the swarm canvas (already done), verify focus management after login
- SwarmBackground: pause animation when tab is hidden (`visibilitychange` listener)
- Code-split heavy pages with `React.lazy` + `Suspense` (Organisation, People, PersonProfile)

**Files:** `src/components/InboxCard.tsx`, `src/components/SwarmBackground.tsx`, `src/App.tsx`, `src/pages/People.tsx`

---

### 7. Design System Consistency Pass
- Standardise card padding to `p-4` / `p-6` scale
- Replace inline status spans with the new `StatusBadge` component across OrgPortfolio, Dashboard, and OverviewDashboard
- Ensure all borders use `rounded-none` (editorial aesthetic) consistently

**Files:** `src/components/org/OrgPortfolio.tsx`, `src/pages/Dashboard.tsx`, `src/components/OverviewDashboard.tsx`, `src/components/InboxCard.tsx`

---

### Summary — 7 workstreams, all frontend, no Supabase dependency

| # | Change | Impact |
|---|--------|--------|
| 1 | Sticky Decision Bar | Core UX — action always visible |
| 2 | Cross-linking entities | Navigation coherence |
| 3 | Notification centre | Feedback loop |
| 4 | Remove language switcher | Cleanup |
| 5 | Briefing doc UX (ToC + fuzzy matching) | Usability |
| 6 | Performance + a11y | Polish |
| 7 | Design system consistency | Visual cohesion |

