# Incubator

Experimental projects and ideas — a single repo holding many small,
independent projects while they incubate.

## Structure

Flat. Each project is a self-contained top-level folder with its own
tooling (its own `package.json`, lockfile, build scripts, CLAUDE.md).
Nothing is shared across projects — no workspace, no shared lockfile.

Single-file spike ideas live as numbered markdown at the root
(e.g. `001-some-idea.md`).

## Projects

- **remotion-spike** — programmatic video exploration with Remotion
  + Vite.
- **windows-services-gui** — PowerShell/fzf tooling to browse and
  preview Windows services.
