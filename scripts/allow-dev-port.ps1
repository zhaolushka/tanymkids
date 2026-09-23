# Запусти PowerShell «От имени администратора», затем:
#   cd C:\Users\User\Projects\tanymkids
#   .\scripts\allow-dev-port.ps1

$ruleName = "TanymKids dev 3000"
$existing = netsh advfirewall firewall show rule name="$ruleName" 2>$null
if ($LASTEXITCODE -eq 0) {
  Write-Host "Правило '$ruleName' уже есть."
} else {
  netsh advfirewall firewall add rule name="$ruleName" dir=in action=allow protocol=TCP localport=3000
  Write-Host "Готово: порт 3000 открыт для входящих в локальной сети."
}
