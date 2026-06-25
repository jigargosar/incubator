# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A single repo where small, independent ideas are incubated. Each one that succeeds graduates — it migrates out into its own repo.

## Structure

- Adventures-in-progress are self-contained folders under `adventures/`; one-file spike ideas are numbered markdown at the root (e.g., `001-*.md`)
- Not a monorepo — no shared workspace, no shared lockfile. Each adventure carries its own tooling (its own `package.json`, lockfile, build scripts)
- Default stack: pnpm + TypeScript; Elm/Koka projects use package.json for build scripts only
- Each adventure may have its own CLAUDE.md with adventure-specific commands and architecture
- When an adventure is ready, move its folder out of `adventures/` into a standalone repo

## Spikes

- Minimal, just enough to validate
- No code required — a markdown doc can be the entire spike
