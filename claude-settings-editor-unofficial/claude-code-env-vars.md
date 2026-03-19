# Claude Code CLI Environment Variables Reference

Source: code.claude.com/docs/en/env-vars (fetched 2026-03-19)

## Authentication & API

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 1 | `ANTHROPIC_API_KEY` | API key string | API key sent as X-Api-Key header, overrides subscription auth |
| 2 | `ANTHROPIC_AUTH_TOKEN` | Token string | Custom Authorization header (auto-prefixed with Bearer) |
| 3 | `ANTHROPIC_BASE_URL` | URL | Override API endpoint for proxy/gateway |
| 4 | `ANTHROPIC_CUSTOM_HEADERS` | `Name: Value` (newline-separated) | Custom headers added to requests |
| 5 | `ANTHROPIC_LOG` | `debug` | Log all API requests |
| 6 | `ANTHROPIC_BETAS` | Comma-separated beta flags | Custom beta feature flags header |

## Model Configuration

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 7 | `ANTHROPIC_MODEL` | Model ID or alias | Primary model to use |
| 8 | `ANTHROPIC_DEFAULT_OPUS_MODEL` | Provider-specific model ID | Pin opus alias to specific version |
| 9 | `ANTHROPIC_DEFAULT_SONNET_MODEL` | Provider-specific model ID | Pin sonnet alias to specific version |
| 10 | `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Provider-specific model ID | Pin haiku alias (also controls background tasks) |
| 11 | `ANTHROPIC_SMALL_FAST_MODEL` | Model ID | **[DEPRECATED]** Use ANTHROPIC_DEFAULT_HAIKU_MODEL |
| 12 | `ANTHROPIC_CUSTOM_MODEL_OPTION` | Model ID | Add custom entry in /model picker |
| 13 | `ANTHROPIC_CUSTOM_MODEL_OPTION_NAME` | Display name string | Display name for custom model entry |
| 14 | `ANTHROPIC_CUSTOM_MODEL_OPTION_DESCRIPTION` | Description string | Display description for custom model entry |
| 15 | `CLAUDE_CODE_SUBAGENT_MODEL` | Model ID | Override model for subagents |
| 16 | `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | Integer (tokens) | Max output tokens per request |
| 17 | `CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS` | Integer (tokens) | Override file read token limit |
| 18 | `MAX_THINKING_TOKENS` | Integer (0 = disable) | Extended thinking token budget |
| 19 | `CLAUDE_CODE_EFFORT_LEVEL` | `low`, `medium`, `high`, `max`, `auto` | Effort level (max is Opus 4.6 only) |
| 20 | `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING` | `1` | Disable adaptive reasoning, use fixed MAX_THINKING_TOKENS |
| 21 | `CLAUDE_CODE_DISABLE_1M_CONTEXT` | `1` | Disable 1M context window support |

## Amazon Bedrock

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 22 | `CLAUDE_CODE_USE_BEDROCK` | `1` | Enable Bedrock integration |
| 23 | `AWS_REGION` | AWS region string | Required Bedrock region |
| 24 | `AWS_ACCESS_KEY_ID` | Key string | AWS access key for auth |
| 25 | `AWS_SECRET_ACCESS_KEY` | Secret string | AWS secret key for auth |
| 26 | `AWS_SESSION_TOKEN` | Token string | Temporary session token |
| 27 | `AWS_PROFILE` | Profile name | AWS SSO profile |
| 28 | `AWS_BEARER_TOKEN_BEDROCK` | API key string | Bedrock API key |
| 29 | `ANTHROPIC_BEDROCK_BASE_URL` | URL | Override Bedrock endpoint |
| 30 | `ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION` | AWS region | Override region for Haiku on Bedrock |
| 31 | `CLAUDE_CODE_SKIP_BEDROCK_AUTH` | `1` | Skip AWS auth (gateway handles it) |

## Google Vertex AI

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 32 | `CLAUDE_CODE_USE_VERTEX` | `1` | Enable Vertex AI |
| 33 | `CLOUD_ML_REGION` | GCP region | Vertex AI region |
| 34 | `ANTHROPIC_VERTEX_PROJECT_ID` | GCP project ID | Project for Vertex AI |
| 35 | `ANTHROPIC_VERTEX_BASE_URL` | URL | Override Vertex endpoint |
| 36 | `CLAUDE_CODE_SKIP_VERTEX_AUTH` | `1` | Skip GCP auth |
| 37 | `GCLOUD_PROJECT` | GCP project ID | Alt project override |
| 38 | `GOOGLE_CLOUD_PROJECT` | GCP project ID | Alt project override |
| 39 | `GOOGLE_APPLICATION_CREDENTIALS` | File path | Service account JSON |
| 40 | `VERTEX_REGION_CLAUDE_3_5_HAIKU` | GCP region | Per-model region override |
| 41 | `VERTEX_REGION_CLAUDE_3_5_SONNET` | GCP region | Per-model region override |
| 42 | `VERTEX_REGION_CLAUDE_3_7_SONNET` | GCP region | Per-model region override |
| 43 | `VERTEX_REGION_CLAUDE_4_0_OPUS` | GCP region | Per-model region override |
| 44 | `VERTEX_REGION_CLAUDE_4_0_SONNET` | GCP region | Per-model region override |
| 45 | `VERTEX_REGION_CLAUDE_4_1_OPUS` | GCP region | Per-model region override |

