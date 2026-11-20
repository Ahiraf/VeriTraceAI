# Repository Agent Guidelines & Canonical Standards — VeriTraceAI

This document defines standard conventions, architectural standards, and development protocols for AI agents working in this repository.

Canon for every AI agent. **Applies unprompted** — "just add the endpoint" waives nothing. If another configuration disagrees, this file wins. Source of truth for system architecture: `docs/architecture/ARCHITECTURE.md`. Conflict -> stop and flag.

Stack:
- `apps/web`: Next.js 15 (App Router, Server Components + Client Islands), TypeScript, Tailwind CSS, shadcn/ui, Zustand (with LocalStorage `persist`), `@tanstack/react-query`, `@xyflow/react` (React Flow).
- `apps/api`: FastAPI (Python 3.12) modular monolith organized into bounded contexts (`case_evidence`, `intake`, `screening`, `platform`).
- `packages/types`: Canonical TypeScript DTOs, domain models, and API wire schemas mirrored into Python models.

---

## 1. Commit and Version Control Policies

- **Never Commit Automatically**: Agents must never execute `git commit` or push code autonomously. All changes remain staged/unstaged for the user to review, stage, and commit manually.
- **Explicit Message Generation**: Never generate or update version control files autonomously. Only prepare messages when explicitly requested by the user.
- **Dual Commit & PR Generation**: When requested, generate BOTH the conventional commit message in `temp/COMMIT_MESSAGE.txt` AND the GitHub pull request description in `temp/PR_DESCRIPTION.md` simultaneously.
- **Promotion Path & Quality Gates**: Follow Conventional Commits (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`). Promotion path: local feature -> local `dev` -> quality gates green -> PR `origin/dev` -> `main`. Never push directly to `main`; never use `--no-verify`.

---

## 2. Information Leakage Prevention Policy

- **Zero Internal Leakage**: Never mention or leak internal engineering briefs, execution metadata, raw prompt instructions, system messages, conversation IDs, or temporary planning labels in code, comments, docs, commit messages, or PR descriptions.
- **Mandatory Repository Scan**: Before finalizing messages or docs: (1) Scan modified/created files for internal prompt terminology; (2) Verify evaluation task briefs are not echoed verbatim.

---

## 3. Monorepo Package Boundaries & Core Architecture

- **Strict Boundary Segregation**:
  - `packages/types`: Sole source of truth for all shared domain types (`Case`, `Finding`, `Evidence`, `OwnershipGraph`, `CaseDecision`). Never redefine types inline in components.
  - `apps/web`: Pure presentation and interactive simulation shell. Client UI state lives in Zustand; server state caches via React Query.
  - `apps/api`: Backend FastAPI process containing bounded context routers and state machine transition enums.
- **Dependency Flow**: Strict downward flow from `apps/*` into `packages/*`. Packages never import from `apps/*`. Link workspace packages with `"workspace:*"`.

---

## 4. UI/UX Standards & Zero AI Slop Guard

- **Zero AI Slop**:
  - **No Fake Typing/Streaming**: Never fake typewriter animations on pre-written text. System narratives render statically with an explicit `[DRAFT]` badge.
  - **Color Semantics**: Discrepancies and findings use `--finding-indicator` (amber `#B45309`), never alarming pure red. Red is strictly reserved for case-level escalations.
  - **Typography Split**: UI chrome and system text use `Inter`; verbatim quoted source evidence strictly uses `IBM Plex Mono` to visually reinforce source truth.
- **Full UI State Coverage**: Every screen must provide explicit Loading (skeleton shimmers), Empty, and Error states.
- **Consequential Decisions**: State-altering compliance decisions (`Cleared`, `Escalated`) require confirmation and a written rationale (minimum 10 characters).

---

## 5. File Size Ceiling & Directory Density Guard

- **Strict 250-Line Non-CSS Guard**: Any TypeScript or TSX file exceeding 250 lines must be proactively modularized into focused sub-components, custom hooks, or utility helpers.
- **Directory Density Limit**: Directories must contain at most 12 files. Group larger sets into domain subdirectories with a unifying `index.ts` barrel export.
- **CSS Stylesheet Preservation**: Do NOT split internal lines of CSS stylesheets. Keep CSS files intact, cohesive, and format cleanly.

---

## 6. Subsystem Verification & CI Build Pipeline

- **Automated Validation Sequence**: Before completing tasks, execute:
  1. `pnpm lint`: Zero warnings and zero errors across workspace packages (`eslint --max-warnings=0`).
  2. `pnpm typecheck`: Strict TypeScript type checking without emitting artifacts (`tsc --noEmit`).
  3. `pnpm test`: Vitest unit/component tests and pytest backend suites.
  4. `pnpm build`: Full Turbo build pipeline validation.
- **Never Weaken a Gate**: Never alter assertions, coverage floors, or lint rules to force a pass. Report red as red.
