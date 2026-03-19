# Update Config Skill Reference

## When Hooks Are Required (Not Memory)

If the user wants something to happen automatically in response to an EVENT, they need a **hook** configured in settings.json. Memory/preferences cannot trigger automated actions.

**These require hooks:**
- "Before compacting, ask me what to preserve" → PreCompact hook
- "After writing files, run prettier" → PostToolUse hook with Write|Edit matcher
- "When I run bash commands, log them" → PreToolUse hook with Bash matcher
- "Always run tests after code changes" → PostToolUse hook

**Hook events:** PreToolUse, PostToolUse, PreCompact, PostCompact, Stop, Notification, SessionStart

## Read Before Write

Always read the existing settings file before making changes. Merge new settings with existing ones — never replace the entire file.

## Config Tool vs Direct Edit

**Use the Config tool** for these simple settings:
- `theme`, `editorMode`, `verbose`, `model`
- `language`, `alwaysThinkingEnabled`
- `permissions.defaultMode`

**Edit settings.json directly** for:
- Hooks (PreToolUse, PostToolUse, etc.)
- Complex permission rules (allow/deny arrays)
- Environment variables
- MCP server configuration
- Plugin configuration

## Settings File Locations

| File | Scope | Git | Use For |
|------|-------|-----|---------|
| `~/.claude/settings.json` | Global | N/A | Personal preferences for all projects |
| `.claude/settings.json` | Project | Commit | Team-wide hooks, permissions, plugins |
| `.claude/settings.local.json` | Project | Gitignore | Personal overrides for this project |

Settings load in order: user → project → local (later overrides earlier).

## Settings Schema Reference

### Permissions
```json
{
  "permissions": {
    "allow": ["Bash(npm:*)", "Edit(.claude)", "Read"],
    "deny": ["Bash(rm -rf:*)"],
    "ask": ["Write(/etc/*)"],
    "defaultMode": "default" | "plan" | "acceptEdits" | "dontAsk",
    "additionalDirectories": ["/extra/dir"]
  }
}
```

**Permission Rule Syntax:**
- Exact match: `"Bash(npm run test)"`
- Prefix wildcard: `"Bash(git:*)"` — matches `git status`, `git commit`, etc.
- Tool only: `"Read"` — allows all Read operations

### Environment Variables
```json
{
  "env": {
    "DEBUG": "true",
    "MY_API_KEY": "value"
  }
}
```

### Model & Agent
```json
{
  "model": "sonnet",
  "agent": "agent-name",
  "alwaysThinkingEnabled": true
}
```

### Attribution (Commits & PRs)
```json
{
  "attribution": {
    "commit": "Custom commit trailer text",
    "pr": "Custom PR description text"
  }
}
```
Set `commit` or `pr` to empty string `""` to hide that attribution.

### MCP Server Management
```json
{
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["server1", "server2"],
  "disabledMcpjsonServers": ["blocked-server"]
}
```

### Plugins
```json
{
  "enabledPlugins": {
    "formatter@anthropic-tools": true
  }
}
```

### Other Settings
- `language`: Preferred response language
- `cleanupPeriodDays`: Days to keep transcripts (default: 30; 0 disables persistence)
- `respectGitignore`: Whether to respect .gitignore (default: true)
- `spinnerTipsEnabled`: Show tips in spinner
- `spinnerVerbs`: Customize spinner verbs (`{ "mode": "append" | "replace", "verbs": [...] }`)
- `spinnerTipsOverride`: Override spinner tips
- `syntaxHighlightingDisabled`: Disable diff highlighting
- `voiceEnabled`: Enable voice mode
- `fastMode`: Enable fast mode
- `effortLevel`: "low" | "medium" | "high"
- `promptSuggestionEnabled`: Enable prompt suggestions
- `defaultView`: "chat" | "transcript"
- `prefersReducedMotion`: Reduce animations
- `autoMemoryEnabled`: Enable auto-memory
- `plansDirectory`: Custom directory for plan files

## Hooks Configuration

### Hook Structure
```json
{
  "hooks": {
    "EVENT_NAME": [
      {
        "matcher": "ToolName|OtherTool",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here",
            "timeout": 60,
            "statusMessage": "Running..."
          }
        ]
      }
    ]
  }
}
```

