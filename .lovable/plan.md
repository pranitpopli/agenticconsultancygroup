

# ACG Application Audit and Improvement Plan

## Current State Summary

ACG is a briefing management tool for an "Agentic Consultancy Group" — it lets executives submit briefs, runs a simulated AI swarm analysis, assembles internal teams, and produces feasibility documents with cost/risk/timeline modelling. The app has three main views: Briefings (dashboard), OQR (org overview), and Archive.

---

## 1. Dark Mode Issues (Broken Right Now)

Several components use hardcoded colors that do not respond to the dark theme toggle:

**OQR page (`src/pages/OQR.tsx`)** — The radar charts use hardcoded HSL values:
- `PolarGrid stroke="hsl(35 15% 88%)"` — invisible on dark backgrounds
- `PolarAngleAxis fill="hsl(0 0% 45%)"` — poor contrast in dark mode
- `Radar stroke="hsl(0 0% 10%)"` — invisible on dark backgrounds (black on near-black)
- `Radar stroke="hsl(38 55% 50%)"` — barely visible

**Fix**: Read CSS variables at render time using `getComputedStyle` or pass theme-aware values via the `useTheme` hook.

**Hardcoded Tailwind colors that break in dark mode:**
- `SiloCheck.tsx`: `text-green-600`, `border-green-500/30` — static green that doesn't adapt
- `OverlapDrawer.tsx`: `text-green-600`, `text-warm-accent` — `text-warm-accent` is not a defined utility
- `ProposedSystem.tsx`: `fill-green-500 text-green-500` — static green

**Fix**: Replace all `text-green-*` with `text-[hsl(var(--status-positive))]` and `text-warm-accent` with `text-[hsl(var(--status-warning))]`.

---

## 2. Missing Flows and Information Architecture Gaps

### Authentication is superficial
- Login stores credentials in `localStorage` — no actual auth guard exists
- No protected routes; users can access everything without logging in
- No user profile, settings, or account page
- No "forgot password" flow
- **Recommendation**: Add a simple auth guard wrapper that checks `localStorage` and redirects to `/login`. Add a user menu in the nav with profile/settings/logout.

### No settings or preferences page
- No way to configure notification preferences, team defaults, or display preferences
- **Recommendation**: Add a `/settings` route with profile, preferences, and notification sections.

### No notifications or activity feed
- Users have no way to know when a brief has been updated, approved, or commented on by someone else
- **Recommendation**: Add a notification bell icon in the nav with a dropdown showing recent activity.

### Missing "My Team" or "People" view
- The system references employees and team assembly but there's no dedicated people directory
- Users can't browse available talent, see who's overcommitted, or view skill profiles
- **Recommendation**: Add a `/people` route showing the employee directory with availability, skills, and current assignments.

### No brief lifecycle management
- Briefs go from "submitted" to "analysis complete" but there's no way to move them through: Draft → Under Review → Approved → In Delivery → Complete
- The approve/defer buttons in `ExecutiveDecisionSummary` only show a toast — they don't persist state or change the brief's lifecycle
- **Recommendation**: Add a status workflow that persists (even in-memory) and filters the dashboard by status.

### No collaboration features
- No commenting or annotation on briefing sections
- No way to tag or assign reviewers
- No approval chain or multi-stakeholder sign-off
- **Recommendation**: Add inline comments per section and an approval chain UI.

### No search or filtering
- Dashboard has no way to search or filter briefs by department, status, date, or cost range
- Archive has no search either
- **Recommendation**: Add a search bar and filter chips to both Briefings and Archive views.

---

## 3. UI/UX Issues

### Navigation is too minimal
- Only 3 tabs (Overview, Briefings, Archive) with no indication of which page you're on beyond text weight
- No breadcrumbs on OQR or Archive pages
- On mobile, the nav items are cramped and the dark mode toggle has no label
- **Recommendation**: Add an active underline indicator to nav tabs. Add breadcrumbs consistently.

### The greeting is hardcoded
- "Good morning, James." — static text. Should use the logged-in user's name and time-appropriate greeting.
- **Recommendation**: Derive from auth state and `new Date().getHours()`.

### Export buttons are cosmetic
- PDF export calls `window.print()` which is fine, but PPT and DOCX just show the `ExportBanner` component — they don't actually export anything
- **Recommendation**: At minimum, show a clear "coming soon" message. Better: generate a real PDF using html2canvas + jsPDF.

### The `App.css` file is unused boilerplate
- Contains Vite default styles (`.logo`, `.card`, `.read-the-docs`) that are not referenced anywhere
- **Recommendation**: Delete `src/App.css`.

### Table of Contents overlaps content on medium screens
- The ToC is fixed at `left: 8` and the briefing content is centered with `max-w-[780px]`. On screens between 1024-1280px, the ToC can overlap the document.
- **Recommendation**: Hide the ToC below ~1280px and use the mobile floating button instead, or add left margin to the document when ToC is visible.

### Conversation layer is limited
- Only responds to two hardcoded patterns ("replace sarah" and "10 weeks")
- Everything else gets a generic "Noted" response
- **Recommendation**: Add 3-5 more response patterns covering common brief modification requests (budget changes, adding/removing phases, changing risk assessment).

---

## 4. Specific Improvements to Implement

### Priority 1 — Dark mode fixes (all the hardcoded colors above)
- OQR radar charts: use CSS variable-aware colors
- Replace all `text-green-*`, `text-warm-accent`, `fill-green-*` with design system tokens
- Delete unused `App.css`

### Priority 2 — Auth guard and user context
- Wrap routes in an auth check component
- Add user menu in nav (profile picture/initials, dropdown with Settings + Logout)
- Make greeting dynamic

### Priority 3 — Search and filtering on dashboard
- Add search input and status filter chips to `OverviewDashboard`
- Add search to `ArchiveView`

### Priority 4 — People directory
- New `/people` route showing employee cards with skills, department, availability
- Link from briefing team sections to individual profiles

### Priority 5 — Settings page
- `/settings` with profile editing, display preferences, notification toggles

---

## 5. Implementation Approach

All changes use the existing stack (React + Tailwind + Framer Motion). No new dependencies needed except potentially a PDF library if real export is desired.

The dark mode fixes are purely CSS/prop changes and can be done first as a quick win. The auth guard and user context require a new context provider and route wrapper. The people directory and settings are new pages following the same layout pattern as OQR and Archive.

### Files to modify:
- `src/pages/OQR.tsx` — theme-aware chart colors
- `src/components/SiloCheck.tsx` — replace hardcoded greens
- `src/components/OverlapDrawer.tsx` — replace hardcoded greens and warm-accent
- `src/components/ProposedSystem.tsx` — replace hardcoded greens
- `src/components/BriefingNav.tsx` — add active indicator, user menu
- `src/components/OverviewDashboard.tsx` — dynamic greeting, search/filter
- `src/App.css` — delete

### Files to create:
- `src/components/AuthGuard.tsx` — route protection
- `src/pages/Settings.tsx` — user preferences
- `src/pages/People.tsx` — employee directory
- `src/contexts/AuthContext.tsx` — user state management

