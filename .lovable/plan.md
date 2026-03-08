

# Implementation Plan

## Part 1: Language — English & Swedish only

**File: `src/components/BriefingNav.tsx`**
- Replace the `LANGUAGES` array with only `{ code: "en", label: "English" }` and `{ code: "sv", label: "Svenska" }`.

---

## Part 2: Person Profile Page (`/people/:id`)

Currently clicking a person card does nothing. We need a dedicated profile page showing everything a decision-maker needs to assess someone.

**New file: `src/pages/PersonProfile.tsx`**

A full-page profile with these sections:

1. **Header** — Avatar initials, name, role, department, location, availability badge, seniority level, years of experience
2. **Skills & Technologies** — All skills (not truncated), technologies, and domain expertise as tag groups
3. **Active Projects** (currently handling) — Each project card shows: name, role on it, priority badge, year. Multiple active projects displayed clearly.
4. **Completed Projects** (past work) — Same card format with "completed" status styling. Sorted by year descending.
5. **Collaborators** — List of people this person frequently works with (resolve IDs to names from EMPLOYEES). Each collaborator is a clickable link to their own profile.
6. **Hourly Rate** — Shown as a data point (useful for the executive reviewing team cost)

**Routing (`src/App.tsx`):**
- Add `<Route path="/people/:id" element={<AuthGuard><PersonProfile /></AuthGuard>} />`

**People list cards (`src/pages/People.tsx`):**
- Wrap each card in a clickable element that navigates to `/people/${emp.id}`
- Add a subtle hover cursor and visual affordance so users know cards are clickable

---

## Part 3: Systems Critique and Additional Fixes

### What's still broken or missing from a UX/systems perspective:

**A. The "People" nav link has no active state.** The `BriefingNav` only tracks `activeTab` as `"briefings" | "oqr" | "archive"`. When you're on `/people` or `/settings`, no nav item is highlighted. Fix: expand the `activeTab` type or add a separate prop.

**B. Conversation layer is nearly useless.** It only handles 2 hardcoded patterns. Add 3-4 more: budget adjustments ("reduce budget", "increase budget"), team size changes ("smaller team", "add someone"), scope changes ("remove phase", "simplify"), and risk queries ("what are the risks", "risk assessment").

**C. Brief lifecycle is cosmetic.** Approve/Defer buttons fire a toast but don't persist. The dashboard can't filter by approved vs deferred. Fix: store decision state in the briefing data and reflect it in the dashboard cards and filters.

**D. No way to get back from a profile.** Need a back button or breadcrumb on the profile page.

**E. The nav "People" link is duplicated** — it appears both as a top-level nav item AND inside the user dropdown. Remove it from the dropdown since it's already in the nav bar.

### Implementation in this plan:

- Fix A: Update `BriefingNav` to accept a broader `activeTab` that includes `"people"` and pass it from People/PersonProfile pages
- Fix B: Add 4 more conversation patterns to `ConversationLayer.tsx`
- Fix D: Add a back link on the profile page
- Fix E: Remove "People" from the user dropdown menu

---

## Files to modify:
- `src/components/BriefingNav.tsx` — languages, active state for People, remove People from dropdown
- `src/pages/People.tsx` — make cards clickable, pass `activeTab="people"`
- `src/App.tsx` — add `/people/:id` route
- `src/components/ConversationLayer.tsx` — add more response patterns
- `src/pages/Settings.tsx` — pass correct activeTab

## Files to create:
- `src/pages/PersonProfile.tsx` — full employee profile page

