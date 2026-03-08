

## What's Still Missing — Current State Analysis

After reviewing every component in the current codebase, here's what remains incomplete, inconsistent, or could be better.

---

### Issues Found

**1. The OQR page (`/oqr`) still has the fake footer text**
Line 382 of `OQR.tsx`: `"Swarm last scanned 847 nodes across Meridian Group — 4 minutes ago."` — this was removed from the dashboard but still exists on the Overview page.

**2. The "Push to Jira" button in ExportBanner is fake**
`ExportBanner.tsx` line 59 has a "Push to Jira" button that shows a toast saying "This feature will be available in the next release." Same logic as the integration pills we already removed — fake functionality that erodes trust. Should be removed.

**3. The OQR side panel tab still says "OQR" not "Overview"**
`BriefingOQRPanel.tsx` line 34: the collapsed vertical tab reads "OQR". Line 49: the panel header says "Org Quarterly Review". These should align with the renamed "Overview" tab.

**4. The briefing document "View original" button is fake**
`BriefingDocument.tsx` line 137: shows a toast saying "The source document will open in a new tab when connected to your document store." Another fake action. Should be removed or replaced with something real.

**5. The breadcrumb and "Back to briefings" button are redundant**
The briefing doc view now has both a breadcrumb (`Briefings / {title}`) AND a separate "Back to briefings" button with arrow below it. These do the same thing. The breadcrumb is sufficient — the back button row is noise.

**6. The `847 projects scanned` text is hardcoded filler**
`BriefingDocument.tsx` line 150: `"✓ 847 projects scanned — no similar or discarded initiatives found"` — this is a static string. It appears regardless of whether the silo check found overlaps or not, and the number never changes. Should be removed or made dynamic based on actual silo check results.

**7. No active tab highlight when viewing a briefing document**
When viewing a briefing doc (navigated from the Briefings tab), the nav still highlights "Briefings" which is correct. But when viewing an archived brief (readonly), it should highlight "Archive" — currently it doesn't because `activeTab` is always "briefings" when viewing a doc.

**8. The Overview page footer is the only remaining "scanned nodes" text**
Already covered in point 1.

---

### Implementation Plan

| # | Change | File | Effort |
|---|--------|------|--------|
| 1 | Remove fake footer from OQR page | `OQR.tsx` | Delete ~5 lines |
| 2 | Remove "Push to Jira" from ExportBanner | `ExportBanner.tsx` | Delete ~3 lines |
| 3 | Rename "OQR" to "Overview" in side panel | `BriefingOQRPanel.tsx` | 2 string changes |
| 4 | Remove "View original" fake button | `BriefingDocument.tsx` | Delete ~6 lines |
| 5 | Remove redundant "Back to briefings" button row, keep breadcrumb | `BriefingDocument.tsx` | Delete ~15 lines |
| 6 | Remove hardcoded "847 projects scanned" text | `BriefingDocument.tsx` | Delete ~1 line |
| 7 | Fix archive tab highlight when viewing archived brief | `Index.tsx` | Update `activeTab` derivation in `deriveState` |

All changes are removals or tiny edits — no new components needed.

