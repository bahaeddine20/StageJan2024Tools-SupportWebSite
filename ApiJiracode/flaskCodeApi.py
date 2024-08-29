import base64
import json

import io


import datetime
import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS
from mysql.connector import Error

from paddleocr import PaddleOCR, draw_ocr # main OCR dependencies
import numpy as np

from jira import JIRA
import pandas as pd

import matplotlib.pyplot as plt

pat = "TokenJira"

# Specify Jira connection parameters
jiraOptions = {'server': "https://jira.dt.renault.com"}
jira = JIRA(options=jiraOptions, token_auth=pat)

def get_board_id_by_project(project_key):
    """Retrieve the board ID associated with a project key."""
    boards = jira.boards()
    for board in boards:
        if board.location.projectKey == project_key:
            return board.id
    return None

def get_sprints(board_id):
    """Retrieve all sprints for the specified board."""
    sprints = jira.sprints(board_id)
    return sprints

def search_issues_by_sprint(sprint_id):
    """Search for all issues in a specified sprint."""
    jql_str = f'sprint = {sprint_id}'
    issues = jira.search_issues(jql_str, expand='changelog')
    return issues


from datetime import datetime, timedelta

def is_weekend(dt):
    """Check if the given datetime is on a weekend (Saturday or Sunday)."""
    return dt.weekday() >= 5  # 5 is Saturday, 6 is Sunday


from datetime import datetime, timedelta

def calculate_duration_excluding_weekends(start_time, end_time):
    """Calculate duration in hours between two datetime objects, excluding weekends."""
    if not isinstance(start_time, datetime) or not isinstance(end_time, datetime):
        raise TypeError("start_time and end_time must be datetime objects")

    if start_time >= end_time:
        return 0

    total_hours = 0
    current_time = start_time

    while current_time < end_time:
        # Check if the current day is a weekday (0-4 corresponds to Monday to Friday)
        if current_time.weekday() < 5:
            # Calculate the end of the current day
            end_of_day = datetime(current_time.year, current_time.month, current_time.day, 23, 59, 59, tzinfo=current_time.tzinfo)
            next_time = min(end_of_day + timedelta(seconds=1), end_time)
            duration = next_time - current_time

            # Convert duration to hours
            hours = duration.total_seconds() / 3600
            total_hours += hours

        # Move to the start of the next day
        current_time = datetime(current_time.year, current_time.month, current_time.day, tzinfo=current_time.tzinfo) + timedelta(days=1)

    return total_hours
import pytz
tz = pytz.UTC

from datetime import datetime
import pytz

def calculate_points_excluding_weekends(start_time, end_time, points_per_hour, start_sprint, end_sprint):
    """Calculate points excluding weekends between two timezone-aware datetimes."""
    if not isinstance(start_time, datetime) or not isinstance(end_time, datetime):
        raise TypeError("start_time and end_time must be datetime objects")

    if start_time.tzinfo is None or end_time.tzinfo is None:
        raise ValueError("start_time and end_time must be timezone-aware datetime objects")

    tz = pytz.UTC  # Or any timezone you need

    # Convert string dates to timezone-aware datetime objects
    if isinstance(start_sprint, str):
        start_sprint = datetime.strptime(start_sprint, "%d/%b/%y").replace(hour=9, minute=0, tzinfo=tz)
    elif start_sprint.tzinfo is None:
        start_sprint = tz.localize(start_sprint.replace(hour=9, minute=0))

    if isinstance(end_sprint, str):
        end_sprint = datetime.strptime(end_sprint, "%d/%b/%y").replace(hour=17, minute=0, tzinfo=tz)
    elif end_sprint.tzinfo is None:
        end_sprint = tz.localize(end_sprint.replace(hour=17, minute=0))

    # Ensure start_time and end_time are within the sprint period
    if start_time < start_sprint:
        start_time = start_sprint
    if end_time > end_sprint:
        end_time = end_sprint

    # Ensure start_time is before end_time
    if start_time >= end_time:
        return 0

    total_points = 0
    current_time = start_time

    # Assuming calculate_duration_excluding_weekends is a valid function defined elsewhere
    hours_worked = calculate_duration_excluding_weekends(start_time, end_time)
    day_points = hours_worked // 24
    hours_worked = hours_worked % 24

    print("nbre de jour est ", day_points, " nbre d heures est ", hours_worked)
    if hours_worked >= 8:
        day_points += 1
    else:
        day_points += hours_worked * points_per_hour

    return day_points





