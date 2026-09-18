@echo off
title Push to GitHub
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;C:\Users\seif.elawamry\AppData\Roaming\npm;C:\Users\seif.elawamry\AppData\Local\Programs\Git\cmd;%PATH%"
echo ========================================================
echo         Push Field Visit Evaluation to GitHub
echo ========================================================
echo.
echo Step 1: Create a new empty repository on:
echo         https://github.com/new
echo         (Do NOT check "Add a README file")
echo.
echo Step 2: Copy your repository URL
echo         e.g., https://github.com/username/field-visit-evaluation.git
echo.
set /p REPO_URL="Paste your GitHub Repository URL here: "

if "%REPO_URL%"=="" (
  echo No URL entered. Exiting...
  pause
  exit /b
)

echo.
echo Connecting remote origin to: %REPO_URL%
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git branch -M main

echo.
echo Uploading to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
  echo.
  echo ========================================================
  echo   SUCCESS! Your project is now published on GitHub!
  echo ========================================================
) else (
  echo.
  echo [Notice] If prompted to sign in, use your GitHub login or Personal Access Token.
)
echo.
pause
