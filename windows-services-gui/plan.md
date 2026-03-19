# Windows Services GUI — Plan

See `CLAUDE.md` for reference material (how to run, API surface, gotchas).

## Problem

Windows services.msc has no search. Managing services requires scrolling through 300+ items to find what you need.

## Solution

PowerShell + fzf interactive service manager. Two-stage flow:

1. Fuzzy search all services → select one
2. Show available actions for that service → select and execute

## Flow

```
┌─────────────────────────────────────┐
│  fzf: fuzzy search services         │
│                                     │
│  > windows up                       │
│    Windows Update                   │
│    Windows Update Medic Service     │
│    Windows Push Notifications       │
│                                     │
└─────────────────────────────────────┘
              │ select
              ▼
┌─────────────────────────────────────┐
│  fzf: pick action for               │
│        "Windows Update"             │
│                                     │
│    Start        (enabled)           │
│    Stop         (disabled)          │
│    Pause        (disabled)          │
│    Resume       (disabled)          │
│    Restart      (disabled)          │
│    Properties   (enabled)           │
│                                     │
└─────────────────────────────────────┘
              │ select
              ▼
         Execute action
```

## Next Steps

1. **fzf preview pane** — show sc qc + sc query + sc qdescription in right panel
   - `preview-service.ps1` exists, needs wiring into fzf --preview
   - Delimiter/field extraction is tricky on Windows — see CLAUDE.md gotchas
2. Alias/shortcut — make it launchable as `svc`
3. Dedup context menu verbs (items 1-5 and 6-10 are identical)
4. Error handling for protected services
5. Loop refinement — re-select same service or back to full list after action

## Open Questions

1. Should the script loop back to service list after executing an action?
2. Is `sc query` fast enough for fzf preview, or should we use `Get-Service` instead?
3. Can we avoid MMC COM entirely and use `Get-Service` + `Start-Service`/`Stop-Service` for everything except Properties?
