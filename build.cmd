@echo Off
pushd %~dp0
setlocal
set pull_request_number=%APPVEYOR_PULL_REQUEST_NUMBER%

if "%pull_request_number%"=="" (
  set pull_request_number=0
)

:Build
call npm install
if %ERRORLEVEL% neq 0 goto BuildFail

call npm run build
if %ERRORLEVEL% neq 0 goto BuildFail

goto BuildSuccess

:BuildFail
echo.
echo *** BUILD FAILED ***
goto End

:BuildSuccess
echo.
echo *** BUILD SUCCEEDED ***
goto End

:End
echo.
popd
exit /B %ERRORLEVEL%