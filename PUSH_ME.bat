@echo off
cd /d "%~dp0"
git config user.email "bishwashkafle0102@gmail.com"
git config user.name "Bishwash"
git add -A
git commit -m "Today's contribution update"
git push origin main
echo Push complete. If you want 10 commits, run create-today-commits.ps1 instead.
pause