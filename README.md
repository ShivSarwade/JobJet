# JobJet

JobJet is a job search and application platform designed to streamline the process of finding and applying for jobs. It connects job seekers with top companies and offers a seamless, user-friendly experience for both applicants and employers.

## Features

- **Job Search**: Search for job listings by keyword, location, job type, and company.
- **Advanced Filtering**: Filter job listings by salary, experience level, industry, and more.
- **Job Alerts**: Set up custom alerts to get notified about new job openings matching your preferences.
- **Company Profiles**: Explore detailed company profiles with reviews, ratings, and open job positions.
- **Application Tracking**: Keep track of your job applications and their statuses.
- **Resume Upload**: Upload and manage your resume and cover letter directly on the platform.
- **Interview Scheduling**: Coordinate interview dates and times with employers through the platform.

## Tech Stack

JobJet is built using the following technologies:

- **Frontend**: React, Redux, TailwindCSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Search Engine**: Elasticsearch
- **Deployment**: Docker, AWS (Amazon Web Services)

## Installation

To get started with JobJet locally, follow these steps:

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance, like MongoDB Atlas)
- [Git](https://git-scm.com/)

### Steps

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/jobjet.git
    cd jobjet
    ```

2. **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    ```

3. **Set Up Environment Variables:**

    Create a `.env` file in the root directory of the backend (and frontend if necessary). Here’s a sample `.env` configuration:

    **Backend `.env` Example:**
    ```bash
    # MongoDB connection string
    MONGO_URI=your_mongo_connection_string_here

    # JWT secret key (used for authentication)
    JWT_SECRET=your_jwt_secret_key_here

    # Port for the backend server
    PORT=5000
    ```

    **Frontend `.env` Example:**
    If you're using environment variables for your frontend (like the backend API URL), create a `.env` in the frontend directory:
    ```bash
    REACT_APP_API_URL=http://localhost:5000
    ```

    Note: Replace `your_mongo_connection_string_here` and `your_jwt_secret_key_here` with the actual values you are using for your MongoDB URI and JWT secret key.

4. **Run the Backend Server:**

    After configuring the environment variables, you can start the backend server. Run the following command inside the backend directory:
    ```bash
    cd backend
    npm run start
    ```
    The backend will start on `http://localhost:5000`.

5. **Run the Frontend Application:**

    In another terminal window, navigate to the frontend directory and run the React app:
    ```bash
    cd frontend
    npm run dev
    ```
    This will start the frontend application on `http://localhost:3000`.

Your application should now be running locally at:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

### Key Notes:
- **Code Blocks**: Code blocks (like terminal commands or configuration examples) are formatted correctly inside triple backticks (```).
- **Explanation**: There is no unnecessary breaking of code, and the formatting is consistent.

This should be ready to paste directly into your `README.md` file without any formatting issues! Let me know if you need anything else!
