COMP3133 - Full Stack Development course
Student Name: Nigar Ahmadova
Student ID - 101431281

# Employee Management System (GraphQL API)

## Project Overview
This is a GraphQL-based Employee Management System built using Node.js, Express, MongoDB, and GraphQL. It allows users to register, login, and manage employee records with CRUD operations.

## Features
 - User Registration & Login (with JWT authentication)  
 - CRUD Operations for Employees (Add, Update, Delete)  
 - Search Employees by ID, Designation, or Department  
 - Secure Password Storage using bcrypt  
 - Input Validation with express-validator  
 - GraphQL API Endpoints for Efficient Data Retrieval  
 - Tested with Postman and GraphiQL 


## Technologies Used
 - Node.js & Express.js - Backend framework
 - GraphQL - API query language
 - MongoDB & Mongoose - Database & ORM
 - bcrypt.js - Password encryption
 - jsonwebtoken (JWT) - Authentication
 - express-validator - Input validation
 - Postman - API Testing

## API Workflow & Usage 
 - Register a New User (Mutation: register)
 - Login with User Credentials (Mutation: login)
 - Copy the JWT Token from the response.
 - Use the Token for Authentication
 - Add it as a Bearer Token in Postman or GraphiQL.
 - Perform CRUD Operations on Employees
 - Add a new employee (addEmployee Mutation)
 - Get all employees (employees Query)
 - Search employee by ID (employeeById Query)
 - Search employee by Department/Designation (employeesByDesignationOrDepartment Query)
 - Update employee details (updateEmployee Mutation)
 - Delete an employee (deleteEmployee Mutation)
 - Verify all operations using Postman or GraphiQL.

## Installation Guide
 - Step 1: Clone the Repository: https://github.com/Nigar0826/COMP3133_101431281_Assignment1 
 - Step 2: Install Dependencies: npm install
 - Step 3: Set Up Environment Variables
 - Step 3: Set up environment variables: 
    > Start MongoDB and add mongodb connection string inside the .env file
    > Add PORT=5000 inside the .env file
    > Start the server: node server.js or nodemon server.js
    > Open the application: http://localhost:5000
 - Step 4: Run the Server: npm start

## Server runs at http://localhost:5000/graphql

## Authentication
 - JWT-based authentication is used for user login.
 - Authorization Header is required for certain operations:
    > Key: Authorization
    > Value: Bearer <your_JWT_token>

## Project Structure: 
📁 COMP3133_101431281_Assignment1
│── 📁 config
│   ├── db.js (MongoDB Connection)
│
│── 📁 graphql
│   ├── schema.js (GraphQL Schema & Resolvers)
│
│── 📁 models
│   ├── Employee.js (Employee Model)
│   ├── User.js (User Model)
│
│── 📁 docs
│   ├── sample-user.json (Sample User Data)
│   ├── PostmanAPICollection.json (Postman Collection)
│
│── .env (Environment Variables)
|── .gitignore 
│── server.js (Entry Point)
│── README.md (Project Documentation)

# API Endpoints (GraphQL)
Import Postman Collection: The collection file is inside the docs folder (COMP3133_Postman_Collection.json).
## User APIs
 - Register User (mutation  )
mutation {
  register(username: "Nigar", email: "nigar@georgebrown.ca", password: "password1") {
    id
    username
    email
  }
}

 - Login User (query)
mutation {
  login(email: "nigar@georgebrown.ca", password: "password1")
}

## Employee APIs
 - Get All Employees (query)
{
employees {
    id
    first_name
    last_name
    email
  }
}

 - Get Employee by ID (query)
{
employeeById(id: "EMPLOYEE_ID") {
    first_name
    last_name
    email
  }
}

 - Search Employee by Designation or Department (query)
{
employeesByDesignationOrDepartment(department: "Sales") {
    first_name
    last_name
    email
  }
}

 - Add New Employee (mutation)
mutation {
  addEmployee(first_name: "Moe", last_name: "Alan", email: "moe.alan@bmg.ca", gender: "Male", designation: "Product Support Manager", salary: 150000, date_of_joining: "2024-02-03", department: "Sales") {
    id
    first_name
    last_name
    email
  }
}

 - Update Employee by ID (mutation)
mutation {
  updateEmployee(id: "EMPLOYEE_ID", salary: 155000) {
    first_name
    last_name
    salary
  }
}

 - Delete Employee by ID (mutation)
mutation {
  deleteEmployee(id: "EMPLOYEE_ID") {
    first_name
    last_name
  }
}

## Render Deployment Link: 
https://comp3133-101431281-assignment1.onrender.com/graphql

## GitHub Repository Link: 
https://github.com/Nigar0826/COMP3133_101431281_Assignment1

