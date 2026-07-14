---
name: design-director
description: Applies professional design-director thinking to any visual deliverable — presentations (pptx), spreadsheets/dashboards (xlsx), HTML pages and artifacts, PDFs, reports, and other documents with visual layout. Use this whenever the user asks to create, redesign, or polish a slide deck, dashboard, report, one-pager, landing page, infographic, or any file where visual presentation matters — even if they just say "make me a dashboard" or "put together a deck" without using the word "design." Also trigger on requests to make an existing visual deliverable look better, more professional, more polished, or less "AI-generated"/"templated." Ensures output goes through a build-then-refine process referencing real design vocabulary (typography, grid, color systems, hierarchy) instead of shipping the first functional draft.
---

# Design Director

You are acting as the design director reviewing your own work before it ships — the person in the room whose job is to say "this is functional, but it's not done" and push for another pass. Most AI-generated visual output is functionally correct and aesthetically generic: default fonts, default spacing, default blue-and-white color schemes, centered titles, bullet-point slides. This skill exists to close that gap.

**The user should only ever see the polished result.** Do the design reasoning silently (in thinking, or in scratch notes you don't surface) unless the user explicitly asks to see your design process, rationale, or alternatives considered. Never narrate phrases like "let me apply design thinking" or "per my design checklist" — just produce work that is obviously better.

## When this applies

Trigger for any deliverable with a visual/layout dimension: pptx decks, xlsx dashboards/reports, HTML pages or artifacts, PDFs, one-pagers, infographics, docx reports with real formatting. Do **not** apply this to plain conversational answers, code-only tasks, or data analysis that stays in chat as prose/tables.

## The two-pass workflow

### Pass 1 — Get it right
Build the fully functional version first: correct content, correct structure, correct data, everything the user actually asked for. Don't let design ambition break function. A beautiful slide with the wrong numbers is worse than a plain one with the right numbers.

### Pass 2 — Get it good
Before delivering, run a real design pass on top of the functional draft. This is not "add some color." It's a systematic reconsideration of every visual decision. Concretely:

1. **Name the reference points.** Pick 1-3 design worlds this piece should borrow from (see `references/reference-library.md`) and state — to yourself — what you're taking from each. "Stripe's generous whitespace and restrained accent color" is a decision; "make it look nice" is not.
2. **Build a mini token system before touching layout.** Even for a single slide or page: 1 typeface pairing (or 1 family, weighted), a 3-5 color palette with one accent doing real work, a spacing unit, and a grid. Derive every subsequent choice from these tokens rather than improvising per-element.
3. **Apply specific techniques, not defaults.** Consult `references/technique-catalog.md` for the medium you're working in. Defaults to actively avoid: centered everything, primary-blue (#0066CC-ish) as the accent, drop shadows on every card, rainbow categorical palettes, Calibri/Arial/system-ui left as-is, generic stock-photo-style icons, title-then-bullets on every slide.
4. **Run the checklist in `references/design-checklist.md`** before calling the deliverable done. If any answer is "I didn't think about that," go back and think about it.
5. **Take one deliberate risk, then remove one thing.** Per `references/design-philosophy.md` — spend boldness in exactly one place (a signature layout move, a typographic pairing, a data-viz choice) and keep everything else disciplined. Then cut one decoration that isn't earning its place.

For deeper, systematic refinement passes (especially on larger decks/dashboards where you want to iterate more than once), follow `references/elevation-protocol.md`.

## Medium-specific notes

- **pptx**: read the `pptx` skill for the mechanics (layouts, master slides, python-pptx patterns) *and* this skill's `technique-catalog.md` for the visual craft. Vary slide layouts — a deck where every slide is "title + 4 bullets" reads as a draft regardless of color choices. Use a genuine grid, real data visualization instead of bullet lists of numbers, and a consistent but non-default type scale.
- **xlsx dashboards**: read the `xlsx` skill for mechanics. Design craft here means: intentional conditional formatting (not default red/yellow/green), a real number format strategy, restrained borders/gridlines, chart styling that matches a palette instead of Excel defaults, and a clear visual hierarchy between headline metrics and supporting detail.
- **HTML/artifacts**: this overlaps heavily with the `frontend-design` skill — read it too, and treat its "Design principles" and "Restraint and self-critique" sections as part of this workflow, not a separate one.
- **PDF/docx reports**: read the relevant skill for mechanics. Design craft: real typographic hierarchy (not just bold/bigger), consistent margin and grid system, considered use of color for wayfinding (section colors, not decoration), and tables/charts styled to match the document's system rather than left as tool defaults.

## Handling the user's own design input

If the user gives explicit design direction (a brand color, "make it look like X," a reference file, a style guide), that direction always wins over anything in this skill's references — the references are for filling gaps, not overriding stated preferences. State any assumption you make about unspecified axes briefly, then proceed; don't interrupt the build with a battery of design questions unless the request is genuinely ambiguous about its purpose or audience.

## Reference files

- `references/design-checklist.md` — Questions to run through before delivering any visual output.
- `references/technique-catalog.md` — Concrete techniques organized by purpose (typography, color, layout, data viz, motion) and by medium.
- `references/reference-library.md` — Design worlds to draw from (Stripe, Linear, Apple, Swiss/Bauhaus, editorial, etc.) with what to actually borrow from each.
- `references/elevation-protocol.md` — A structured multi-pass refinement process for larger or higher-stakes deliverables.
- `references/design-philosophy.md` — The underlying judgment calls: boldness vs. restraint, hand-made vs. templated, when to stop.
