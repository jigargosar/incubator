# Incubator

A single repo where small, independent ideas are incubated. Each one
that succeeds graduates — it migrates out into its own repo.

## Structure

Adventures-in-progress live as self-contained folders under
`adventures/`, each with its own tooling (its own `package.json`,
lockfile, build scripts, CLAUDE.md). Nothing is shared across them —
no workspace, no shared lockfile.

Single-file spike ideas live as numbered markdown at the root
(e.g. `001-some-idea.md`).

When an adventure is ready, move its folder out of `adventures/`
into a standalone repo.

## Adventures

- **adventures/remotion-spike** — programmatic video exploration
  with Remotion + Vite.
- **adventures/windows-services-gui** — PowerShell/fzf tooling to
  browse and preview Windows services.