## Microsoft Foundry

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 46 | `CLAUDE_CODE_USE_FOUNDRY` | `1` | Enable Foundry |
| 47 | `ANTHROPIC_FOUNDRY_RESOURCE` | Resource name | Foundry resource (required if no BASE_URL) |
| 48 | `ANTHROPIC_FOUNDRY_BASE_URL` | URL | Full Foundry URL (alt to resource) |
| 49 | `ANTHROPIC_FOUNDRY_API_KEY` | API key | Foundry API key |
| 50 | `CLAUDE_CODE_SKIP_FOUNDRY_AUTH` | `1` | Skip Azure auth |

## Network & Proxy

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 51 | `HTTP_PROXY` | URL | HTTP proxy server |
| 52 | `HTTPS_PROXY` | URL | HTTPS proxy server |
| 53 | `NO_PROXY` | Comma-separated domains/IPs | Bypass proxy for these |
| 54 | `CLAUDE_CODE_PROXY_RESOLVES_HOSTS` | `true` | Let proxy do DNS resolution |
| 55 | `NODE_EXTRA_CA_CERTS` | File path | CA certificate bundle (corporate CAs) |

## mTLS (Mutual TLS)

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 56 | `CLAUDE_CODE_CLIENT_CERT` | File path | Client certificate |
| 57 | `CLAUDE_CODE_CLIENT_KEY` | File path | Client private key |
| 58 | `CLAUDE_CODE_CLIENT_KEY_PASSPHRASE` | Passphrase string | Passphrase for encrypted key |

## Bash Tool

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 59 | `BASH_DEFAULT_TIMEOUT_MS` | Integer (ms) | Default bash command timeout |
| 60 | `BASH_MAX_TIMEOUT_MS` | Integer (ms) | Max timeout model can set |
| 61 | `BASH_MAX_OUTPUT_LENGTH` | Integer (chars) | Max chars before truncation |
| 62 | `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` | truthy | Restore cwd after each command |
| 63 | `CLAUDE_BASH_NO_LOGIN` | `1` or `true` | Skip login shell for BashTool |
| 64 | `CLAUDE_CODE_SHELL` | Shell name/path | Override shell detection |
| 65 | `CLAUDE_CODE_SHELL_PREFIX` | Command path | Wrap all bash commands (logging/auditing) |
| 66 | `CLAUDE_CODE_GIT_BASH_PATH` | File path | Git Bash executable path (Windows) |

## MCP (Model Context Protocol)

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 67 | `MCP_TIMEOUT` | Integer (ms) | MCP server startup timeout |
| 68 | `MCP_TOOL_TIMEOUT` | Integer (ms) | MCP tool execution timeout |
| 69 | `MAX_MCP_OUTPUT_TOKENS` | Integer (default 25000) | Max tokens in MCP responses |
| 70 | `MCP_CLIENT_SECRET` | Secret string | OAuth client secret for MCP servers |
| 71 | `MCP_OAUTH_CALLBACK_PORT` | Integer (port) | Fixed OAuth redirect port |
| 72 | `ENABLE_CLAUDEAI_MCP_SERVERS` | `false` to disable | Toggle claude.ai MCP servers |
| 73 | `ENABLE_TOOL_SEARCH` | `true`, `false`, `auto`, `auto:N` | MCP tool search behavior |

## Prompt Caching

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 74 | `DISABLE_PROMPT_CACHING` | `1` | Disable for all models |
| 75 | `DISABLE_PROMPT_CACHING_HAIKU` | `1` | Disable for Haiku only |
| 76 | `DISABLE_PROMPT_CACHING_SONNET` | `1` | Disable for Sonnet only |
| 77 | `DISABLE_PROMPT_CACHING_OPUS` | `1` | Disable for Opus only |

## Context & Compaction

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 78 | `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | `1`-`100` | Context % that triggers compaction (default ~95%) |
| 79 | `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | Integer (tokens) | Override context capacity for compaction |

## Memory & Initialization

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 80 | `CLAUDE_CODE_DISABLE_AUTO_MEMORY` | `1` off, `0` force on | Control auto memory |
| 81 | `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD` | `1` | Load CLAUDE.md from --add-dir dirs |
| 82 | `CLAUDE_CODE_NEW_INIT` | `true` | Interactive /init setup flow |
| 83 | `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS` | `1` | Remove git instructions from prompt |
| 84 | `CLAUDE_CODE_SIMPLE` | `1` | Minimal mode (Bash + Read + Edit only) |