### Hook Events

| Event | Matcher | Purpose |
|-------|---------|---------|
| PermissionRequest | Tool name | Run before permission prompt |
| PreToolUse | Tool name | Run before tool, can block |
| PostToolUse | Tool name | Run after successful tool |
| PostToolUseFailure | Tool name | Run after tool fails |
| Notification | Notification type | Run on notifications |
| Stop | — | Run when Claude stops |
| PreCompact | "manual"/"auto" | Before compaction |
| PostCompact | "manual"/"auto" | After compaction |
| UserPromptSubmit | — | When user submits |
| SessionStart | — | When session starts |

**Common tool matchers:** `Bash`, `Write`, `Edit`, `Read`, `Glob`, `Grep`

### Hook Types

**1. Command Hook** — Runs a shell command:
```json
{ "type": "command", "command": "prettier --write $FILE", "timeout": 30 }
```

**2. Prompt Hook** — Evaluates a condition with LLM:
```json
{ "type": "prompt", "prompt": "Is this safe? $ARGUMENTS" }
```
Only available for tool events: PreToolUse, PostToolUse, PermissionRequest.

**3. Agent Hook** — Runs an agent with tools:
```json
{ "type": "agent", "prompt": "Verify tests pass: $ARGUMENTS" }
```
Only available for tool events: PreToolUse, PostToolUse, PermissionRequest.

### Hook Input (stdin JSON)
```json
{
  "session_id": "abc123",
  "tool_name": "Write",
  "tool_input": { "file_path": "/path/to/file.txt", "content": "..." },
  "tool_response": { "success": true }
}
```

### Hook JSON Output
```json
{
  "systemMessage": "Warning shown to user in UI",
  "continue": false,
  "stopReason": "Message shown when blocking",
  "suppressOutput": false,
  "decision": "block",
  "reason": "Explanation for decision",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Context injected back to model"
  }
}
```

### Common Hook Patterns

**Auto-format after writes:**
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_response.filePath // .tool_input.file_path' | { read -r f; prettier --write \"$f\"; } 2>/dev/null || true"
      }]
    }]
  }
}
```

**Log all bash commands:**
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.command' >> ~/.claude/bash-log.txt"
      }]
    }]
  }
}
```

**Run tests after code changes:**
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.file_path // .tool_response.filePath' | grep -E '\\.(ts|js)$' && npm test || true"
      }]
    }]
  }
}
```

## Full Settings Schema (Top-Level Keys)

```
apiKeyHelper, awsCredentialExport, awsAuthRefresh, gcpAuthRefresh,
fileSuggestion, respectGitignore, cleanupPeriodDays, env, attribution,
includeGitInstructions, permissions, model, availableModels, modelOverrides,
enableAllProjectMcpServers, enabledMcpjsonServers, disabledMcpjsonServers,
allowedMcpServers, deniedMcpServers, hooks, worktree, disableAllHooks,
allowManagedHooksOnly, allowedHttpHookUrls, httpHookAllowedEnvVars,
allowManagedPermissionRulesOnly, allowManagedMcpServersOnly, statusLine,
enabledPlugins, extraKnownMarketplaces, strictKnownMarketplaces,
blockedMarketplaces, forceLoginMethod, forceLoginOrgUUID, otelHeadersHelper,
outputStyle, language, skipWebFetchPreflight, sandbox, feedbackSurveyRate,
spinnerTipsEnabled, spinnerVerbs, spinnerTipsOverride,
syntaxHighlightingDisabled, terminalTitleFromRename, alwaysThinkingEnabled,
effortLevel, fastMode, fastModePerSessionOptIn, promptSuggestionEnabled,
agent, companyAnnouncements, pluginConfigs, remote, autoUpdatesChannel,
minimumVersion, plansDirectory, voiceEnabled, defaultView,
prefersReducedMotion, autoMemoryEnabled, autoMemoryDirectory,
showThinkingSummaries, skipDangerousModePermissionPrompt,
skipAutoPermissionPrompt, autoMode, disableAutoMode, sshConfigs,
claudeMdExcludes, pluginTrustMessage
```
