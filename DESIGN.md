# VeriTraceAI — Design System (UI & UX)

> Governs every visual and interaction decision in `apps/web`. This is the
> *what it looks and feels like*; `ARCHITECTURE.md` is the *what it's built
> with*. Applies to both the MVP simulation build and the eventual production
> build — nothing here is simulation-only.

---

## 1. Design Principles (non-negotiable, in priority order)

1. **Evidence before conclusion.** Every claim on screen must be one click from
   its source. No UI surface states a fact without a visible evidentiary link.
2. **Fewer clicks to the decision point.** An investigator's core loop —
   open case → review finding → compare evidence → act — must never exceed
   **3 clicks from the case queue** to reach the decision action.
3. **Calm, not alarming.** This is not a fraud-alert dashboard. No red klaxon
   styling for findings; findings are discrepancies to investigate, not
   accusations to react to.
4. **Dense but legible.** Investigators review many data points per case;
   the design favors structured tables and comparison views over whitespace-
   heavy marketing-style layouts.

---

## 2. Color Palette

Rationale: compliance/financial tooling needs to read as *trustworthy and
precise*, not playful. Avoiding default shadcn black/zinc in favor of a
deep slate-blue primary — professional, distinct from both "danger red"
fintech fraud tools and generic SaaS purple.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--primary` | `#1E3A5F` | `#6B9FD4` | Primary actions, active nav, links |
| `--primary-foreground` | `#FFFFFF` | `#0A1221` | Text on primary |
| `--background` | `#FAFAF9` | `#0B1420` | Page background |
| `--surface` | `#FFFFFF` | `#131D2B` | Cards, panels |
| `--surface-raised` | `#FFFFFF` | `#1A2738` | Dialogs, dropdowns, popovers |
| `--border` | `#E4E4E7` | `#273449` | Dividers, table borders |
| `--border-strong` | `#D1D5DB` | `#3B4D63` | Focused input borders, active separators |
| `--muted-foreground` | `#52525B` | `#9AA5B1` | Secondary text, placeholders |
| `--foreground` | `#18181B` | `#E8ECF0` | Primary body text |
| `--finding-indicator` | `#B45309` | `#D89B4A` | Finding/discrepancy marker — amber, not red |
| `--finding-indicator-bg` | `#FEF3C7` | `#2A1F0D` | Finding card background tint |
| `--success` | `#166534` | `#4ADE80` | Cleared status |
| `--success-bg` | `#DCFCE7` | `#0A2615` | Cleared status background tint |
| `--escalated` | `#7C2D12` | `#E38B6B` | Escalated status — muted brick, not alarm red |
| `--escalated-bg` | `#FEE2E2` | `#2A1210` | Escalated status background tint |
| `--focus-ring` | `#2563EB` | `#60A5FA` | Keyboard focus (WCAG 2.1 AA) |

**Contrast verification (all pairings meet WCAG 2.1 AA — 4.5:1 body text,
3:1 large text/UI components):**

| Critical pairing | Light ratio | Dark ratio |
|---|---|---|
| `--foreground` on `--background` | 16.6:1 | 14.4:1 |
| `--primary` on `--background` | 11.0:1 | 5.6:1 |
| `--muted-foreground` on `--background` | 7.4:1 | 7.4:1 |
| `--finding-indicator` on `--surface` | 5.0:1 | 7.0:1 |
| `--success` on `--surface` | 7.1:1 | 9.7:1 |
| `--escalated` on `--surface` | 9.4:1 | 6.6:1 |

---

## 3. Typography

| Role | Font | Rationale |
|---|---|---|
| UI / body | **Inter** (variable) | Neutral, excellent at small sizes, wide language coverage |
| Numeric / tabular data | **Inter with `font-variant-numeric: tabular-nums`** | Ownership percentages, dates must align in columns |
| Evidence/document excerpts | **IBM Plex Mono** | Visually distinguishes *quoted source text* from *system-authored content*, reinforcing Principle #1 |

