# Windows Services GUI — Plan

## Problem

Windows services.msc has no search. Managing services requires scrolling through 300+ items to find what you need.

## Solution

PowerShell + fzf interactive service manager. Two-stage flow:

1. Fuzzy search all services → select one
2. Show available actions for that service → select and execute

## Proven Building Blocks

All verified via `explore-properties.ps1`:

1. `MMC20.Application` COM object (requires elevation)
2. `$mmc.Load("services.msc")` loads the services snap-in
3. `$view.ListItems` returns all services by display name
4. `$view.Select($node)` selects a service
5. `$view.SelectionContextMenu` returns verbs with `DisplayName`, `LanguageIndependentName`, `Enabled` state
6. `$item.Execute()` invokes a verb (Start, Stop, Restart, etc.)
7. `$view.DisplaySelectionPropertySheet()` opens the native properties dialog

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

## Preview Pane

fzf's `--preview` flag can show service details while browsing:

1. Service name, display name, status
2. Startup type (Auto/Manual/Disabled)
3. Description
4. Dependencies

Data sources: `sc qc <name>`, `sc query <name>`, `sc qdescription <name>`

## Implementation

Single PowerShell script (`services-fzf.ps1`):

1. Launch elevated (MMC COM requires admin)
2. Load services.msc via COM
3. Pipe `ListItems` names into fzf with `--preview` showing `sc qc` + `sc query`
4. On selection, get `SelectionContextMenu` verbs
5. Filter to enabled verbs only
6. Pipe verb names into second fzf
7. On verb selection, call `Execute()` or `DisplaySelectionPropertySheet()` for Properties

## Open Questions

1. The context menu returns duplicate verbs (1-5 and 6-10 are identical) — need to deduplicate
2. Should the script loop back to service list after executing an action?
3. Is `sc query` fast enough for fzf preview, or should we use `Get-Service` instead?
4. Can we avoid MMC COM entirely and use `Get-Service` + `Start-Service`/`Stop-Service` for everything except Properties?
