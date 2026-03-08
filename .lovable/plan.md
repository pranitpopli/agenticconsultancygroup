

## Remaining Frontend Polish — No Backend Required

I've identified 8 more improvements I can implement right now:

---

### 1. **Persist Settings in localStorage**
The Settings page has notification toggles (brief updates, team changes, weekly digest) that reset on page reload. Store preferences in localStorage and read them on mount.

**Impact:** User preferences survive across sessions
**Files:** `src/pages/Settings.tsx`

---

### 2. **Persist People Page Filter Presets**
Saved filter presets (e.g., "Available engineers", "London team") are stored in component state and reset on navigation. Move to localStorage.

**Impact:** Custom views survive page reload
**Files:** `src/pages/People.tsx`

---

### 3. **Active Briefs Section on PersonProfile**
PersonProfile shows active projects but doesn't connect people to briefing documents. Add an "Active Briefs" section that cross-references the brief data from `briefingData.ts` to show which briefs this person is mentioned in (e.g., Sarah Chen appears in the "API Gateway" brief).

**Impact:** Closes the loop between People → Briefings
**Files:** `src/pages/PersonProfile.tsx`, `src/lib/briefingData.ts` (read-only lookup)

---

### 4. **Table of Contents Scroll Offset**
`BriefingTableOfContents.tsx` uses `scrollIntoView({ behavior: "smooth", block: "start" })` which places the section header directly under the fixed nav (obscured). Add a `scroll-margin-top` CSS utility or manual offset calculation.

**Impact:** Sections scroll to correct visible position
**Files:** `src/components/BriefingTableOfContents.tsx`, `src/components/BriefingDocument.tsx`

---

### 5. **Scenario Selection Persistence**
When a user selects a scenario in `ScenarioModelling.tsx`, the choice doesn't persist anywhere. Store the selected scenario ID in the briefing store alongside the approval decision.

**Impact:** Scenario choices survive page navigation
**Files:** `src/lib/briefingStore.ts`, `src/components/ScenarioModelling.tsx`

---

### 6. **Dashboard Empty State Promotion**
When `briefs.length === 0`, the "Submit a new brief" form is buried at the bottom. Promote it to the top of the page when the brief list is empty, with a visual prompt.

**Impact:** First-time users see the submission form immediately
**Files:** `src/components/OverviewDashboard.tsx`

---

### 7. **Print Stylesheet for Briefing Documents**
The `ExportBanner` currently just triggers `window.print()`. Add a `@media print` stylesheet to hide nav, ToC, sticky bars, and optimize document layout for PDF output.

**Impact:** Cleaner PDF exports from browser print
**Files:** `src/index.css` or new `src/print.css`

---

### 8. **Cross-Link Project Names in PersonProfile**
In PersonProfile's "Active Projects" and "Past Projects" sections, the project names (e.g., "API Gateway") are plain text. Make them clickable — either link to the /briefings page with a filter, or to /organisation?tab=portfolio with a project highlight.

**Impact:** Navigation continuity across entities
**Files:** `src/pages/PersonProfile.tsx`

---

### Summary

| # | Change | Files |
|---|--------|-------|
| 1 | Persist notification settings | Settings.tsx |
| 2 | Persist filter presets | People.tsx |
| 3 | Add Active Briefs to PersonProfile | PersonProfile.tsx |
| 4 | Fix ToC scroll offset | BriefingTableOfContents.tsx, BriefingDocument.tsx |
| 5 | Persist scenario selection | briefingStore.ts, ScenarioModelling.tsx |
| 6 | Promote empty state form | OverviewDashboard.tsx |
| 7 | Print stylesheet | index.css |
| 8 | Link project names | PersonProfile.tsx |

All localStorage-based, no backend dependency. Should I proceed with all 8?