def calculate_consumed_story_points(issue,start_sprint,end_sprint):
    """Calculate consumed story points for a given issue."""
    status_changes = []

    for history in issue.changelog.histories:
        for item in history.items:
            if item.field == 'status':
                status_changes.append({
                    'from': item.fromString,
                    'to': item.toString,
                    'date': datetime.strptime(history.created, "%Y-%m-%dT%H:%M:%S.%f%z")
                })

    status_changes.sort(key=lambda x: x['date'])

    if not status_changes:
        return 0

    total_points = 0
    points_per_hour = 1/8
    in_progress_start_time = None


    for change in status_changes:
        from_status = change['from']
        to_status = change['to']
        current_time = change['date']

        if from_status != 'In Progress' and to_status == 'In Progress':
            in_progress_start_time = current_time

        elif from_status == 'In Progress' and to_status != 'In Progress':
            if in_progress_start_time:
                total_points += calculate_points_excluding_weekends(in_progress_start_time, current_time, points_per_hour,start_sprint,end_sprint)
                in_progress_start_time = None

    if in_progress_start_time:
        current_time = datetime.now(pytz.utc)
        total_points += calculate_points_excluding_weekends(in_progress_start_time, current_time, points_per_hour,start_sprint,end_sprint)

    return total_points


def generate_velocity_chart(sprint_data, filename):
    """Generate and save a velocity chart based on sprint data."""
    sprint_names = [data['Sprint Name'] for data in sprint_data]
    total_points = [data['Total Points'] for data in sprint_data]

    plt.figure(figsize=(10, 6))
    plt.plot(sprint_names, total_points, marker='o', linestyle='-', color='b')
    plt.xlabel('Sprint')
    plt.ylabel('Total Points')
    plt.title('Velocity Chart')
    plt.xticks(rotation=45)
    plt.grid(True)

    plt.tight_layout()
    plt.savefig(filename)
    plt.close()


def print_issue_details(issues,start_sprint,end_sprint):
    """Print details of the issues."""
    for issue in issues:
        print(f"Issue Key: {issue.key}")
        print(f"Summary: {issue.fields.summary}")

        reporter = issue.fields.reporter
        if reporter:
            print(f"Reporter: {reporter.displayName}")
        else:
            print("Reporter: Unassigned")

        assignee = issue.fields.assignee
        if assignee:
            print(f"Assignee: {assignee.displayName}")
        else:
            print("Assignee: Unassigned")

        print(f"Status: {issue.fields.status.name}")
        print(f"Created: {issue.fields.created}")
        print(f"Updated: {issue.fields.updated}")
        print(f"Consumed Story Points: {calculate_consumed_story_points(issue,start_sprint,end_sprint)}")
        print("\nHistory:\n")

        for history in issue.changelog.histories:
            transition_items = [item for item in history.items if item.field == 'status']
            if transition_items:
                print(f"Date: {history.created}")
                for item in transition_items:
                    print(f"Changed {item.field.capitalize()}: From '{item.fromString}' To '{item.toString}'")
                print("-" * 20)
        print("\n" + "=" * 20 + "\n")

def get_issue_by_key(issue_key):
    """Retrieve issue details by issue key."""
    issue = jira.issue(issue_key, expand='changelog')
    return issue

def excel_serial_to_date(serial_date):
    """Convert Excel serial date to pandas Timestamp."""
    return pd.to_datetime('1899-12-30') + pd.to_timedelta(serial_date, 'D')

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire application


def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            port='3306',
            database='actiabackImg',
            user='root',
            password=''
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def get_sprint_from_key(file, key_value):
    # Read the Excel file without headers to find the header row
    data = pd.read_excel(file, header=None)

    # Find the header row by checking for the expected header pattern
    for i, row in data.iterrows():
        if 'Key' in row.values and 'Issue Type' in row.values:  # Adjust conditions based on unique header columns
            header_row_index = i
            break

    # Read the Excel file again with the detected header row
    data = pd.read_excel(file, header=header_row_index)

    # Trim any leading or trailing spaces from column names
    data.columns = data.columns.str.strip()

    # Check if 'Key' and 'Status' columns are present
    if 'Key' not in data.columns or 'Sprint' not in data.columns:
        raise ValueError("The required columns 'Key' and 'Status' are not present in the Excel file.")

    # Find the row where the 'Key' matches the provided key_value
    issue_row = data[data['Key'] == key_value]

    # Check if the issue was found
    if issue_row.empty:
        return f"No issue found with Key: {key_value}"

    # Return the status of the issue
    return issue_row['Sprint'].values[0]

