@echo off

REM Aller dans le dossier backend-backend
cd ..
cd backend-backend

REM Nettoyer le projet Maven avec un délai de 5 secondes avant la prochaine commande
echo Nettoyage du projet Maven...
timeout /t 5
call  mvn clean -e -X
timeout /t 5

REM Installer les dépendances Maven avec un délai de 5 secondes avant la prochaine commande
echo Installation des dépendances Maven...
call  mvn install -e -X

