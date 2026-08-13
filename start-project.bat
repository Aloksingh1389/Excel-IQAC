@echo off
title IQAC Management System
echo ========================================================
echo   IQAC Institutional Quality Management System Portal
echo ========================================================
echo.

cd /d "%~dp0frontend"

if not exist node_modules (
    echo [INFO] Installing required dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed. Please ensure Node.js is installed.
        pause
        exit /b %errorlevel%
    )
)

echo.
echo [INFO] Starting IQAC Frontend Development Server...
echo [INFO] The application will be accessible at http://localhost:5173
echo.

call npm run dev -- --open
pause
