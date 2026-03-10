@echo off
title WiFi Chat App Server

echo ==============================
echo Starting WiFi Chat App Server
echo ==============================
echo.

cd /d "D:\main coding\wifi-chat-app\wifi-chat-app"

echo Installing required libraries...
npm install

echo.
echo Starting server...
node server.js

echo.
echo Server stopped.
pause