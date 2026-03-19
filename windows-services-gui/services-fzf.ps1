# Windows Services fzf manager

# Self-elevate if not admin
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Start-Process wt -Verb RunAs -ArgumentList "pwsh -ExecutionPolicy Bypass -NoExit -File `"$PSCommandPath`""
    exit
}

function Get-ServiceList {
    Get-Service -ErrorAction SilentlyContinue 2>$null | ForEach-Object {
        $status = $_.Status.ToString().PadRight(10)
        $startType = $_.StartType.ToString().PadRight(10)
        "$($_.Name)  |  $status  |  $startType  |  $($_.DisplayName)"
    }
}

# Stage 1: pick a service
while ($true) {
    $selection = Get-ServiceList | fzf --header="Name  |  Status  |  Startup  |  Display Name"
    if (-not $selection) { break }

    $serviceName = ($selection -split "\s+\|\s+")[0].Trim()

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
