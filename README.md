# Kovács Bt. - Work Hour Tracker System

**Web Technologies 2 Assignment**

This project is a comprehensive time-tracking and management system developed for a logistics and delivery company ("Kovács Bt."). It consists of a unified Angular frontend with role-based access control and a Node.js backend.

The system is divided into two main roles:
- **Admin Dashboard**: For registering new employees, managing accounts, viewing detailed weekly and all-time work statistics, and sending personalized messages to workers' dashboards.
- **Employee Dashboard**: For logging daily work hours (with automatic duration calculation), categorized by task type (Accounting, Delivery, Goods Receipt, Administration, Other), and viewing personal weekly records and admin messages.

The backend uses **Express.js** + **MongoDB**, communicating via a REST API.

---

## Tech stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: Angular 17+, Angular Material, SCSS, RxJS
- **Features**: Role-based routing, Dynamic Dark Mode, LocalStorage session handling, RegEx validations

---

## Prerequisites

- Node.js (v18 or later recommended)
- MongoDB (local installation or MongoDB Atlas cluster)
- Angular CLI (`npm install -g @angular/cli`)

---

## Installation

1. Clone the repository to your local machine.
2. Navigate to the project directories and install the dependencies:

    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install

---

## Environment Setup & Database

**Start MongoDB** (if running locally):
    mongod

**Database Connection**:
Make sure your MongoDB connection string is properly set up in your backend configuration (e.g., in `.env` or the main server file).

*Note: To access the Admin Dashboard for the first time, you may need to manually set the `szerepkor: 'admin'` (or `isAdmin: true`) flag for your first registered user directly in the MongoDB database.*

---

## Starting the applications

### 1. Backend (REST API)

Open a terminal and start the Express server:

    cd backend
    node index.js 

The backend API is running at: `http://localhost:3000` *(or your configured port)*.

### 2. Frontend (Angular App)

Open a new terminal and start the Angular development server:

    cd frontend
    ng serve

The web application is available at: `http://localhost:4200`

---

## Usage

- **Dark Mode**: The application supports a fully integrated dark theme. You can toggle it using the icon in the top right corner. The preference is saved in local storage.
- **As an Admin**: Log in with an admin account. Use the left column to register new employees (with strict password validation). Use the right column to navigate between weeks, review logged hours, and send messages to specific employees.
- **As an Employee**: Log in with the credentials provided by the admin. Select a date, enter a start and end time (the system calculates the worked hours automatically), choose a task category, and save. Check the bottom of the dashboard for messages from the admin.
