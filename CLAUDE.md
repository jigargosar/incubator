# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A single repo holding many small, independent experimental projects while they incubate. Projects start as spikes and graduate out when ready.

## Structure

- Flat: each project is a self-contained top-level folder; spike ideas are numbered markdown files (e.g., `001-*.md`)
- Not a monorepo — no shared workspace, no shared lockfile. Each project carries its own tooling (its own `package.json`, lockfile, build scripts)
- Default stack: pnpm + TypeScript; Elm/Koka projects use package.json for build scripts only
- Each project may have its own CLAUDE.md with project-specific commands and architecture

## Spikes

- Minimal, just enough to validate
- No code required — a markdown doc can be the entire spike
