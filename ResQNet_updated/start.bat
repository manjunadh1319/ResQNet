@echo off
REM ResQNet — one-click launcher.
REM Requires that you've already run the one-time setup for both
REM backend (venv + pip install + .env) and frontend (npm install + .env).
REM See README.md if you haven't done that yet.

echo Starting ResQNet backend and frontend...

start "ResQNet Backend" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"
timeout /t 3 /nobreak >nul
start "ResQNet Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Two new windows have opened - close them to stop the servers.
pause
