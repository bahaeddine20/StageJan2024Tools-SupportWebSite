# Use the official Python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy the .env file temporarily
COPY .env .env

# Copy the rest of the application code
COPY . .

# Set environment variables from .env
# The RUN export command does not persist environment variables between layers.
# Instead, use a custom script to set them and remove .env.
RUN python -c "from dotenv import load_dotenv; load_dotenv()"

# Remove the .env file for security
RUN rm -f .env

# Expose the port the app runs on
EXPOSE 5000

# Default command to run the application
CMD ["python", "flaskCodeApi.py"]
