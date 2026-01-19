cd /d "%~dp0"
call gradlew.bat assembleDebug > build_output.log 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo Build failed with error code %ERRORLEVEL% >> build_output.log
  exit /b %ERRORLEVEL%
)
echo Build successful >> build_output.log
