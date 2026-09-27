# Construction Reports — agent split

Use project subagents so marketing and the daily log can move in parallel.

## Who does what

| Agent | Owns | Do not touch |
| --- | --- | --- |
| `/planner` | Slice the request, assign owners, list file globs | Implementation |
| `/marketing` | Apex `index.html`, landing copy, public nav, quote/contact forms | `/app` report logic |
| `/field-log` | Jobs, dailies, search, print, `localStorage`, `/app` routes | Apex page and landing sales copy |
| `/verifier` | Prove a slice works | Fixes |

Invoke with `/planner`, `/marketing`, `/field-log`, or `/verifier`, or ask the parent to run them in parallel.

## Current repo

- `main` — Apex Construction marketing page (`index.html`)
- [PR #1](https://github.com/ConstructionReports/version-1/pull/1) — Vite + React daily log on `cursor/construction-reports-website-70c4`

Treat those as two workstreams until someone asks to merge them.

## Parallel rules

1. Run `/planner` first when a request spans both surfaces.
2. One implementer per owned file set. Shared files (`README.md`, root vs Vite `index.html`, `src/types.ts`, `src/styles.css`) get a single owner for that slice.
3. Run `/verifier` after implementers finish, before calling the work ready.
4. Prefer isolated worktrees or separate branches when two implementers will edit at once.
