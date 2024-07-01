# Project Name

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Dependencies](#dependencies)
- [DevDependencies](#devdependencies)
- [Usage](#usage)

## Overview
This project consists of a frontend and backend application. The frontend is built using React and Vite, while the backend is built using Node.js and Express.

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/gauravshresthaofficial/mart-billing-and-analytics-system.git
    ```
2. Navigate to the frontend directory and install dependencies:
    ```bash
    cd frontend
    npm install
    ```
3. Navigate to the backend directory and install dependencies:
    ```bash
    cd ../backend
    npm install
    ```

## Scripts

### Frontend
- `dev`: Runs the development server using Vite.
    ```bash
    npm run dev
    ```
- `build`: Builds the project for production.
    ```bash
    npm run build
    ```
- `lint`: Lints the project files using ESLint.
    ```bash
    npm run lint
    ```
- `preview`: Previews the production build.
    ```bash
    npm run preview
    ```

### Backend
- `start`: Starts the backend server using Nodemon.
    ```bash
    npm start
    ```

## Environment Variables
Create a `.env` file in the `backend` directory and add the following variables:
```
# MongoDB connection URL
MONGODB_URL = "mongodb://localhost:27017/?directConnection=true"

# Server port
PORT = 4000

# JWT token key
TOKEN_KEY="sample_token_key"
```

## Dependencies

### Frontend
- `@material-tailwind/html`: ^2.2.2
- `@nivo/bar`: ^0.87.0
- `@nivo/line`: ^0.87.0
- `@nivo/pie`: ^0.87.0
- `@reduxjs/toolkit`: ^2.2.3
- `axios`: ^1.6.8
- `react`: ^18.2.0
- `react-cookie`: ^7.1.0
- `react-dom`: ^18.2.0
- `react-icons`: ^5.2.1
- `react-redux`: ^9.1.0
- `react-router-dom`: ^6.23.1
- `react-to-pdf`: ^1.0.1
- `react-toastify`: ^10.0.5
- `redux`: ^5.0.1
- `redux-logger`: ^3.0.6
- `redux-thunk`: ^3.1.0
- `tailwind-merge`: ^2.3.0

### Backend
- `bcrypt`: ^5.1.1
- `bcryptjs`: ^2.4.3
- `cookie-parser`: ^1.4.6
- `cors`: ^2.8.5
- `dotenv`: ^16.4.5
- `express`: ^4.19.1
- `express-validator`: ^7.0.1
- `jsonwebtoken`: ^9.0.2
- `mongoose`: ^8.2.2

## DevDependencies

### Frontend
- `@types/react`: ^18.2.66
- `@types/react-dom`: ^18.2.22
- `@vitejs/plugin-react`: ^4.2.1
- `autoprefixer`: ^10.4.19
- `eslint`: ^8.57.0
- `eslint-plugin-react`: ^7.34.1
- `eslint-plugin-react-hooks`: ^4.6.0
- `eslint-plugin-react-refresh`: ^0.4.6
- `postcss`: ^8.4.38
- `tailwindcss`: ^3.4.1
- `tailwindcss-animated`: ^1.0.1
- `vite`: ^5.2.0

### Backend
- `nodemon`: ^3.1.0

## Usage
1. Start the backend server:
    ```bash
    cd backend
    npm start
    ```
2. Start the frontend development server:
    ```bash
    cd ../frontend
    npm run dev
    ```
3. Open your browser and navigate to `http://localhost:5173` to view the application.
