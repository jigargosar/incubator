# Speeding Up Git Commit Workflow

## Problem

Committing frequently via Claude Code is slow. Each commit involves multiple
sequential LLM inference turns (git status, diff, log, draft message, add,
commit, push) — each costing ~2-3 seconds of overhead.

## Solution: flash-commit-push

MCP server + AHK hotkey. MCP for lifecycle, AHK for speed.

### Architecture

1. MCP server (Node.js + TypeScript)
   a. Started/stopped automatically by Claude Code (session lifecycle)
   b. Watches file changes via chokidar
   c. On change: runs git diff/status, calls Haiku API to draft commit message
   d. Stores latest message in memory
   e. Exposes HTTP endpoint (e.g., localhost:3847) for direct access
   f. Also exposes MCP tools as fallback

2. AHK hotkey (bypasses Claude entirely)
   a. Ctrl+Shift+C → commit only
   b. Ctrl+Shift+P → commit + push
   c. Hits HTTP endpoint, shows pre-drafted message
   d. On confirm: executes git add + commit (+ push)

### MCP Tools (fallback path)

1. get_commit_message → returns pre-cached message + file list
2. execute_commit(message, files) → git add + commit
3. execute_commit_push(message, files) → git add + commit + push

### Slash Commands (fallback path)

1. /c → commit only
2. /cp → commit + push

### Stack

1. pnpm + TypeScript
2. @modelcontextprotocol/sdk
3. chokidar (file watching)
4. Claude Haiku API (message drafting)

## Status

Spike — not started
