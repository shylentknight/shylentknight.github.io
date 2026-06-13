@echo off
setlocal enabledelayedexpansion
title Habbo Origins - Random Picker Tool

:mainmenu
cls
echo ============================================
echo        HABBO ORIGINS RANDOM PICKER
echo ============================================
echo.
echo  1. Suitcase Random Picker (3 suitcases)
echo  2. Plate Cleaner Picker (Pick 3 of 9 plates)
echo  3. Exit
echo.
set /p choice=Select an option (1-3): 

if "%choice%"=="1" goto suitcase
if "%choice%"=="2" goto plates
if "%choice%"=="3" exit
goto mainmenu


:suitcase
cls
echo ================================
echo       SUITCASE RANDOM PICKER
echo ================================
echo.
echo Press any key to pick a suitcase...
pause >nul

set /a pick=%random% %% 3 + 1

echo.
echo The winning suitcase is: %pick%
echo.
pause
goto mainmenu


:plates
cls
echo ======================================
echo        PLATE CLEANER - PICK 3
echo ======================================
echo.
echo Press any key to pick 3 plates...
pause >nul

:: Reset chosen flags
for /l %%i in (1,1,9) do set chosen%%i=0

set count=0

:pickloop
set /a pick=%random% %% 9 + 1

if !chosen%pick%! == 1 goto pickloop

set chosen%pick%=1
set /a count+=1
echo Plate %pick% selected!

if %count% LSS 3 goto pickloop

echo.
echo All 3 plates have been selected.
echo.
pause
goto mainmenu