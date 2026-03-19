param($serviceName)

$svc = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
if (-not $svc) { Write-Output "Service not found: $serviceName"; exit }

Write-Output $svc.DisplayName
Write-Output ""
Write-Output "Status:  $($svc.Status)"
Write-Output "Startup: $($svc.StartType)"
Write-Output ""

sc.exe qc $serviceName 2>$null
Write-Output ""
sc.exe query $serviceName 2>$null
Write-Output ""
sc.exe qdescription $serviceName 2>$null
