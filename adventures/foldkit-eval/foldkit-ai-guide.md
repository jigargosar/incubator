# Using Foldkit with AI

A practical guide to driving Foldkit development with AI agents (Claude Code). Sourced from foldkit.dev/ai/{overview, skills, mcp}.

## 1. Why Foldkit suits AI

1. Rigid structure: every piece has a canonical shape and function — code is machine-legible.
2. Side effects concentrate in 6 places: Commands, Mount Effects, flags, Subscription streams, Resources, ManagedResources.
3. Every message routes through `update`, so an agent can reason about the whole program as a state machine.

## 2. Setup — vendor Foldkit via git subtree

Give the AI direct access to source, examples, and docs (real patterns to learn from).

Add:
```bash
git subtree add --prefix=repos/foldkit https://github.com/foldkit/foldkit.git main --squash
```

Update:
```bash
git subtree pull --prefix=repos/foldkit https://github.com/foldkit/foldkit.git main --squash
```

Notes:
- Unlike submodules, subtrees are checked in — fresh clones include source immediately.
- Starter template ships `AGENTS.md` (conventions) and `.ignore` files to keep vendored code tidy.

## 3. Skills plugin (Claude Code)

Encodes Foldkit conventions, patterns, and quality bar into agent workflows. Skills reference real example code, staying synced with framework evolution.

Install:
```
/plugin marketplace add foldkit/foldkit
/plugin install foldkit-skills@foldkit
```

Skills:
1. `/foldkit-skills:foldkit` — always-on framing; auto-loads when Foldkit context is detected; points at vendored canonical sources.
2. `/foldkit-skills:generate-program` — natural language → complete, idiomatic program (Model schemas, Message naming, Commands with error handling, UI components).
3. `/foldkit-skills:audit-program` — read-only review vs. architecture; reports BLOCKERS / QUALITY / NICE-TO-HAVE; fixes need explicit approval.

In development: message-scaffolding and Submodel-extraction skills.

## 4. DevTools MCP server

`@foldkit/devtools-mcp` lets agents observe and interact with a running app: read current Model, list/inspect Message history, rewind to any past Model, and dispatch Messages into the runtime. Complements skills (real-time interaction, not just generation).

Setup:
- `create-foldkit-app` projects come pre-configured.
- Existing projects: `npx @foldkit/devtools-mcp init`
- Optional faster startup: `npm install -D @foldkit/devtools-mcp`

Configure Vite (`vite.config.ts`):
```typescript
import { defineConfig } from 'vite'
import { foldkit } from '@foldkit/vite-plugin'

export default defineConfig({
  plugins: [foldkit({ devToolsMcpPort: 9988 })],
})
```

Configure Runtime:
```typescript
Runtime.makeApplication({
  devTools: {
    Message,
  },
})
```

### MCP tools (each accepts optional `runtime_id`)

| Tool | Purpose |
|------|---------|
| `foldkit_list_runtimes` | Discover connected browser tabs |
| `foldkit_get_model` | Capture current Model state |
| `foldkit_get_model_at` | Access historical Model snapshots |
| `foldkit_get_init` | Retrieve initial Model and Commands |
| `foldkit_get_runtime_state` | Check DevTools status |
| `foldkit_list_messages` | Browse Message history with filtering |
| `foldkit_count_messages_by_tag` | Aggregate by Message tag |
| `foldkit_diff_models` | Compare Models at different points |
| `foldkit_get_message` | Inspect specific history entry |
| `foldkit_list_keyframes` | Find replayable states |
| `foldkit_replay_to_keyframe` | Time-travel to a previous state |
| `foldkit_resume` | Continue execution |
| `foldkit_get_message_schema` | Retrieve Message Schema for construction |
| `foldkit_dispatch_message` | Send Messages to the runtime |

Architecture & caveats:
- WebSocket relay: browser bridge → Vite plugin relay → typed tools → MCP Node process.
- Requires `devTools: true` in program config.
- Without `Message` in DevToolsConfig, message dispatch is disabled.
- Relay is dev-only; production builds exclude it.

## 5. Recommended workflow

1. Vendor Foldkit via subtree so the agent has canonical sources.
2. Install the skills plugin; let `foldkit` skill auto-frame.
3. Scaffold with `generate-program`.
4. Run dev server with DevTools MCP enabled.
5. Use MCP tools to inspect Model/messages, replay, and dispatch test messages.
6. Run `audit-program` before finalizing; approve fixes explicitly.
