@echo off
cd /d "%~dp0"
echo Starting Cafe Management System...
start "Cafe Backend" cmd /k "%~dp0start-backend.bat"
start "Cafe Frontend" cmd /k "%~dp0start-frontend.bat"
echo.
echo Backend  : http://localhost:8082
echo Frontend : http://localhost:5173
