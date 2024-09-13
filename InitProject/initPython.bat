@echo off
cd ..
cd ApiJiracode
call pip install Flask Flask-Cors mysql-connector-python  waitress paddlepaddle paddleocr numpy jira pandas matplotlib pytz  openpyxl
timeout /t 10