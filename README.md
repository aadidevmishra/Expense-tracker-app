# Simple Expense Tracker

A full-stack web application for tracking daily expenses, built with Node.js, Express, and MongoDB. This was a project to demonstrate full-stack development skills, including API creation, database management, and user authentication.

## Features

* User registration and login using JWT (JSON Web Tokens).
* Create, Read, and Delete personal expenses.
* A clean, responsive frontend built with HTML, CSS, and vanilla JavaScript.
* RESTful API for handling all data operations.

## Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JWT, bcryptjs

## How to Run Locally

1.  Clone the repository to your computer.
2.  Run `npm install` in the terminal to install all required dependencies.
3.  Create a `.env` file in the root directory and add the following variables:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key
    ```
4.  Run `node index.js` to start the server.
