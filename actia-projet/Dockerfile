# Stage 1: Build the Angular app
FROM node:20.17.0 AS build

# Set the working directory
WORKDIR /app
RUN npm install -g @angular/cli

RUN npm update --force
# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application code
COPY . .

# Expose the port that the Angular app will run on
EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