**Type scale** (rem, 1rem = 16px base):

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `--text-display` | 1.5rem | 600 | 1.33 | Case subject entity name (case header only) |
| `--text-heading` | 1.125rem | 600 | 1.44 | Section headers (Findings, Ownership, Documents) |
| `--text-subheading` | 0.9375rem | 600 | 1.47 | Card titles, table group headers |
| `--text-body` | 0.875rem | 400 | 1.57 | Default body text |
| `--text-caption` | 0.75rem | 400 | 1.5 | Metadata (timestamps, actor names, helper text) |
| `--text-mono` | 0.8125rem | 400 | 1.54 | Evidence quotes (IBM Plex Mono) |

---

## 4. Layout System

- **Grid:** 12-column, 24px gutter on ≥1280px; 8-column, 16px gutter on
  768–1279px; single-column stack below 768px.
- **Spacing scale:** 4px base unit — only these values are permitted:
  `2 / 4 / 6 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64`. No arbitrary
  one-off spacing values in component code.
- **Border radius scale:** `2px` (inputs, badges) / `4px` (cards, panels) /
  `6px` (buttons, dropdowns) / `8px` (dialogs, toasts) — no `rounded-full`
  except avatars, no `rounded-xl` or larger anywhere.

---

## 5. Application Shell

