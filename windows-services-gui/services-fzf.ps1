# Windows Services fzf manager

# Self-elevate if not admin
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Start-Process wt -Verb RunAs -ArgumentList "pwsh -ExecutionPolicy Bypass -NoExit -File `"$PSCommandPath`""
    exit
}

function Get-ServiceList {
    "Name|Display Name|Description"
    Get-CimInstance Win32_Service | ForEach-Object {
        $desc = if ($_.Description) { $_.Description } else { "" }
        "$($_.Name)|$($_.DisplayName)|$desc"
    }
}

# Stage 1: pick a service
while ($true) {
    $previewScript = Join-Path $PSScriptRoot "preview-service.ps1"
    $selection = Get-ServiceList | column -t -s '|' | fzf --header-lines=1 --preview="pwsh -NoProfile -File `"$previewScript`" {1}" --preview-window=up:40%:wrap --bind "shift-up:preview-up,shift-down:preview-down,ctrl-f:preview-page-down,ctrl-b:preview-page-up"
    if (-not $selection) { break }

    $serviceName = ($selection -split "\s{2,}")[0].Trim()

    # Stage 2: pick an action
    $svc = Get-Service -Name $serviceName
    $actions = @("Properties")
    switch ($svc.Status) {
        "Running" { $actions = @("Stop", "Restart", "Pause", "Properties") }
        "Stopped" { $actions = @("Start", "Properties") }
        "Paused"  { $actions = @("Resume", "Stop", "Properties") }
    }

    $action = $actions | fzf --header="Action for: $($svc.DisplayName) [$($svc.Status)]"
    if (-not $action) { continue }

    switch ($action) {
        "Start"   { Start-Service -Name $serviceName; Write-Host "Started $serviceName" }
        "Stop"    { Stop-Service -Name $serviceName -Force; Write-Host "Stopped $serviceName" }
        "Restart" { Restart-Service -Name $serviceName -Force; Write-Host "Restarted $serviceName" }
        "Pause"   { Suspend-Service -Name $serviceName; Write-Host "Paused $serviceName" }
        "Resume"  { Resume-Service -Name $serviceName; Write-Host "Resumed $serviceName" }
        "Properties" {
            $displayName = $svc.DisplayName
            powershell.exe -Command "
                `$mmc = New-Object -ComObject MMC20.Application;
                `$mmc.Load('services.msc');
                `$view = `$mmc.Document.ActiveView;
                `$target = `$view.ListItems | Where-Object { `$_.Name -eq '$displayName' };
                if (`$target) { `$view.Select(`$target); `$view.DisplaySelectionPropertySheet() }
            "
        }
    }

    Start-Sleep -Seconds 1
}
