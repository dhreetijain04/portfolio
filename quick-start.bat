@echo off
title Portfolio Dev - Quick Start
echo 🚀 Quick Start Portfolio...

cd /d "%~dp0"

REM Start servers and open browser
start "Dev Servers" cmd /c "npm run dev"

REM Wait for servers to start
timeout /t 8 /nobreak >nul

REM Open browser to likely frontend port
start http://localhost:5173

echo ✅ Portfolio started! Check your browser.
timeout /t 3 /nobreak >nul