@echo off
cd backend-backend

echo Démarrage de Spring Boot...
start cmd /k "mvn spring-boot:run"
cd ..
REM Aller dans le dossier actia-projet et démarrer le serveur Angular
cd actia-projet
echo Lancement de ng serve dans actia-projet...
start cmd /k "ng serve"

REM Revenir au dossier parent et aller dans backend-backend pour lancer Maven


REM Aller dans le dossier ApiJiracode et exécuter le script Flask
cd ..
cd ApiJiracode
echo Lancement du script Flask...
start cmd /k "python flaskCodeApi.py"
