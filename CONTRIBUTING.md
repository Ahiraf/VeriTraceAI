# Contributing to VeriTraceAI

Thank you for your interest in contributing to VeriTraceAI! We welcome contributions to improve our evidence-grounded UBO compliance platform.

---

## 1. Code of Conduct & Development Principles

- **Evidence First**: All domain features must preserve evidentiary grounding. Never invent shortcuts that collapse discrete findings into ambiguous aggregate scores.
- **Strict Quality Gates**: Pull requests must pass linting, typechecking, and test suites across all packages.
- **Zero AI Slop**: User interface code must respect the design tokens, WCAG 2.1 AA contrast requirements, and calm visual principles codified in `docs/ui/DESIGN.md`.

---

## 2. Development Workflow & Branching Model

1. **Branch Naming**:
   - `feat/<topic>`: New features or major capabilities.
   - `fix/<issue>`: Bug fixes and state machine corrections.
   - `docs/<topic>`: Documentation enhancements.
2. **Commit Conventions**:
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat(web): add interactive ubo graph visualizer with react-flow
   fix(api): enforce 10-char rationale minimum on case escalation
   docs(specs): add state machine transition guard for ofac 50% rule
   ```
3. **Pre-PR Verification**:
   Before submitting your changes, execute:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   ```

---

## 3. Pull Request Guidelines

- Provide a concise explanation of what the pull request achieves and which part of the specification it satisfies.
- Ensure all new public functions and components are accompanied by clear tests.
- Never include credentials, private keys, or internal prompt instructions in commits or PR bodies.
