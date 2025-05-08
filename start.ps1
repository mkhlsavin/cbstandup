# Функция для проверки, используется ли порт
function Test-PortInUse {
    param($port)
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    return $connections -ne $null
}

# Функция для освобождения порта
function Free-Port {
    param($port)
    Write-Host "Port $port is in use. Attempting to free it..."
    try {
        $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | 
                  Select-Object -ExpandProperty OwningProcess | 
                  Get-Process -ErrorAction SilentlyContinue
        
        if ($process) {
            Write-Host "Stopping process using port $port..."
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
        }
    } catch {
        Write-Host "Could not free port $port. Please try to free it manually."
    }
}

# Остановка всех процессов node
Write-Host "Stopping all Node.js processes..."
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Проверяем и освобождаем порты
$ports = @(3001, 3002)
foreach ($port in $ports) {
    if (Test-PortInUse $port) {
        Free-Port $port
    }
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..."
    npm install
}

# Install server dependencies if needed
if (-not (Test-Path "server/node_modules")) {
    Write-Host "Installing server dependencies..."
    Set-Location server
    npm install
    Set-Location ..
}

# Add PostgreSQL to PATH
$env:Path = "C:\Program Files\PostgreSQL\17\bin;$env:Path"

# Запуск сервера в первом окне PowerShell
Write-Host "Starting server..."
$serverWindow = Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD\server'; `$env:NODE_ENV='development'; `$env:PORT='3001'; npm run dev" -PassThru

# Ждем 10 секунд, чтобы сервер успел запуститься
Write-Host "Waiting for server to start..."
Start-Sleep -Seconds 10

# Запуск веб-приложения во втором окне PowerShell
Write-Host "Starting web application..."
$webWindow = Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD'; `$env:PORT='3002'; npm run start:web" -PassThru

Write-Host "Applications are starting in separate windows..."
Write-Host "Server will be available at: http://localhost:3001"
Write-Host "Web application will be available at: http://localhost:3002"
Write-Host "Press Enter to stop all processes..."

# Ждем нажатия Enter для завершения
$null = Read-Host

# Cleanup
Write-Host "Stopping all processes..."
if ($null -ne $serverWindow) { Stop-Process -Id $serverWindow.Id -Force }
if ($null -ne $webWindow) { Stop-Process -Id $webWindow.Id -Force }
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "All processes stopped" 