def get_status_from_key(file, key_value):
    # Read the Excel file without headers to find the header row
    data = pd.read_excel(file, header=None)

    # Find the header row by checking for the expected header pattern
    for i, row in data.iterrows():
        if 'Key' in row.values and 'Issue Type' in row.values:  # Adjust conditions based on unique header columns
            header_row_index = i
            break

    # Read the Excel file again with the detected header row
    data = pd.read_excel(file, header=header_row_index)

    # Trim any leading or trailing spaces from column names
    data.columns = data.columns.str.strip()

    # Check if 'Key' and 'Status' columns are present
    if 'Key' not in data.columns or 'Status' not in data.columns:
        raise ValueError("The required columns 'Key' and 'Status' are not present in the Excel file.")

    # Find the row where the 'Key' matches the provided key_value
    issue_row = data[data['Key'] == key_value]

    # Check if the issue was found
    if issue_row.empty:
        return f"No issue found with Key: {key_value}"

    # Return the status of the issue
    return issue_row['Status'].values[0]

@app.route('/submit-form/<int:idsprint>', methods=['POST'])
def submit_form(idsprint):
    create_table_query = """
    CREATE TABLE IF NOT EXISTS performanceJira (
        id INT AUTO_INCREMENT PRIMARY KEY,
        start_date DATE,
        end_date DATE,
        sprint_name VARCHAR(255),
        grouped_bar_chart TEXT,
        pie_chart TEXT,
        histogram TEXT,
        file_data LONGBLOB,
        idsprint INT
    )
    """
    print(idsprint)
    from datetime import datetime

    try:
        # Extract form data
        sprint_name = request.form.get('sprintName')
        raw_start_date = request.form.get('startDate')
        raw_end_date = request.form.get('endDate')

        # Parse only the first part of the date string
        parsed_start_date = datetime.strptime(raw_start_date[:24], '%a %b %d %Y %H:%M:%S')
        parsed_end_date = datetime.strptime(raw_end_date[:24], '%a %b %d %Y %H:%M:%S')

        # Reformat the dates to match '%d/%b/%y'
        start_date = parsed_start_date.strftime('%d/%b/%y')
        end_date = parsed_end_date.strftime('%d/%b/%y')
        carry_forward_sp = request.form.get('carryForwardSP')

        # Extract file data
        file = request.files.get('file')
        file_data = None
        if file:
            file_data = file.read()
            # Optionally print file size or type
            print(f"File size: {len(file_data)} bytes")
            print(f"File type: {file.mimetype}")

        # Print extracted data to the terminal
        print(f"Sprint Name: {sprint_name}")
        print(f"Start Date: {start_date}")
        print(f"End Date: {end_date}")
        print(f"Carry Forward SP: {carry_forward_sp}")
        if file:
            print("File received")
        else:
            print("No file received")

        # Initialize PaddleOCR
        ocr_model = PaddleOCR(lang='en')





        from datetime import datetime, timedelta

        # Importation du capture d'ecran



        def get_valid_date(start_date, end_date):
            try:
                start_sprint = datetime.strptime(start_date, "%d/%b/%y").replace(hour=9, minute=0)
                end_sprint = datetime.strptime(end_date, "%d/%b/%y").replace(hour=17, minute=0)
                if start_sprint <= end_sprint:
                    return start_sprint, end_sprint
                else:
                    raise ValueError("Start date must be earlier or equal to end date.")
            except ValueError as e:
                print("Error parsing dates:", e)
                raise

        # Use the dates passed as parameters
        start_sprint, end_sprint = get_valid_date(start_date, end_date)
        print("Date debut sprint:", start_sprint)
        print("Date fin sprint:", end_sprint)
        # Specifiez le chemin complet du fichier sur votre bureau
        # ***************
        #chemin_fichier = r"C:\Users\azizs\Desktop\dataexel\MATRIX_24.2-1.xlsx"
        # Importez le fichier en utilisant pandas


        data = pd.read_excel(file, header=None)

        # Find the header row by checking for the expected header pattern
        for i, row in data.iterrows():
            if 'Key' in row.values and 'Issue Type' in row.values:  # Adjust conditions based on unique header columns
                header_row_index = i
                break

        # Read the Excel file again with the detected header row
        data = pd.read_excel(file, header=header_row_index)


        # Drop rows where the "Key" column is empty
        data = data.dropna(subset=["Key"])

        # Convert serial dates to human-readable dates
        date_columns = ['Start Date', 'End Date']  # Replace with your actual date column names
        for col in date_columns:
            if col in data.columns:
                data[col] = data[col].apply(excel_serial_to_date)

        # Initialize an empty list to store results
        results = []
        data = data.dropna(subset=["Key"])

        # Iterate through each issue key from the Excel file
        for issues_key in data["Key"]:
            issue = get_issue_by_key(issues_key)
            print(f"Issue Key: {issue.key}")
            print(f"Summary: {issue.fields.summary}")

            # Handle reporter field
            reporter = issue.fields.reporter
            if reporter:
                print(f"Reporter: {reporter.displayName}")
            else:
                print("Reporter: Unassigned")

            # Handle assignee field
            assignee = issue.fields.assignee
            if assignee:
                print(f"Assignee: {assignee.displayName}")
            else:
                print("Assignee: Unassigned")

            print(f"Status: {issue.fields.status.name}")
            print(f"Created: {issue.fields.created}")
            print(f"Updated: {issue.fields.updated}")
            print(f"Consumed Story Points: {calculate_consumed_story_points(issue,start_sprint,end_sprint)}")
            print("\nHistory:\n")

            # Display the issue's history (changelog)
            for history in issue.changelog.histories:
                transition_items = [item for item in history.items if item.field == 'status']
                if transition_items:
                    print(f"Date: {history.created}")
                    for item in transition_items:
                        print(f"Changed {item.field.capitalize()}: From '{item.fromString}' To '{item.toString}'")
                    print("-" * 20)
            print("\n" + "=" * 20 + "\n")
            if issue:
                consumed_story_points = calculate_consumed_story_points(issue,start_sprint,end_sprint)
                latest_status = get_status_from_key(file,issues_key)
                components = ', '.join(comp.name for comp in issue.fields.components) if hasattr(issue.fields,'components') else 'None'
               # story_points = issue.fields.customfield_10016 if hasattr(issue.fields, 'customfield_10016') else 'N/A'
                sprint = get_sprint_from_key(file,issues_key)

                history = [
                    {
                        'date': datetime.strptime(history.created, "%Y-%m-%dT%H:%M:%S.%f%z"),
                        'from': item.fromString,
                        'to': item.toString
                    }
                    for history in issue.changelog.histories
                    for item in history.items
                    if item.field == 'status'
                ]
                results.append({
                    'Issue Key': issue.key,
                    'Issue Type': issue.fields.issuetype.name,

                    'Summary': issue.fields.summary,
                    'Reporter': issue.fields.reporter.displayName if issue.fields.reporter else 'Unassigned',
                    'Assignee': issue.fields.assignee.displayName if issue.fields.assignee else 'Unassigned',
                    'Status': latest_status,
                    'Created': datetime.strptime(issue.fields.created, "%Y-%m-%dT%H:%M:%S.%f%z").strftime(
                        '%d-%b-%Y %H:%M'),
                    'Updated': datetime.strptime(issue.fields.updated, "%Y-%m-%dT%H:%M:%S.%f%z").strftime(
                        '%d-%b-%Y %H:%M'),
                    'Component/s': components,
                    #'Story Points': story_points,
                    'Sprint': sprint,

                    'consumed Story Points': consumed_story_points,

                })

        # Export to Excel
        output_file = 'jira_issues_with_history.xlsx'
        df = pd.DataFrame(results)
        df.to_excel(output_file, index=False)
        # Use 'Story Points' column instead of generating random values
        #df['Treated task'] = np.random.randint(0, 5, df.shape[0])

        # Removing leading/trailing spaces from 'Status' column
        df['Status'] = df['Status'].str.strip()

        # Grouping by 'Status' and summing 'Story Points'
        sum_by_status = df.groupby('Status')['consumed Story Points'].sum().reset_index()
        sum_by_status = df.groupby('Status')['consumed Story Points'].sum().reset_index()
        #sum_treated_task = df.groupby(['Issue Type', 'Status'])['Treated task'].sum().reset_index()
        #count_status = df.groupby('Issue Type')['Status'].value_counts().unstack().reset_index()

        # Filtering statuses for 'Integrated' and 'Closed'
        filtered_status = sum_by_status[sum_by_status['Status'].isin(['Integrated', 'Closed'])]

        # Summing the 'Story Points' for the filtered statuses
        total_sum = filtered_status['consumed Story Points'].sum()

        # Convert the result to JSON
        json_result_sum_by_status = sum_by_status.to_json(orient='records')
        print(json_result_sum_by_status)

        # Counting issues by 'Issue Type'
        issue_counts = df["Issue Type"].value_counts().reset_index()
        issue_counts.columns = ['Issue Type', 'Count']

        # Convert the issue counts DataFrame to JSON
        json_result_histogram = issue_counts.to_json(orient='records')
        print(json_result_histogram)

        # Identifying treated issues with 'Integrated' or 'Closed' status
        df['Treated issues (Integrated or Closed)'] = df['Status'].apply(
            lambda status: status if status in ['Closed', 'Integrated'] else np.nan
        )

        treated_counts = df.groupby('Issue Type')['Treated issues (Integrated or Closed)'].apply(
            lambda x: x.notna().sum()
        ).reset_index()

        treated_counts.columns = ['Issue Type', 'Treated issues (Integrated or Closed)']

        # Merging the counts with treated issues
        issue_df = pd.merge(issue_counts, treated_counts, on='Issue Type', how='left')

        # Convert the merged DataFrame to JSON
        json_result_grouped_bar_chart = issue_df.to_json(orient='records')
        print(json_result_grouped_bar_chart)

        import mysql.connector
        from mysql.connector import Error

        try:
            # Connect to MySQL
            connection = mysql.connector.connect(
                host='localhost',
                port='3306',
                database='actiabackImg',
                user='root',
                password=''
            )

            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(create_table_query)

                # SQL statement to create the 'files' table
                create_table_query = """
                CREATE TABLE files (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    file_name VARCHAR(255),
                    file_data LONGBLOB
                );
                """

                # SQL statement to alter the 'performanceJira' table
                alter_table_query = """
                ALTER TABLE performanceJira
                ADD COLUMN file_data LONGBLOB;
                """

                # Execute the queries
                cursor.execute(create_table_query)
                print("Table 'files' created successfully.")

                cursor.execute(alter_table_query)
                print("Column 'file_data' added to 'performanceJira' table successfully.")

        except Error as e:
            print(f"Error: {e}")

        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()
                print("MySQL connection closed")

        import mysql.connector
        from mysql.connector import Error

        try:
            # Connect to MySQL
            connection = mysql.connector.connect(
                host='localhost',
                port='3306',
                database='actiabackImg',
                user='root',
                password=''
            )

            if connection.is_connected():
                cursor = connection.cursor()

                # SQL statement to alter the table and add the 'file_data' column
                alter_table_query = """
                ALTER TABLE performanceJira
                ADD COLUMN file_data LONGBLOB;
                """

                # Execute the query
                cursor.execute(alter_table_query)
                connection.commit()
                print("Column 'file_data' added to 'performanceJira' table successfully.")

        except Error as e:
            print(f"Error: {e}")

        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()
                print("MySQL connection closed")

        import mysql.connector
        from mysql.connector import Error

        # File path

        # Example data


        try:
            # Connect to MySQL
            connection = mysql.connector.connect(
                host='localhost',
                port='3306',
                database='actiabackImg',
                user='root',
                password=''
            )

            if connection.is_connected():
                cursor = connection.cursor()

                # Create a BytesIO object to hold the Excel data in memory
                output_file = io.BytesIO()

                # Write the DataFrame to this in-memory file
                df = pd.DataFrame(results)
                df.to_excel(output_file, index=False)

                # Get the in-memory data
                file_data = output_file.getvalue()
                # Insert data query
                insert_data_query = """
                           INSERT INTO performanceJira (start_date, end_date, sprint_name, grouped_bar_chart, pie_chart, histogram, file_data,idsprint)
                           VALUES (%s, %s, %s, %s, %s, %s, %s,%s)
                           """

                cursor.execute(insert_data_query, (
                    datetime.strptime(raw_start_date[:24], '%a %b %d %Y %H:%M:%S').date(),
                    datetime.strptime(raw_end_date[:24], '%a %b %d %Y %H:%M:%S').date(),
                    sprint_name,
                    json.dumps(json_result_grouped_bar_chart),
                    json.dumps(json_result_sum_by_status),
                    json.dumps(json_result_histogram),
                    file_data,
                    idsprint
                ))
                connection.commit()
                print("Data and file inserted successfully.")

        except Error as e:
            print(f"Error: {e}")

        return jsonify({"message": "Form data received successfully"})
    except Exception as e:
        print(f"Error processing form data: {e}")
        return jsonify({"error": "Failed to process form data"}), 500
