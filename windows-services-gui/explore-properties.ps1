$serviceName = "Windows Update"

Start-Process powershell -Verb RunAs -ArgumentList "-Command `"
  `$mmc = New-Object -ComObject MMC20.Application;
  `$mmc.Load('services.msc');
  `$view = `$mmc.Document.ActiveView;
  `$target = `$view.ListItems | Where-Object { `$_.Name -eq '$serviceName' };
  if (`$target) {
    Write-Host 'Found: ' `$target.Name;
    `$view.Select(`$target);
    Write-Host '=== SelectionContextMenu members ===' ;
    `$view.SelectionContextMenu | Get-Member | Out-String | Write-Host;
    Write-Host '=== Context Menu Items ===' ;
    `$menu = `$view.SelectionContextMenu;
    for (`$i = 1; `$i -le `$menu.Count; `$i++) {
      `$item = `$menu.Item(`$i);
      Write-Host `$i ': ' `$item.DisplayName ' | ' `$item.LanguageIndependentName ' | Enabled:' `$item.Enabled;
    };
  } else {
    Write-Host 'Service not found: $serviceName';
  };
  Read-Host 'Press Enter to exit'
`""
