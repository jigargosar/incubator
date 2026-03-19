# Incubator

Experimental projects and ideas.

## Structure

Currently flat — each project gets a top-level folder.

### Root files

- `CLAUDE.md` — project instructions (flat structure, markdown,
  minimal spikes)
- `001-claude-speeding-up-git-commit-workflow.md` — spike:
  MCP server + AHK hotkey for fast git commits via Claude Code
  (status: not started)

### Planned: pnpm workspaces

Moving to a pnpm workspace monorepo with a `packages/` subfolder:

    pnpm-workspace.yaml
    package.json
    packages/
      claude-settings-editor-unofficial/
      some-other-project/

- `packages/*` glob in pnpm-workspace.yaml
- Only folders with a package.json become workspaces
- Single lockfile shared across all projects
- Most projects will be Node/TS; Elm/Koka projects use package.json
  for build scripts
- If a project truly doesn't fit the monorepo, isolate it in a
  separate top-level directory

### Explore: Bit

pnpm docs mention Bit as an alternative that automates monorepo
management on top of pnpm. Worth evaluating before committing
to plain pnpm workspaces.

## Projects

- **claude-settings-editor-unofficial** — CLI to configure Claude
  Code settings files (env vars, permissions, hooks) beyond what
  the built-in /config command supports
- **001-claude-speeding-up-git-commit-workflow** — MCP server +
  AHK hotkey for fast git commits (spike, not started)
