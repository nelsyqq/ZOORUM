@echo off
chcp 65001 >nul
title ЗООРУМ — запуск сайта
cd /d "%~dp0"

echo.
echo  ========================================
echo    ЗООРУМ — зоомагазин
echo  ========================================
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ОШИБКА] Node.js не установлен!
    echo.
    echo Скачайте и установите Node.js:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js: 
node --version
echo.

if not exist "node_modules\" (
    echo Устанавливаю зависимости...
    call npm install
    if %errorlevel% neq 0 (
        echo [ОШИБКА] Не удалось установить зависимости.
        pause
        exit /b 1
    )
    echo.
)

echo Запускаю сайт...
echo.
echo  ВАЖНО: не открывайте index.html напрямую!
echo  Сайт откроется в браузере автоматически.
echo  Адрес: http://localhost:5173
echo.
echo  Чтобы остановить — закройте это окно или нажмите Ctrl+C
echo.

call npm run dev

pause
