

## Time-Wasters & Friction Points — User-Centred Analysis

### Who is the user?
A senior leader (James) who needs to assemble internal teams quickly, understand organisational capability, and present recommendations to the board. Their goals are speed, confidence, and action. Every second of unnecessary ceremony erodes trust in the tool.

---

### What wastes their time right now

**1. Swarm Thinking animation is a forced wait (1.2+ seconds)**
10 lines at 120ms each = ~1.2s minimum, plus 500ms delay before transition. The user gets zero actionable information from watching "parsing brief..." appear line by line. The "Skip" button exists but is small and easy to miss. This should auto-complete much faster or show a compact progress indicator inline — not take over the entire screen.

**Change:** Reduce interval from 120ms to 60ms, reduce post-complete delay from 500ms to 200ms. Make the entire animation area clickable to skip (not just the tiny "Skip →" text).

**2. Silo Check is a dead-end screen when there are no overlaps**
When there are 0 overlapping projects, the user sees "No prior projects found" for 1.5 seconds, then auto-advances. That's 1.5 seconds of staring at nothing useful. When there ARE overlaps, the user must choose between two buttons — but the "Review overlaps" button opens a drawer while "Skip to team" advances. Neither label clearly communicates the consequence.

**Change:** When no overlaps, skip instantly (no 1.5s pause). When overlaps exist, show the overlap summary inline on the same screen instead of requiring a drawer open.

**3. The "Submit a new brief" section is below the fold, below the Quarter Pulse**
The primary action — submitting a brief — is buried beneath org metrics that don't help the user complete their task. The quarter pulse is informational context, not actionable. It should be secondary to the main workflow.

**Change:** Move the brief submission area above the quarter pulse section. The user's first action is submitting work, not reading KPIs.

**4. Integration pills (Jira, Trello, Slack, Confluence, GitHub) are fake**
They simulate a 1.2s connection animation that does nothing. They clutter the submit form with 5 buttons that serve no purpose. This is noise that makes the user question whether the tool is real.

**Change:** Remove the integration pills entirely. They add visual complexity without value. If integrations are a future feature, they belong in settings, not inline on every brief submission.

**5. The Quarter Pulse section on the Briefings tab duplicates the Overview tab**
The OQR/Overview page already shows all org metrics in detail. Repeating a summary on the Briefings page splits the user's attention and makes the Briefings tab longer than necessary.

**Change:** Remove the Quarter Pulse from the Briefings dashboard. Users who want org metrics click the Overview tab.

**6. The footer text is filler**
"Swarm last scanned 847 nodes across Meridian Group — 4 minutes ago" adds no value. It's a static string pretending to be live data.

**Change:** Remove it entirely.

**7. The BriefingIndex sidebar is only visible on xl screens and hardcoded**
The section index on the left side of the briefing doc is hidden on anything below 1280px, which is most laptops. When it IS visible, it takes up space for 6 items that are already in scroll order. Its value is marginal.

**Change:** Remove the fixed sidebar index. The document is already well-structured with clear section headers. Users scroll naturally. If navigation is needed, a sticky compact breadcrumb showing current section is less intrusive.

**8. The FixedInputBar suggestions are static and always visible**
The suggestion chips ("Replace Sarah Chen", "Compress to 10 weeks", "Add a QA phase") are always shown at the bottom. After the user has acted on one, they persist. They should disappear after first use or after the conversation begins.

**Change:** Hide suggestion chips once the user sends their first message (conversation is active).

---

### Summary of changes

| Change | Type | Lines of code |
|--------|------|---------------|
| Speed up swarm animation (60ms, click-to-skip) | Speed | ~5 lines |
| Instant skip when 0 overlaps in silo check | Speed | ~2 lines |
| Move brief submission above quarter pulse | Layout | Reorder JSX |
| Remove integration pills | Removal | ~40 lines |
| Remove quarter pulse from Briefings tab | Removal | ~40 lines |
| Remove footer text | Removal | ~5 lines |
| Remove BriefingIndex sidebar | Removal | Delete component + import |
| Hide suggestion chips after first message | Logic | ~3 lines |

