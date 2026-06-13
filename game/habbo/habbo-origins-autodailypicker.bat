@echo off
setlocal enabledelayedexpansion
title Habbo Origins - Deluxe Auto Picker
color 0a

:: Custom suitcase names
set s1=Left
set s2=Middle
set s3=Right

:: Custom plate names (grid style)
set p1=Top Left
set p2=Top Middle
set p3=Top Right
set p4=Middle Left
set p5=Middle
set p6=Middle Right
set p7=Bottom Left
set p8=Bottom Middle
set p9=Bottom Right

:loop
cls
echo =====================================================
echo                   HABBO ORIGINS PICKER
echo =====================================================
echo.

:: Suitcase pick
echo Picking suitcase...
call :delay

set /a s=%random% %% 3 + 1

if %s%==1 echo Suitcase Result: Left
if %s%==2 echo Suitcase Result: Middle
if %s%==3 echo Suitcase Result: Right

echo.

:: Plate picks
echo Picking 3 unique plates...
call :delay

for /l %%i in (1,1,9) do set chosen%%i=0
set count=0

:plateLoop
set /a pick=%random% %% 9 + 1
if !chosen%pick%! == 1 goto plateLoop

set chosen%pick%=1
set /a count+=1
echo   !p%pick%!

if %count% LSS 3 goto plateLoop

echo.
echo =====================================================
echo Press ENTER to generate new picks
pause >nul
goto loop


:: Simple animation delay
:delay
for /l %%x in (1,1,15000) do rem
goto :eof