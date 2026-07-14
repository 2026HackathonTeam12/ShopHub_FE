# Design Validation Checklist

Run through this before calling any visual deliverable finished. It's organized as questions, not rules, because the right answer depends on the brief — the point is that you've actually considered each axis, not that you've applied a fixed formula.

If you catch yourself answering "I didn't think about that" to any question below, that's the signal to go back and do another pass, not to rationalize the default you already have.

## Typography

- Did I choose the type pairing deliberately for this piece, or did I leave whatever the tool defaulted to (Calibri, Arial, system-ui, PowerPoint's "Office Theme" fonts)?
- Is there a clear type scale (distinct sizes for title / section head / body / caption), or does everything sit at 2-3 similar sizes?
- Are weights doing real work (a genuine bold for emphasis, a light or regular for body) rather than everything at the same weight?
- Is line length reasonable (roughly 45-75 characters for body text) and is line-height set intentionally, not left at 1.0/single-spaced default?
- Would someone who works in design recognize this typography as a choice, or as "whatever came up first"?

## Color

- Does the palette have a named source — 4-6 specific hex values I chose — rather than being improvised element by element?
- Is there exactly one accent color doing the emphasis work, not three or four competing "important" colors?
- Have I avoided default categorical palettes (Excel/PowerPoint auto-color, rainbow qualitative schemes) for anything with more than 2-3 categories?
- Does color carry meaning (status, category, hierarchy) rather than being decorative?
- Have I checked contrast — is body text actually easy to read against its background, not just technically legible?

## Layout & grid

- Is there a real underlying grid (consistent margins, consistent column/gutter widths, aligned baselines) or are elements placed ad hoc?
- Is whitespace intentional — generous where it should breathe, tight where content is dense — rather than uniformly cramped or uniformly padded?
- Does every element align to something (another element's edge, a grid line, a baseline)? Stray 2-3px misalignments read as sloppy even when the content is right.
- If this is a multi-slide/multi-page piece: is there layout variety appropriate to content (not the same template repeated for everything), while staying visually consistent as a system?
- Is the visual hierarchy obvious at a glance — can someone tell what matters most within 2 seconds, before reading any text?

## Data & information design

- Is data shown as a visualization where a visualization would actually communicate faster than a table or bullet list, and vice versa?
- Does every chart use the chart type suited to the comparison being made (trend → line, part-to-whole → stacked/pie only if few categories, ranking → bar, distribution → histogram), rather than whatever the tool inserts by default?
- Have I removed chartjunk — unnecessary gridlines, 3D effects, redundant legends, decorative icons that don't encode information?
- Are labels, units, and sources present and legible, not an afterthought in 8pt gray text?

## Consistency & system

- Do repeated elements (headers, cards, buttons, slide numbers, chart styles) look like they came from the same system, or does each one look independently designed?
- Is spacing based on a consistent unit (e.g., multiples of 4px/8px, or a fixed set of slide margins) rather than arbitrary per-element values?
- If I changed one instance of a repeated element, would I need to remember to change all the others by hand? (If yes, the system isn't tight enough yet.)

## Restraint & risk

- Where is the one deliberate, bold move in this piece — the thing someone would remember? If I can't name it, the piece is probably too safe *and* too generic at once.
- Is that boldness contained to one or two places, with everything else disciplined around it? Or is there bold competing with bold (multiple fonts, multiple accent colors, multiple "hero" moments)?
- Is there anything I added that isn't earning its place — a decorative icon, a gradient, a border, an animation — that I could cut without losing information or impact? Cut it.

## The outside-eye test

- If I saw this cold, with no knowledge of how it was made, would I guess it was a first draft, a template fill-in, or a piece that went through actual design revisions?
- Does this look like something a specific person made a set of specific choices about, or could it be regenerated identically from a generic prompt?
- Have I referenced at least one concrete design world (see `reference-library.md`) I can point to as the source of this piece's visual logic, rather than "professional-looking" as a vague target?
