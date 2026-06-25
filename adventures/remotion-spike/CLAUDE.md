# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Spike exploring Remotion-style programmatic video concepts. Implements custom animation primitives (interpolate, spring) instead of using the Remotion library, to understand the core model: videos as React components driven by a frame counter.

## Stack

Vite 8 + React 19 + Tailwind CSS (CDN). Plain JSX — not TypeScript.

## Commands

- `pnpm vite --open` — start dev server
- `pnpm install` — install dependencies

No test, lint, or build scripts are configured.

## Architecture

Single-file app in `remotion-spike.jsx`:

1. **Animation primitives** (`interpolate`, `spring`) — frame-based functions that map frame numbers to animated values. `interpolate` uses clamped easeInOut cubic; `spring` uses damped harmonic oscillator physics.
2. **Slide system** — array of `{ id, render(localFrame) }` objects. Each slide gets `SLIDE_DURATION` frames (150 at 30 FPS = 5 seconds). Slides animate independently using their local frame offset.
3. **Player** (`RemotionPresentation`) — `setInterval`-based playback loop that increments a global frame counter. Keyboard controls: Space (play/pause), Arrow keys (prev/next slide). Auto-loops on completion.

Entry point: `main.jsx` → mounts `<App />` from `remotion-spike.jsx`.
