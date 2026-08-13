@echo off
title WiFi Chat App
color 0A

echo ==========================================
echo          WIFI CHAT APP
echo ==========================================
echo.
echo Starting server...
echo.

REM Use the folder where this BAT file is located
cd /d "%~dp0"

REM Check Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not added to PATH.
    echo.
    pause
    exit /b 1
)

REM Check server.js
if not exist "server.js" (
    echo [ERROR] server.js not found!
    echo.
    echo Current folder:
    echo %CD%
    echo.
    pause
    exit /b 1
)

REM Install dependencies if package.json exists
if exist "package.json" (
    echo Installing required packages...
    echo.
    call npm install

    if errorlevel 1 (
        echo.
        echo [ERROR] npm install failed!
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ==========================================
echo       SERVER STARTING
echo ==========================================
echo.
echo Local:
echo http://localhost:3000
echo.
echo For phone:
echo Connect phone and PC to the same WiFi.
echo Find your IPv4 address using ipconfig.
echo Then open:
echo http://YOUR-IP:3000
echo.
echo ==========================================
echo.
echo Press CTRL+C to stop the server.
echo.

node server.js

echo.
echo ==========================================
echo       SERVER STOPPED
echo ==========================================
echo.
echo Exit Code: %ERRORLEVEL%
echo.

pause
