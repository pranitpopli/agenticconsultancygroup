

## Comprehensive Gap Analysis — What's Still Missing

After reviewing every component, here is everything that's missing from the product — from navigation polish to functional gaps to UX details.

---

### 1. Breadcrumbs in the Briefing Document View
When a user navigates from Dashboard → Swarm → Silo → Briefing Doc, there's no breadcrumb trail showing where they are. The only way back is the "Back to briefings" button. A breadcrumb like `Briefings / Platform Consolidation` would give spatial context and allow jumping back to any point in the flow.

**Implementation:** Add a breadcrumb row above the title in `BriefingDocument.tsx` using the existing `breadcrumb.tsx` UI component. Pass the brief title from the parent via the `doc` prop.

---

### 2. Loading/Empty States
- **No briefs state:** If `allBriefs` is empty, the dashboard shows nothing — no empty state illustration or prompt.
- **Archive empty state:** If `ARCHIVED_BRIEFS` were empty, the archive page would show only the summary strip with zeros and no cards.
- **Swarm thinking has no error state:** If the animation fails or lines array is empty, there's no fallback.

**Implementation:** Add simple empty state messages in `OverviewDashboard.tsx` and `ArchiveView.tsx` when lists are empty.

---

### 3. Page Titles (document.title)
The browser tab always shows the same title regardless of which view or brief the user is on. Should update to show "ACG — Platform Consolidation" or "ACG — Archive" depending on context.

**Implementation:** Add `useEffect` calls in `Index.tsx` to set `document.title` based on the current view and active brief title.

---

### 4. Unsaved Conversation Warning
When a user is mid-conversation on a briefing doc and clicks "Back to briefings", all conversation state is lost silently. There should be a confirmation dialog.

**Implementation:** Track conversation dirty state in `BriefingDocumentView`. Intercept the `onBack` call and show an `AlertDialog` if `messages.length > 0`.

---

### 5. Keyboard Accessibility Gaps
- The swarm thinking "Skip" button has no keyboard shortcut (e.g., Escape or Enter to skip).
- The OQR side panel toggle button uses `writingMode: vertical-rl` which may confuse screen readers.
- The overlap drawer backdrop doesn't trap focus.

**Implementation:** Add `onKeyDown` handlers for Escape in swarm/silo views. Add `aria-label` to the OQR toggle. Add focus trap to `OverlapDrawer`.

---

### 6. Brief Status Progression is Visual-Only
`BriefingSummary` has `status` (`swarm-ready`, `analysis-complete`, `swarm-searching`) but clicking "Read briefing" behaves identically regardless. A `swarm-searching` brief should either be disabled or show a different interaction (e.g., "Still analysing...").

**Implementation:** In `InboxCard.tsx`, disable the "Read briefing" button when `status === "swarm-searching"` and show a different label like "Analysing...".

---

### 7. No Scroll-to-Top on View Transitions
When navigating between views (e.g., archive → briefings → doc), the scroll position isn't reset. Users may land mid-page.

**Implementation:** Add `window.scrollTo(0, 0)` in a `useEffect` in `Index.tsx` that triggers on `view` changes.

---

### 8. OQR Page Has No Back Navigation
The `/oqr` page has the nav bar but no breadcrumb or contextual back button. Since it's a separate route, the browser back button works, but there's no in-page affordance.

**Implementation:** The nav tabs already handle this (clicking "Briefings" goes back). Low priority — no change needed.

---

### 9. Conversation Suggestion Chips Are Duplicated
`ConversationLayer` has hardcoded `SUGGESTIONS` that duplicate the ones passed via `FixedInputBar`'s `suggestions` prop. The suggestions in `ConversationLayer` are never rendered (they're unused). Dead code.

**Implementation:** Remove the unused `SUGGESTIONS` constant from `ConversationLayer.tsx`.

---

### 10. Print/Export Styles
The document view has no print stylesheet. If a user tries to print via browser, the fixed nav, input bar, and OQR panel would all appear.

**Implementation:** Add `@media print` rules in `index.css` to hide fixed elements and adjust layout for printing.

---

### Recommended Priority

| # | Gap | Effort | Impact |
|---|-----|--------|--------|
| 1 | Breadcrumbs in briefing doc view | Small | High — spatial orientation |
| 2 | Scroll-to-top on view transitions | Tiny | High — broken feel without it |
| 3 | Page titles (document.title) | Tiny | Medium — browser tab clarity |
| 4 | Empty states for dashboard + archive | Small | Medium — edge case polish |
| 5 | Disable "Read briefing" for searching briefs | Small | Medium — status coherence |
| 6 | Unsaved conversation warning | Medium | Medium — data loss prevention |
| 7 | Remove dead SUGGESTIONS constant | Tiny | Low — code hygiene |
| 8 | Print stylesheet | Small | Low — nice to have |
| 9 | Keyboard accessibility | Medium | Medium — a11y |

### Implementation Plan

**Batch 1 — Quick wins (items 1, 2, 3, 5, 7):**
- Add breadcrumb to `BriefingDocumentView` using the existing `breadcrumb.tsx` component, showing `Briefings / {doc.title}`
- Add `useEffect` in `Index.tsx` to scroll to top on `view` change
- Add `useEffect` in `Index.tsx` to set `document.title` based on view + brief title
- Disable "Read briefing" button in `InboxCard` when brief status is `swarm-searching`
- Remove unused `SUGGESTIONS` from `ConversationLayer.tsx`

**Batch 2 — Polish (items 4, 6):**
- Add empty state messages in `OverviewDashboard` and `ArchiveView`
- Add unsaved conversation warning dialog in `BriefingDocumentView`

**Batch 3 — Accessibility & print (items 8, 9):**
- Add print media query to `index.css`
- Keyboard shortcuts and focus management

