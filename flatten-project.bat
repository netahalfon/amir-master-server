@echo off
setlocal EnableDelayedExpansion

REM Define source folder
set "SOURCE=server"

REM Go to root of project
cd /d %~dp0

REM Create list of files before anything is moved
set "TMPFILE=__filelist.txt"
del "%TMPFILE%" >nul 2>&1

for /R "%SOURCE%" %%F in (*) do (
    set "full=%%F"
    set "rel=%%F"
    setlocal EnableDelayedExpansion
    set "rel=!rel:%cd%\%SOURCE%\=!"
    
    REM Skip node_modules
    echo !rel! | findstr /I /C:"node_modules" >nul
    if errorlevel 1 (
        echo !rel!>>"%TMPFILE%"
    )
    endlocal
)

REM Move each file using git mv
for /F "usebackq delims=" %%F in ("%TMPFILE%") do (
    if exist "%SOURCE%\%%F" (
        git mv "%SOURCE%\%%F" "%%F"
    )
)

REM Delete the server folder if empty
rmdir /s /q "%SOURCE%"
del "%TMPFILE%"

echo Project flattened from server/ to root using git mv.
echo Run: git commit -m "Flattened structure: moved files from server to root"
