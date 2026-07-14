# Elevation Protocol

A structured, repeatable process for taking a deliverable through multiple real refinement passes — most useful for larger or higher-stakes pieces (a full deck, a multi-tab dashboard, a long report) where a single design pass isn't enough. For small/simple pieces, the two-pass workflow in the main SKILL.md is usually sufficient; use this when the piece is complex enough to need systematic iteration.

Do all of this silently unless the user asks to see the process — the output the user sees should just be progressively better versions, or the final result.

## Pass 0 — Functional draft
Build the complete, correct version. All content, all data, all structure. No design polish yet beyond following basic tool conventions. This is the pass most AI output stops at — the point of this protocol is to not stop here.

## Pass 1 — System pass
Before touching individual elements, define the token system for the whole piece:
- **Type**: display face + body face (+ utility face if needed), a defined scale.
- **Color**: 4-6 hex values with named roles (background, surface, text-primary, text-secondary, accent, one or two semantic colors if needed).
- **Spacing**: a base unit and the multiples you'll actually use (e.g., 8/16/24/32/48).
- **Grid**: column count and margins for the medium (slide grid, page grid, dashboard card grid).

Apply this system uniformly across the whole piece — every slide, every sheet, every section pulls from the same tokens. Inconsistency between sections is one of the fastest ways a piece reads as unfinished.

## Pass 2 — Hierarchy pass
Go through every screen/slide/section and ask: what's the one thing that matters most here, and does the eye land on it first? Adjust size, weight, color, and position so the primary message is unambiguous before any secondary detail competes for attention. This is often where "functional but flat" pieces gain the most — the content doesn't change, but what's emphasized does.

## Pass 3 — Craft pass
Go element by element applying the specific techniques in `technique-catalog.md`: chart type matching, direct labeling, tabular numerals, tracking adjustments, consistent border/shadow treatment, number formatting. This is the detail pass — individually small changes that compound into a "handmade, not templated" feel.

## Pass 4 — Self-critique pass
Run `design-checklist.md` in full. For anything that fails, note *why* it fails (not just that it does) and fix it. Specifically hunt for:
- **Repetition without variation**: does every slide/card/section look identical in structure even where content differs?
- **Competing emphasis**: more than one thing fighting to be "the important one" in the same view.
- **Orphaned defaults**: any element that visibly still carries the tool's out-of-the-box styling while everything around it has been styled.
- **Overdecoration**: anything added in Pass 3 that doesn't serve legibility or hierarchy — cut it.

## Pass 5 — Distance pass
Step back and look at the whole piece as a set, not element by element. Specifically:
- Does it look like one person made consistent decisions throughout, or like it was assembled in pieces?
- Is the one "signature" moment (per `design-philosophy.md`) still identifiable, or did it get buried under Pass 3's detail work?
- If you removed the labels/logos, could someone tell this apart from a generic template? If not, go back to Pass 1 — the system itself is too generic, not just under-polished.

## When to stop

More passes aren't automatically better — a piece can be over-worked into fussiness, especially in Pass 3. Stop when:
- The checklist in Pass 4 comes back clean.
- The signature element from Pass 5 is still clearly visible and singular (not competing with other "bold" choices added along the way).
- Further changes would be polishing detail nobody will notice rather than fixing something a viewer would register, even subconsciously.

If the user asked for something quick/rough/"just get me a draft," respect that — this protocol is for when quality is the point, not a mandatory gate on every request.
