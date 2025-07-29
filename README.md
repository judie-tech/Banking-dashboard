# Banking Dashboard

This project is a full-stack Banking Dashboard featuring user authentication, account balance tracking, transaction history, and money transfers. The frontend is built with React, and the backend with Node.js/Express.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Decisions Made](#decisions-made)
- [Contact](#contact)

## Project Overview

The Banking Dashboard aims to provide a comprehensive platform for managing banking operations. It includes functionalities for administrators to view and manage users, and for users to monitor their accounts, view transaction history, and perform money transfers.

## Features

As per the project requirements, the following features have been implemented:

- **User List (Admin Feature):**
  - Fetch and display user data (name, email, account balance, account type).
  - Highlight rows in red if account balance is below KES 100.
- **Dashboard Overview:**
  - Account Summary: Total balance, recent transactions (last 5), quick actions.
  - Visual Charts: Integration of Chart.js for weekly/monthly spending trends.
  - Quick Stats: Cards for "Total Deposits," "Total Withdrawals," and "Pending Transactions."
- **User Details Page:**
  - Navigation to `/users/:id` with full user details (address, transaction history).
  - Paginated table of all user transactions.
- **Money Transfer (Core Banking Feature):**
  - Transfer form with fields for sender, receiver, amount, and notes.
  - Validation for sufficient balance, valid account numbers.
  - Real-time balance updates.
  - Transaction confirmation (UI popup).
- **Filter & Sort Transaction History:**
  - Filtering by date range, transaction type (debit/credit), and amount.
  - Option to export history as CSV/PDF.
- **Search & Pagination:**
  - Search users by name, email, or account number.
  - Pagination with 10 items per page and page info ("Page X of Y").
- **Responsive Design:**
  - Seamlessly adapts to various devices and screen sizes.
- **Error Handling:**
  - Robust error handling mechanisms for API request errors.
- **Unit Testing:**
  - Basic unit tests for components and services.

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js, Express
- **Database:** (Placeholder - specify if you've used MySQL/PostgreSQL in your implementation)
- **Charts:** Chart.js

## Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (LTS version recommended)
- npm (comes with Node.js) or Yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/judie-tech/Banking-dashboard.git](https://github.com/judie-tech/Banking-dashboard.git)
    cd Banking-dashboard
    ```

2.  **Install backend dependencies:**

    Navigate into the `server` directory and install the required packages:

    ```bash
    cd server
    npm install
    # or yarn install
    ```

3.  **Install frontend dependencies:**

    Navigate into the `client` directory and install the required packages:

    ```bash
    cd ../client
    npm install
    # or yarn install
    ```

### Running the Application

1.  **Start the backend server:**

    From the `server` directory:

    ```bash
    npm start
    # or yarn start
    ```

    The backend server will run on `http://localhost:3000`.

2.  **Start the frontend development server:**

    From the `client` directory:

    ```bash
    npm start
    # or yarn start
    ```

    The frontend application will typically open in your browser at `http://localhost:3001` (or another available port).

## Project Structure

The project is divided into two main folders:

- `client/`: Contains the React frontend application.
- `server/`: Contains the Node.js/Express backend API.

## Decisions Made

Currently, there are no additional features beyond the core requirements. All functionalities are implemented as specified in the project brief.
