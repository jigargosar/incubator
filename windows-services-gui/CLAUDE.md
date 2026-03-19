# windows-services-gui

PowerShell + fzf interactive Windows service manager with fuzzy search.

## How to Run

This is an interactive fzf script — it cannot run inside Claude's Bash tool.
You must launch it in a separate terminal window using `wt`.

First, check current privilege level:

```bash
pwsh -Command "([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)"
```

If already admin:

```bash
wt pwsh -NoProfile -File C:/Users/jigar/projects/incubator/windows-services-gui/services-fzf.ps1
```

If not admin, the script self-elevates via UAC:

```bash
wt pwsh -File C:/Users/jigar/projects/incubator/windows-services-gui/services-fzf.ps1
```

## Stack

- pwsh 7 (not powershell.exe 5.1)
- fzf for fuzzy search and action menus
- wt (Windows Terminal) for elevated sessions

## Files

- `services-fzf.ps1` — main script (working)
- `preview-service.ps1` — fzf preview helper (created, not yet wired up)
- `explore-properties.ps1` — research spike (keep for reference, not part of the tool)
- `plan.md` — roadmap and next steps

## MMC COM API Reference

Discovered via `explore-properties.ps1`. Requires elevation. Only works in powershell.exe 5.1 (not pwsh 7).

### Loading

```powershell
$mmc = New-Object -ComObject MMC20.Application
$mmc.Load("services.msc")
$view = $mmc.Document.ActiveView
```

### MMC Application (`MMC20.Application`)

- `Load(string)` — load a snap-in (.msc file)
- `Show()` / `Hide()` / `Quit()`
- `Document` — returns Document object
- `Frame` — returns Frame object

### Document

- `ActiveView` — returns the current View
- `RootNode` — root of the scope tree
- `ScopeNamespace` — scope namespace object
- `SnapIns` — loaded snap-ins

### ActiveView

Key methods:

- `Select(Node)` — select a node in the list
- `DisplaySelectionPropertySheet()` — opens native properties dialog for selected item
- `ExecuteSelectionMenuItem(string)` — execute a context menu action by LanguageIndependentName
- `SelectAll()` / `Deselect(Node)`
- `ExportList(string, ExportListOptions)` — export list to file
- `RefreshSelection()` / `RefreshScopeNode(Variant)`

Key properties:

- `ListItems` — all items in the result pane (the services list)
- `Selection` — currently selected items
- `SelectionContextMenu` — context menu for selection
- `Columns` — column definitions
- `ActiveScopeNode` — current scope node

### Node (ListItem)

- `Name` — display name (e.g. "Windows Update")
- `Nodetype` — GUID
- `Bookmark` — unique identifier
- `Property(string)` — get a named property
- `IsScopeNode()` — whether this is a scope node

### ContextMenu Item

- `DisplayName` — localized name with accelerator key (e.g. "&Start", "St&op", "P&roperties")
- `LanguageIndependentName` — stable name for scripting (e.g. "Start", "Stop", "_PROPERTIES")
- `Enabled` — 1 if action is available, 0 if not
- `Execute()` — invoke the action
- `Path` / `LanguageIndependentPath`

### Context Menu Verbs for Services

Items returned by `$view.SelectionContextMenu` (13 items, with duplicates):

1. Start (LanguageIndependentName: "Start")
2. Stop ("Stop")
3. Pause ("Pause")
4. Resume ("Resume")
5. Restart ("Restart")
6. Start (duplicate)
7. Stop (duplicate)
8. Pause (duplicate)
9. Resume (duplicate)
10. Restart (duplicate)
11. Refresh ("_REFRESH")
12. Properties ("_PROPERTIES")
13. Help ("_CONTEXTHELP")

Items 1-5 and 6-10 are duplicates — likely from two menu sources merging.

## Gotchas

- MMC COM (`MMC20.Application`) requires elevation AND only works in powershell.exe 5.1 — pwsh 7 fails with COM class factory permission error
- `services-fzf.ps1` currently shells out to `powershell.exe -Command "..."` for the Properties action only
- fzf `--preview` with `--delimiter` and `{1}` field extraction is tricky on Windows — the delimiter/field combo needs testing
- `Get-Service` throws PermissionDenied for 2-3 protected services (MDCoreSvc, WaaSMedicSvc) even when elevated — suppressed with `-ErrorAction SilentlyContinue 2>$null`
- Self-elevation uses `Start-Process wt -Verb RunAs` — this opens a new wt window (user won't see output in original terminal)
