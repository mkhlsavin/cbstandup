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
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Освобождаем порт $port..."
        Stop-Process -Id $process.OwningProcess -Force
    }
}

# Установка зависимостей, если они отсутствуют
if (-not (Test-Path "node_modules")) {
    Write-Host "Установка зависимостей..."
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

# Запуск сервера
Write-Host "Запуск сервера..."
Start-Process powershell -ArgumentList "cd server; npm run dev"

# Запуск веб-приложения
Write-Host "Запуск веб-приложения..."
Start-Process powershell -ArgumentList "npm start"

Write-Host "Приложение запущено!"
Write-Host "Сервер: http://localhost:3001"
Write-Host "Веб-приложение: http://localhost:3002"
Write-Host "Нажмите Enter для остановки..."
Read-Host 