## Disable Flags

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 85 | `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | truthy | Disables autoupdate+feedback+errors+telemetry |
| 86 | `DISABLE_AUTOUPDATER` | `1` | No auto updates |
| 87 | `DISABLE_FEEDBACK_COMMAND` | `1` | No /feedback (alias: DISABLE_BUG_COMMAND) |
| 88 | `DISABLE_ERROR_REPORTING` | `1` | No Sentry |
| 89 | `DISABLE_TELEMETRY` | `1` | No Statsig telemetry |
| 90 | `DISABLE_COST_WARNINGS` | `1` | No cost warning messages |
| 91 | `DISABLE_INSTALLATION_CHECKS` | `1` | No install warnings |
| 92 | `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | `1` | No background tasks or Ctrl+B |
| 93 | `CLAUDE_CODE_DISABLE_CRON` | `1` | No /loop or cron scheduling |
| 94 | `CLAUDE_CODE_DISABLE_TERMINAL_TITLE` | `1` | No terminal title updates |
| 95 | `CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY` | `1` | No quality surveys |
| 96 | `CLAUDE_CODE_DISABLE_FAST_MODE` | `1` | No fast mode |
| 97 | `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` | `1` | Strip beta headers/fields from API |

## Feature Flags & Experimental

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 98 | `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | `1` | Enable agent teams |
| 99 | `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION` | `false` | Disable prompt suggestions |
| 100 | `CLAUDE_CODE_ENABLE_TASKS` | `true` / `false` | Toggle task system in -p mode |
| 101 | `CLAUDE_CODE_SKIP_FAST_MODE_NETWORK_ERRORS` | `1` | Allow fast mode on network error |
| 102 | `IS_DEMO` | `true` | Hide email/org, skip onboarding |

## Telemetry & Monitoring

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 103 | `CLAUDE_CODE_ENABLE_TELEMETRY` | `1` | Enable OpenTelemetry |
| 104 | `OTEL_METRICS_EXPORTER` | e.g. `otlp` | OTel metrics exporter |
| 105 | `CLAUDE_CODE_OTEL_HEADERS_HELPER_DEBOUNCE_MS` | Integer (ms, default 1740000) | OTel header refresh interval |

## SDK & Automation

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 106 | `CLAUDE_CODE_EXIT_AFTER_STOP_DELAY` | Integer (ms) | Auto-exit after idle duration |
| 107 | `CLAUDE_CODE_ACCOUNT_UUID` | UUID | Account UUID for SDK callers |
| 108 | `CLAUDE_CODE_USER_EMAIL` | Email | User email for SDK callers |
| 109 | `CLAUDE_CODE_ORGANIZATION_UUID` | UUID | Org UUID for SDK callers |
| 110 | `CLAUDE_CODE_TASK_LIST_ID` | ID string | Share task list across instances |
| 111 | `CLAUDE_CODE_API_KEY_HELPER_TTL_MS` | Integer (ms) | apiKeyHelper credential refresh interval |

## Hooks (Runtime Context)

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 112 | `CLAUDE_PROJECT_DIR` | Absolute path | Project root (available in hooks & bash) |
| 113 | `CLAUDE_ENV_FILE` | File path | SessionStart hooks write exports here |
| 114 | `CLAUDE_CODE_REMOTE` | `true` or unset | Indicates remote web environment |
| 115 | `CLAUDE_PLUGIN_ROOT` | Absolute path | Plugin installation directory |
| 116 | `CLAUDE_PLUGIN_DATA` | Absolute path | Plugin persistent data directory |
| 117 | `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS` | Integer (ms, default 1500) | SessionEnd hook timeout |

## Agent Teams (Read-only)

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 118 | `CLAUDE_CODE_TEAM_NAME` | Name string | Team name (auto-set on teammates) |
| 119 | `CLAUDE_CODE_PLAN_MODE_REQUIRED` | `true` | Teammate requires plan approval (auto-set) |

## Miscellaneous

| # | Variable | Values | Effect |
|---|----------|--------|--------|
| 120 | `CLAUDECODE` | `1` (auto-set) | Detect if running inside Claude Code shell |
| 121 | `CLAUDE_CONFIG_DIR` | Directory path | Custom config/data directory |
| 122 | `CLAUDE_CODE_TMPDIR` | Directory path | Override temp directory |
| 123 | `CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL` | truthy | Skip IDE extension auto-install |
| 124 | `CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS` | Integer (ms, default 120000) | Plugin git operation timeout |
| 125 | `CLAUDE_CODE_PLUGIN_SEED_DIR` | Path(s) (`:` Unix, `;` Windows) | Pre-populated plugin seed dirs |
| 126 | `CLAUDE_CODE_PLUGIN_CACHE_DIR` | Directory path | Plugin cache directory |
| 127 | `USE_BUILTIN_RIPGREP` | `0` to opt out | Use system rg instead of bundled |
| 128 | `SLASH_COMMAND_TOOL_CHAR_BUDGET` | Integer (chars) | Skill metadata character budget |
| 129 | `FORCE_AUTOUPDATE_PLUGINS` | `true` | Force plugin updates when autoupdater disabled |
| 130 | `BROWSER` | Executable path | Browser for auth URLs (WSL/Linux) |
| 131 | `XDG_CONFIG_HOME` | Directory path | XDG config directory support |