from flask import Flask, jsonify, send_file


@app.route('/data/<int:idsprint>', methods=['GET'])
def get_data_by_idsprint(idsprint):
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM performanceJira WHERE idsprint = %s"
        cursor.execute(query, (idsprint,))
        result = cursor.fetchall()

        # Deserialize JSON fields and encode binary data
        for row in result:
            if row['grouped_bar_chart']:
                row['grouped_bar_chart'] = json.loads(row['grouped_bar_chart'])
            if row['pie_chart']:
                row['pie_chart'] = json.loads(row['pie_chart'])
            if row['histogram']:
                row['histogram'] = json.loads(row['histogram'])
            # Encode binary file data to base64
            if row['file_data']:
                row['file_data'] = base64.b64encode(row['file_data']).decode('utf-8')

        return jsonify(result)
    except Error as e:
        print(f"Error fetching data from MySQL: {e}")
        return jsonify({"error": "Failed to fetch data from the database"}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/download-xlsx/<int:file_id>', methods=['GET'])
def download_xlsx(file_id):
    try:
        # Connect to MySQL
        connection = mysql.connector.connect(
            host='localhost',
            port='3306',
            database='actiabackImg',
            user='root',
            password=''
        )

        if connection.is_connected():
            cursor = connection.cursor()
            query = "SELECT file_data FROM performanceJira WHERE id = %s"
            cursor.execute(query, (file_id,))
            result = cursor.fetchone()

            if result:
                file_data = result[0]

                # Create an in-memory file object
                file_stream = io.BytesIO(file_data)

                # Send the file as a response
                return send_file(
                    file_stream,
                    as_attachment=True,
                    download_name=f'performanceJira_{file_id}.xlsx',
                    mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                )
            else:
                return jsonify({"error": "File not found"}), 404

    except Error as e:
        return jsonify({"error": str(e)}), 500

@app.route('/data/stats/<int:id>', methods=['GET'])
def get_data_by_id(id):
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM performanceJira WHERE id = %s"
        cursor.execute(query, (id,))
        result = cursor.fetchone()

        if result:
            # Deserialize JSON fields and encode binary data
            if result['grouped_bar_chart']:
                result['grouped_bar_chart'] = json.loads(result['grouped_bar_chart'])
            if result['pie_chart']:
                result['pie_chart'] = json.loads(result['pie_chart'])
            if result['histogram']:
                result['histogram'] = json.loads(result['histogram'])
            # Encode binary file data to base64
            if result['file_data']:
                result['file_data'] = base64.b64encode(result['file_data']).decode('utf-8')

            return jsonify(result)
        else:
            return jsonify({"error": "Record not found"}), 404
    except Error as e:
        print(f"Error fetching data from MySQL: {e}")
        return jsonify({"error": "Failed to fetch data from the database"}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/data', methods=['GET'])
def get_data():
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM performanceJira"
        cursor.execute(query)
        result = cursor.fetchall()

        # Deserialize JSON fields and encode binary data
        for row in result:
            if row['grouped_bar_chart']:
                row['grouped_bar_chart'] = json.loads(row['grouped_bar_chart'])
            if row['pie_chart']:
                row['pie_chart'] = json.loads(row['pie_chart'])
            if row['histogram']:
                row['histogram'] = json.loads(row['histogram'])
            # Encode binary file data to base64
            if row['file_data']:
                row['file_data'] = base64.b64encode(row['file_data']).decode('utf-8')

        return jsonify(result)
    except Error as e:
        print(f"Error fetching data from MySQL: {e}")
        return jsonify({"error": "Failed to fetch data from the database"}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()





# Call the function to install the packages


if __name__ == '__main__':
    app.run(port=5000)

    #install_packages()

    # Your main code here
    print("All packages installed successfully!")
    #upgrade_packages()

    # Your main code here
    print("All packages upgraded successfully!")
    # Initialize PaddleOCR

    app.run(debug=True)
