
A web-based tool to support Jira API integration and other functionalities, built using Angular for the frontend ,Spring Boot for the backend and  Flask for Api jira for the backend  .

## Table of Contents
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Development Notes](#development-notes)
- [Contributing](#contributing)
- [License](#license)
- [Contact Information](#contact-information)

## Introduction

Provide a brief introduction to the project, its purpose, and its major features. This web-based tool integrates with Jira APIs to provide a seamless experience for managing Jira issues and other tasks.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** 
- **npm** 
- **Angular CLI** (version 18.2.0)
- **Java** (JDK 17 or later)
- **Maven** 
- **Git**

## Installation

### Frontend Setup

1. **Clone the repository**:

    ```bash
    git config --global http.postBuffer 157286400
    git clone --branch api-jira-version --depth 1 https://github.com/aestools-celad/StageJan2024Tools-SupportWebSite.git
    ```

2. **Navigate to the project directory**:

    ```bash
    cd StageJan2024Tools-SupportWebSite
    ```

3. **Install Angular CLI**:

    ```bash
    npm install -g @angular/cli@18.2.0
    ```

4. **Install project dependencies**:

    ```bash
    npm install --legacy-peer-deps
    ```

5. **Run the Angular development server**:

    ```bash
    ng serve
    ```

### Backend Setup

1. **Navigate to the backend directory**:

    ```bash
    cd backend-directory-path
    ```

2. **Run the Maven build**: 

  
    ```

3. **Start the Spring Boot application**:



## Configuration

1. **Jira API Integration**: Replace the placeholder `Token_Here` in your Python scripts with your actual Jira Personal Access Token (PAT):

    ```python
    pat = "your_actual_jira_token_here"
    ```


## Running the Application

To run the application, make sure both the frontend and backend are set up and running:

- **Frontend**: Access the Angular application at `http://localhost:4200`.
- **Backend**: Access the Spring Boot API at `http://localhost:8080`.

## Development Notes

- Use proper branching strategies for new features.
- Ensure code is well-documented and adheres to the coding standards outlined by the team.

## Contributing

To contribute to this project, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).