```
┌─────────────────────────────────────────────────────────────────────┐
│ ┌──────────┐                                                        │
│ │ VERITRACE│  Cases  Documents    [🔍 Search]      [☀/🌙] [avatar] │
│ │ AI       │                                                        │
│ └──────────┘                                                        │
├─────────────────────────────────────────────────────────────────────┤
│ Breadcrumb: Cases  ›  Nordhaven Trading Ltd  ›  Finding #2          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                        [page content]                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.1 Top Navigation Bar

- **Height:** 48px fixed.
- **Logo:** "VeriTraceAI" wordmark in `--primary`, `--text-subheading` weight.
  No icon/logo graphic in MVP — text-only wordmark. The name *is* the brand.
- **Primary nav items:** `Cases` (the queue), `Documents` (all-documents
  view, deferred post-MVP). Active item underlined with 2px `--primary`
  bottom border, not a background color change.
- **Search:** command-palette style trigger (`⌘K` / `Ctrl+K`), opens a
  centered overlay. MVP: searches cases by entity name only.
- **Right side:** theme toggle (sun/moon icon, no label), user avatar +
  name dropdown (MVP: static "Demo User" with no real auth).
- **Mobile (< 768px):** nav items collapse into a hamburger menu. Search
  moves into the hamburger. Logo stays.

### 5.2 Breadcrumbs

- Always visible below the top nav, 32px tall.
- Shows navigation path: `Cases` → `[Entity Name]` → `[Finding Label]`.
- Each segment is a clickable link. Current page segment is plain text,
  not a link.
- On `/cases` (the queue), breadcrumbs show only `Cases` — a single
  unhelpful breadcrumb is better than no breadcrumbs, because it establishes
  the pattern before you need it.

---

## 6. Key Screens

### 6.1 Case Queue (`/cases` — entry point, 0 clicks)

```
┌─────────────────────────────────────────────────────────────────┐
│ Cases (14)                                        [Filter ▾]    │
├─────────────────────────────────────────────────────────────────┤
│ [All (14)]  [Needs Review (8)]  [Escalated (2)]  [Cleared (4)] │
├────────────────┬──────────────┬───────────┬──────────┬──────────┤
│ Entity         │ Status       │ Findings  │ Assigned │ Updated  │
├────────────────┼──────────────┼───────────┼──────────┼──────────┤
│ Nordhaven      │ ⚑ Under      │ ● 2 open  │ A. Reyes │ 18 Nov   │
│ Trading Ltd    │   Review     │           │          │ 09:12    │
├────────────────┼──────────────┼───────────┼──────────┼──────────┤
│ Greenfield     │ ✓ Cleared    │ — none    │ J. Khan  │ 15 Nov   │
│ Holdings       │              │           │          │ 14:30    │
└────────────────┴──────────────┴───────────┴──────────┴──────────┘
```

**Behavior:**
- Status filter chips are URL-persisted query params (`?status=under_review`).
  Bookmarking/sharing a filtered view reproduces it exactly.
- Sortable columns: Entity (alpha), Status, Findings (count), Updated (date).
  Default sort: `updated_at DESC` (most recently touched first).
- Row click navigates to `/cases/[caseId]`.
- Row hover: subtle `--surface-raised` background — no color shift, no scale,
  no shadow change. Cursor: `pointer`.

**States:**

| State | What the user sees |
|---|---|
| **Loading** | Skeleton rows — 6 rows of shimmer placeholders matching the table structure. No spinner. |
| **Empty (no cases)** | Centered illustration-free message: "No cases yet. Cases appear here when created." — no cartoon robot, no "Get started!" button, no emoji. |
| **Empty (filtered, no matches)** | "No cases match the current filters." with a "Clear filters" text button. |
| **Error** | Inline banner above the table: "Unable to load cases. [Retry]" in `--escalated` text. No modal. |

### 6.2 Case Detail (`/cases/[caseId]` — 1 click from queue)

```
┌─────────────────────────────────────────────────────────────────┐
│ Nordhaven Trading Ltd                    Status: ⚑ Under Review │
│ Registry: UK-12345678  •  Jurisdiction: UK  •  Assigned: A. Reyes│
├─────────────────────────┬───────────────────────────────────────┤
│ FINDINGS                │ EVIDENCE COMPARISON                    │
│                         │                                        │
│ ● Ownership % conflict  │ Finding: Ownership percentage conflict │
│   40% declared vs 55%   │                                        │
│   observed              │ ┌─ DECLARED ──────┬─ OBSERVED ───────┐ │
│                         │ │ Source: Form     │ Source: Registry  │ │
│ ○ Address mismatch      │ │ Page 3           │ Filing 2026-Q2   │ │
│   Registered vs         │ │                  │                   │ │
│   operating address     │ │ `40% ownership`  │ `55% ownership`   │ │
│   differ                │ │  of subsidiary   │  of subsidiary    │ │
│                         │ │  Greenfield Ltd  │  Greenfield Ltd   │ │
│                         │ └──────────────────┴───────────────────┘ │
│                         │                                        │
│                         │ [View source document →]               │
│                         │                                        │
│                         │ ─── AI-Drafted Summary ──────────────  │
│                         │ │ DRAFT                               │ │
│                         │ │ Registry records show 55%           │ │
│                         │ │ ownership of Greenfield Ltd,        │ │
│                         │ │ conflicting with the 40% declared   │ │
│                         │ │ in the submitted shareholder form.  │ │
│                         │ └─────────────────────────────────────│ │
├─────────────────────────┴───────────────────────────────────────┤
│ ⚑ Record Decision                                               │
│ [Request More Evidence]  [Clear Finding]  [Escalate Case]        │
└─────────────────────────────────────────────────────────────────┘
```

**Layout:**
- Left rail: **Findings list** — 280px fixed width on desktop.
  - Each finding shows: type label, one-line summary, status dot (amber =
    open, green = cleared).
  - Active finding has `--primary` left border (3px), `--surface-raised`
    background.
  - Clicking a finding swaps the right panel content. **No route change.**
    Pure Zustand client state.
  - Below 1024px: findings become horizontal tabs above the comparison panel.
- Right panel: **Evidence Comparison** for the active finding.
  - Two-column layout: "Declared" vs "Observed" (or more columns if more
    sources exist — but MVP fixtures have exactly two).
  - Source references are clickable links to the Document Viewer.
  - Evidence quotes render in `IBM Plex Mono` with `--finding-indicator-bg`
    background tint — this is what makes quoted source text visually distinct.
  - Below the comparison: the AI-drafted narrative card (see §6.4).

**Case Header:**
- Entity name in `--text-display`.
- Metadata row: registry ID, jurisdiction, assigned investigator — in
  `--text-caption`, `--muted-foreground`.
- Status badge: top-right, always visible. See §8 for badge spec.

**Decision Row:**
- Permanently visible at the bottom of the page — sticky, not scrolled away.
- Label: "Record Decision" with the neutral flag `⚑` icon.
- Three actions, all equally weighted visually (no primary/secondary
  distinction — the investigator chooses, the UI doesn't steer):
  - **Request More Evidence** — outline button, `--primary` text.
  - **Clear Finding** — outline button, `--success` text.
  - **Escalate Case** — outline button, `--escalated` text.
- All buttons disabled when the case is in a terminal state (`Cleared`,
  `Escalated`). Disabled state: `opacity: 0.4`, `cursor: not-allowed`.
- All buttons disabled per state machine rules (e.g., cannot Clear while
  any finding is `open` and unaddressed).

**States:**

| State | What the user sees |
|---|---|
| **Loading** | Full-page skeleton: header block + two-column shimmer |
| **Case not found (404)** | "Case not found. It may have been removed." + "Back to Cases" link |
| **No findings** | Findings rail shows: "No findings raised for this case." Evidence panel shows: "Select a finding to compare evidence." |
| **Decision recorded** | Toast notification (bottom-right, 4s auto-dismiss): "Decision recorded: [action]." Case status badge updates immediately. |

### 6.3 Decision Confirmation Dialog

Triggered by any decision action button. This is a **modal dialog**, not
inline — because decisions are consequential and irreversible.

```
┌─────────────────────────────────────────────────┐
│ Escalate Case                                    │
│                                                  │
│ You are escalating the case for                  │
│ Nordhaven Trading Ltd. This action               │
│ is recorded and cannot be undone.                 │
│                                                  │
│ Rationale (required):                            │
│ ┌──────────────────────────────────────────────┐ │
│ │ Ownership discrepancy exceeds 10% threshold  │ │
│ │ and registry filing date precedes declared    │ │
│ │ form by 6 months.                            │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│              [Cancel]  [Confirm Escalation]       │
└─────────────────────────────────────────────────┘
```

- **Rationale text area:** required, minimum 10 characters. Maps directly
  to `case_decisions.rationale` (NOT NULL in schema). This is not optional
  UX polish — it's enforcing the database contract.
- **Confirm button:** uses the semantic color of the action (`--success`
  for Clear, `--escalated` for Escalate, `--primary` for Request Evidence).
- **Cancel:** closes dialog, no state change.
- **While submitting:** Confirm button shows inline spinner + "Recording..."
  text, disabled. No repeated clicks.

### 6.4 AI-Drafted Summary Card (replaces NarrativeStream)

This is **not** a streaming/typing component. The narrative text is
pre-written (in the simulation) or AI-generated (in production). Either way,
it renders immediately as static text.

```
┌──────────────────────────────────────────┐
│ AI-Drafted Summary              [DRAFT]  │
│                                          │
│ Registry records show 55% ownership of   │
│ Greenfield Ltd, conflicting with the 40% │
│ declared in the submitted shareholder    │
│ form. The registry filing (2026-Q2)      │
│ predates the submitted form by 6 months. │
│                                          │
│ ── Evidence cited: 2 sources             │
└──────────────────────────────────────────┘
```

- **"DRAFT" badge:** always visible, top-right, in `--muted-foreground` on a
  `--border` background pill. Communicates that this is AI-authored, not a
  verified conclusion — without hiding it, burying it in a tooltip, or
  over-styling it. It's a fact, not a warning.
- **Card background:** `--surface` with `--border` left border (2px) —
  visually set apart from the evidence section but not competing with it.
- **Font:** `--text-body` (Inter), not monospace — this is system-generated
  content, not a source quote. The typeface split reinforces the distinction.
- **"Evidence cited" footer:** links to the evidence rows that inform this
  narrative. Clicking scrolls/highlights the corresponding evidence cards.

**Why no typing animation:** The typing effect is a UI pattern that
communicates "this content is being generated right now by an AI model."
In the simulation build, that's a lie — the text is a static fixture. In
production, the narrative is generated during case processing (not while
the investigator is watching), so it's also not streaming in real-time.
Rendering it immediately is honest. The DRAFT badge is sufficient to
communicate its AI-authored provenance.

### 6.5 Document Viewer (`/cases/[caseId]/documents/[documentId]`)

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to case    shareholder_register.pdf    Page 3 of 8       │
│                                               [−] 100% [+]      │
├─────────────────────────────────┬───────────────────────────────┤
│                                 │ Extracted Fields              │
│  ┌─────────────────────────┐    │                               │
│  │                         │    │ ⬤ ownership_percentage        │
│  │  ┌───────────────────┐  │    │   Value: "40%"                │
│  │  │  "40% ownership"  │──│────│   Confidence: 0.94            │
│  │  └───────────────────┘  │    │   Page 3, Region (120,340)    │
│  │                         │    │                               │
│  │  [PDF page content]     │    │ ⬤ director_name               │
│  │                         │    │   Value: "Erik Nordhaven"     │
│  └─────────────────────────┘    │   Confidence: 0.98            │
│                                 │   Page 1, Region (80,120)     │
│  [◄ Prev]  3 / 8  [Next ►]     │                               │
├─────────────────────────────────┴───────────────────────────────┤
│ ← Back to Nordhaven Trading Ltd                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Implementation:**
- **PDF rendering:** `react-pdf` (PDF.js wrapper for React). The PDF is
  rendered as a canvas element. In the MVP simulation, use a static PNG/JPG
  image of a sample document page instead of actual PDF rendering — this
  avoids the PDF.js bundle overhead for a demo while still showing the
  bounding-box interaction.
- **Bounding-box overlays:** SVG layer absolutely positioned over the
  document canvas/image. Each extracted field gets a rectangle overlay with:
  - 2px `--finding-indicator` border (amber outline, not filled).
  - On hover: fills with `--finding-indicator-bg` (semi-transparent amber).
  - On click: scrolls the right-panel field list to the corresponding entry
    and highlights it.
- **Right panel: Extracted Fields** — 320px fixed width.
  - Each field shows: type, extracted value (in `IBM Plex Mono`), OCR
    confidence score, page/region reference.
  - Clicking a field scrolls the document viewer to its page and pulses the
    bounding box once (1-second `--finding-indicator` glow, not a repeating
    animation).
- **Zoom:** `[−] 100% [+]` controls. Steps: 50%, 75%, 100%, 125%, 150%.
  Bounding-box SVG layer scales proportionally with the document.
- **Page navigation:** `[◄ Prev] 3 / 8 [Next ►]` or keyboard arrows.

**States:**

| State | What the user sees |
|---|---|
| **Loading** | Left panel: gray placeholder rectangle at document aspect ratio. Right panel: 3 skeleton field cards. |
| **Document not found** | "Document not found." + "Back to case" link. |
| **No extracted fields** | Right panel: "No fields extracted from this document." Left panel: document renders normally without overlays. |

---

## 7. Status Badges

Status is **never** color-only. Every status uses: semantic color +
icon glyph + text label.

| Status | Icon | Color token | Background token | Label |
|---|---|---|---|---|
| Intake | `○` (empty circle) | `--muted-foreground` | none | Intake |
| Under Review | `⚑` (flag) | `--finding-indicator` | `--finding-indicator-bg` | Under Review |
| Cleared | `✓` (check) | `--success` | `--success-bg` | Cleared |
| Escalated | `▲` (up triangle) | `--escalated` | `--escalated-bg` | Escalated |
| Evidence Requested | `◉` (dot circle) | `--primary` | none | Evidence Requested |

Badge shape: pill (`border-radius: 2px`, `padding: 2px 8px`). Text in
`--text-caption` size. Icon left of text, 4px gap. Background is the
`-bg` variant token (subtle tint, not full saturation).

---

## 8. Interaction & Motion

### 8.1 Permitted Motion

Framer Motion is used **only** for these interactions:

| Interaction | Animation | Duration | Easing |
|---|---|---|---|
| Panel swap (finding selection) | Cross-fade content, no spatial movement | 150ms | `ease-out` |
| Dialog open/close | Fade + 4px Y-translate | 150ms in, 100ms out | `ease-out` / `ease-in` |
| Toast enter/exit | Slide in from right edge, fade out | 200ms in, 150ms out | `ease-out` |
| Button press feedback | Scale to 0.98 on `mousedown` | 100ms | `ease-out` |
| Skeleton shimmer | Gradient sweep, left-to-right | 1.5s, looping | `linear` |

### 8.2 Explicitly Forbidden Motion

- **No typing/streaming animations** on any text content.
- **No fade-in on data arrival** — findings, evidence, case details appear
  instantly and fully. Delay-reading compliance data is actively harmful.
- **No slide-up/stagger entrance** for list items or table rows.
- **No parallax, scroll-triggered animations, or decorative motion.**
- **No loading spinners on page-level transitions** — use skeleton screens.
  Spinners are permitted only inline on buttons during form submission.

---

## 9. Keyboard Navigation

### 9.1 Global

| Key | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open search palette |
| `⌘.` / `Ctrl+.` | Toggle theme (light/dark) |

### 9.2 Case Queue (`/cases`)

| Key | Action |
|---|---|
| `j` / `↓` | Move selection to next case row |
| `k` / `↑` | Move selection to previous case row |
| `Enter` | Open selected case |

### 9.3 Case Detail (`/cases/[caseId]`)

| Key | Action |
|---|---|
| `1`–`9` | Select finding by position in the list |
| `d` | Open decision dialog for current finding |
| `Escape` | Close any open dialog / deselect finding |
| `Backspace` | Navigate back to case queue |

---

## 10. Theming

Light/dark via `next-themes`. Dark mode is not merely inverted colors —
each semantic token has independently tuned light and dark values (see
palette table, §2). Key differences:

- `--primary` shifts from deep navy (#1E3A5F) to a lighter steel blue
  (#6B9FD4) to maintain contrast on the dark background.
- `--finding-indicator-bg`, `--success-bg`, and `--escalated-bg` are
  darkened to near-black tinted variants in dark mode — not simply the
  light-mode background colors with reduced opacity.
- `--surface-raised` (dialogs, dropdowns) is visually distinct from
  `--surface` (cards, panels) in both themes — in dark mode this means
  two distinct shades of dark blue, not the same value.

---

## 11. Accessibility

- All interactive elements keyboard-reachable in logical tab order; focus
  ring uses `--focus-ring` (2px offset outline), never the browser default.
- Status is never color-only: every status chip and finding indicator pairs
  color with an icon glyph and text label (WCAG 2.1 AA 1.4.1).
- Evidence comparison view (§6.2) is marked up as a data table with proper
  `<th scope="col">` headers, not a `div`-soup visual layout.
- All images and document thumbnails have descriptive `alt` text.
- Toast notifications are `role="status"` with `aria-live="polite"`.
- Dialog components use `role="dialog"`, `aria-modal="true"`, and trap
  focus within while open.
- Minimum touch target: 44×44px on all interactive elements (WCAG 2.5.5).

---

## 12. Iconography

**Lucide Icons** — open-source, consistent stroke-width (1.5px default),
comprehensive set without needing a second icon dependency. Preferred over
Radix Icons for broader coverage of the domain-specific glyphs needed
(document, flag, search, filter, etc.).

Usage rules:
- Icons are 16×16px at `--text-body` context, 20×20px in nav/header context.
- Icons are always accompanied by a text label — never icon-only buttons
  except the theme toggle and the search trigger (`⌘K`), which have
  `aria-label` attributes.
- Finding indicators use the flag icon (`Flag`), not a warning triangle —
  consistent with Principle #3 (calm, not alarming).

---

## 13. Responsive Breakpoints

| Breakpoint | Layout changes |
|---|---|
| ≥ 1280px | Full 3-column layout: nav + findings rail + evidence panel |
| 1024–1279px | Findings rail narrows to 220px; evidence panel fills remaining |
| 768–1023px | Findings become horizontal scrollable tabs above evidence panel |
| < 768px | Single-column stack. Nav collapses to hamburger. Decision row remains sticky at bottom. Document viewer goes full-width, extracted fields collapse to an accordion below. |
