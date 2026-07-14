# Technique Catalog

Concrete, nameable techniques organized by purpose. Use this to replace vague intentions ("make it look better") with specific moves. Not a checklist to apply all of — pick what fits the brief.

## Table of contents
1. Typography techniques
2. Color techniques
3. Layout & grid techniques
4. Data visualization techniques
5. Motion & interaction techniques (HTML only)
6. Medium-specific playbooks (pptx, xlsx, PDF/docx, HTML)

---

## 1. Typography techniques

- **Contrast pairing**: pair a characterful display face (for titles/headers) with a quiet, highly legible body face from a different family — not two weights of the same font. E.g., a geometric sans display with a humanist sans body, or a serif display with a sans body.
- **Optical sizing / tracking**: tighten letter-spacing slightly on large display type (-1 to -3%), open it slightly on small caps or uppercase labels (+5 to +10%). Default tracking at large sizes looks loose and untended.
- **Type scale via ratio**: derive sizes from a ratio (1.25, 1.333, 1.5) off a base size rather than picking sizes by eye. E.g., base 16 → 20 → 25 → 31 → 39.
- **Weight as hierarchy, not just size**: use a genuine bold (600-700) for the one or two things that need emphasis; keep everything else at regular/400 or medium/500. Avoid bolding entire paragraphs or every header.
- **Numerals**: use tabular figures for anything in a table or aligned column (most fonts have a `tnum` OpenType feature); use oldstyle/lining figures deliberately depending on whether numbers sit inline with text or stand alone as data.
- **Eyebrow/label text**: small, uppercase or small-caps, wide tracking, often the accent color — used to label a section without competing with the headline for size.
- **Widows and orphans**: never leave a single word alone on the last line of a paragraph or a lone line at the top/bottom of a column — reflow or rephrase.

## 2. Color techniques

