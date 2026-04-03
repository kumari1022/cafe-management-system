@echo off
cd /d "%~dp0com.inn.cafe"
echo Starting backend on http://localhost:8082 ...
call mvnw.cmd spring-boot:run
