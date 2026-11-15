# autofix-garage-api
AutoFix Garage Management REST API

Student Name: PATEL MANMATH
Registration Number: 252U1R8072

# AutoFix Garage Management API

## 1. Project Overview
AutoFix Garage Management API is a REST API developed using Node.js, Express.js and SQLite. It helps manage garage mechanics, service bays and their assignments.

## 2. Technologies Used
- Node.js
- Express.js
- SQLite Database
- Postman
- GitHub
- Render (deployment attempted)

## 3. Project Objectives
- Manage garage mechanics.
- Add, view, update and delete service bays.
- Manage mechanic assignments.
- Search bays using vehicle names.
- Validate user inputs.
- Limit each mechanic to a maximum of 3 active assignments.

## 4. Database Design

The project uses three tables:

**Mechanics**
- id
- name

**Bays**
- id
- name
- vehicle

**Assignments**
- id
- mechanic_id
- bay_id
- status

## 5. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/mechanics | Get all mechanics |
| POST | /api/mechanics | Add a mechanic |
| GET | /api/bays | Get all bays |
| GET | /api/bays/:id | Get one bay |
| POST | /api/bays | Add a bay |
| PUT | /api/bays/:id | Update a bay |
| DELETE | /api/bays/:id | Delete a bay |
| GET | /api/assignments | Get assignments using JOIN |
| POST | /api/assignments | Create an assignment |
| PATCH | /api/assignments/:id/return | Return an assignment |

## 6. Validation and Search
The API checks required input fields before inserting records. It also supports searching bays by vehicle name using query parameters.

Example:

`/api/bays?vehicle=Swift`

## 7. Special Business Rule
Each mechanic can have a maximum of 3 active assignments.

- First assignment: 201 Created
- Second assignment: 201 Created
- Third assignment: 201 Created
- Fourth assignment: 409 Conflict
- After returning an assignment, another assignment can be created.

## 8. How to Run the Project

1. Clone the GitHub repository.
2. Install dependencies:

`npm install`

3. Start the server:

`npm start`

4. Open:

`http://localhost:3000`

## 9. Expected Output

Welcome message:

`Welcome to AutoFix Garage API`

Mechanics API:

`GET /api/mechanics`

Returns mechanic information in JSON format.

## 10. Conclusion

The AutoFix Garage Management API demonstrates the use of RESTful API development, database management, CRUD operations, input validation, search functionality and business rules using Node.js, Express.js and SQLite.