- **60-30-10 rule**: roughly 60% dominant/background color, 30% secondary, 10% accent. Prevents "everything is equally loud."
- **One accent, used sparingly**: reserve the accent color for the 1-3 things that most need attention (a CTA, the key metric, the current step). If more than ~15% of the surface is accent-colored, it's stopped being an accent.
- **Tonal ramps over rainbow**: for sequential or ordered data (low→high, time), use a single-hue ramp (light to dark or light to saturated) rather than distinct hues per step. Reserve multi-hue palettes for true categorical (unordered) data, and cap at 5-6 hues before falling back to "highlight one, gray out the rest."
- **Near-black instead of pure black**: use a dark neutral (e.g., #14151A rather than #000000) for text and dark backgrounds — pure black against pure white is harsher than most professional palettes use.
- **Off-white backgrounds**: a slightly warm or cool off-white (not #FFFFFF) reads more considered for editorial/print-style pieces; pure white suits high-contrast product-style pieces (Stripe/Linear direction).
- **Semantic color restraint**: red/amber/green for status should be desaturated enough to sit next to brand colors without clashing, and should never be the *only* signal (pair with an icon or label for accessibility).
- **Gradient discipline**: if using a gradient, keep it subtle (small hue/lightness shift) and purposeful (backgrounds, one hero element) — avoid multi-stop rainbow gradients on cards/buttons, a strong "generic AI output" tell.

## 3. Layout & grid techniques

- **Explicit column grid**: define a grid (e.g., 12-column for wide layouts, 4-6 for slides) and snap major elements to it, even if the grid itself is invisible.
- **Consistent spacing unit**: pick a base unit (4px or 8px for screen; a fixed set like 0.25"/0.5"/1" for print/slides) and derive all margins/padding from multiples of it.
- **Asymmetry with purpose**: an off-center hero element, an intentionally unbalanced two-column split (e.g., 40/60 instead of 50/50), or a full-bleed image against a text column — used to create visual interest without breaking alignment.
- **Z-pattern / F-pattern awareness**: place the most important element where the eye naturally lands first (top-left to top-right, then down) for reading-heavy layouts; for visual-heavy layouts, use a clear focal point instead.
- **Framing devices**: hairline rules, thin borders, or generous negative space to separate sections instead of heavy boxes/shadows on every card.
- **Bleed and containment**: let hero imagery or color blocks run to the edge (bleed) while keeping text within a comfortable margin — mixing full-bleed and contained elements creates rhythm.

## 4. Data visualization techniques

- **Match chart to comparison type**: trend over time → line; ranking → horizontal bar (easier to label than vertical for long category names); part-to-whole with ≤5 categories → stacked bar or simple pie, otherwise avoid pie entirely; distribution → histogram/box plot; correlation → scatter.
- **Direct labeling over legends**: label lines/segments directly at their endpoint instead of a separate legend the eye has to jump to, when there are ≤6 series.
- **Highlight-and-gray**: color the one series/category that matters, gray out the rest — far more effective than distinct colors for every series when there's a specific point to make.
- **Sort with intent**: bar charts sorted by value (not alphabetically or by default order) unless the category order itself is meaningful (e.g., months, ranked stages).
- **Annotate the takeaway**: add a short text callout on the chart itself pointing at the specific data point that matters, rather than leaving the reader to find it.
- **Reduce, then reduce again**: remove gridlines that don't aid reading, redundant axis labels, unnecessary decimal precision, and any 3D/shadow effects on bars or pies.
- **Small multiples**: for comparing the same metric across many categories, use a grid of small identical charts rather than one overcrowded chart with many series.

## 5. Motion & interaction techniques (HTML/artifacts only)

- **One orchestrated entrance, not scattered effects**: a single coordinated load-in sequence (staggered fade/rise of key elements) reads as intentional; many independent hover-wiggle-bounce effects read as noise.
- **Purposeful hover states**: hover/focus changes should confirm interactivity or reveal detail, not just "do something" — subtle elevation, a color shift on the accent, or a reveal of secondary info.
- **Scroll-triggered reveals used sparingly**: fine for a hero section or one key transition; overusing them on every section feels gimmicky and slows the page down.
- **Respect reduced motion**: honor `prefers-reduced-motion` and keep essential content usable with motion off.
- **Micro-interactions over macro-animation**: a well-timed 150-250ms transition on state change (button press, tab switch) usually reads more polished than a long decorative animation.

## 6. Medium-specific playbooks

### pptx
- Vary slide layouts across the deck: full-bleed image + headline, two-column comparison, big-number stat slide, quote/pull-out slide, data-viz slide — not "title + bullets" repeated 20 times.
- Build a slide master with the chosen type scale and color tokens rather than styling each slide independently.
- Replace bullet lists of numbers with an actual chart; replace bullet lists of steps with a simple numbered/visual process layout.
- Use consistent footer/pagination treatment, not left as PowerPoint's default gray placeholder text.

### xlsx
- Style headers with the palette's dominant/accent colors instead of default Excel blue-white banding.
- Use custom number formats (thousands separators, currency, %, unit suffixes) instead of raw numbers.
- Conditional formatting: use a subtle color scale or data bars in the accent hue rather than default red/yellow/green traffic lights, unless true status semantics are needed.
- Freeze headers, set sensible column widths, and hide/group gridlines for a dashboard-style sheet rather than leaving raw spreadsheet gridlines visible on a presentation-facing tab.
- Chart styling: strip default chart chrome (gray plot background, heavy gridlines) and restyle to match the token palette.

### PDF / docx reports
- Establish a real typographic hierarchy (distinct, consistently-used styles for H1/H2/body/caption) via the document's style system, not manual bold/font-size changes per instance.
- Use a consistent margin and running header/footer system throughout.
- Use color purposefully for wayfinding (section tabs/colors, consistent accent for callouts) rather than decoration.
- Tables: align numbers right/decimal-aligned, use restrained borders (often just header underline + row separators), avoid heavy grid lines on every cell.

### HTML / web artifacts
- See the `frontend-design` skill for the full playbook (hero-as-thesis, type pairing, structural devices, motion, the three generic-AI-look patterns to avoid). Treat it as a required companion reference for this medium.
