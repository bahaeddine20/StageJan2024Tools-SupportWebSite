@echo off
echo Configuration initiale du projet Angular...
cd ..
REM Aller dans le dossier actia-projet
cd actia-projet

REM Vérifier si Node.js et npm sont installés
echo Vérification de Node.js et npm...
call  node -v
if %errorlevel% neq 0 (
    echo Node.js n'est pas installé. Veuillez installer Node.js depuis https://nodejs.org/ et réessayez.
    pause
    exit /b
)
call npm update --force
call npm install  --force 

REM Installer les dépendances du projet
echo Installation des dépendances npm...


