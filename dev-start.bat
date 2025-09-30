@echo off
title Portfolio Dev Environment
echo 🚀 Starting Portfolio Development Environment...
echo.

cd /d "%~dp0"

echo 🎯 Starting both servers...
echo 🔧 Backend will run on http://localhost:5000
echo 🎨 Frontend will run on http://localhost:5173 (or 5174/5175)
echo.

REM Start both servers using npm run dev
npm run dev

REM This will keep the window open if something goes wrong
pause