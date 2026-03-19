# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Incubator monorepo for experimental projects and ideas. Projects start as spikes here and graduate when ready.

## Structure

- Currently flat: each project gets a top-level folder, spike ideas as numbered markdown files (e.g., `001-*.md`)
- Moving to pnpm workspace monorepo with a `packages/` subfolder and shared lockfile
- Default stack: pnpm + TypeScript
- Elm/Koka projects use package.json for build scripts only

## Spikes

- Minimal, just enough to validate
- No code required — a markdown doc can be the entire spike
