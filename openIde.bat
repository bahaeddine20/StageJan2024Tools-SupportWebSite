@echo off

REM Aller dans le dossier actia-projet et démarrer le serveur Angular
cd actia-projet

REM Ouvrir le projet Angular dans VS Code
echo Ouverture de VS Code pour actia-projet...
start "" code .

REM Revenir au dossier parent et aller dans backend-backend pour lancer Maven
cd ..
cd backend-backend

REM Ouvrir le projet backend-backend dans IntelliJ IDEA
echo Ouverture de IntelliJ pour backend-backend...
start "" "IntelliJ IDEA 2024.1.4.lnk"

REM Revenir au dossier parent et aller dans ApiJiracode
cd ..
cd ApiJiracode

REM Ouvrir le projet ApiJiracode dans PyCharm
echo Ouverture de PyCharm pour ApiJiracode...
start "" "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\JetBrains\PyCharm 2024.1.4.lnk"
