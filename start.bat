@echo off
title Field Visit Evaluation Tool
cd /d "%~dp0"
echo ========================================================
echo   Field Visit Evaluation Tool
echo   Opening http://localhost:5173 in your default browser...
echo ========================================================
start http://localhost:5173
if exist "C:\Program Files\nodejs\npm.cmd" (
  "C:\Program Files\nodejs\npm.cmd" run dev -- --host
) else (
  npm run dev -- --host
)
pause
