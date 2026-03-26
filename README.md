#  Task Scheduler Web App

A full-stack Task Management System built using **React, Node.js, Express, and MongoDB**.
This application allows users to efficiently manage their daily tasks with features like authentication, filtering, analytics, and pagination.

---

##  Live Features

###  Authentication

* User Signup & Login
* JWT-based authentication
* Protected routes

###  Task Management

* Create tasks
* View all tasks
* Update tasks (Edit / Mark as Done)
* Delete tasks

###  Filtering & Search

* Filter by task status (Todo / In Progress / Done)
* Filter by priority (Low / Medium / High)
* Search tasks by title

###  Analytics Dashboard

* Total tasks
* Completed tasks
* Pending tasks
* Completion percentage

### Advanced Features

* Pagination (Next / Previous)
* Sorting (Due Date / Priority)
* Responsive UI
* Dark Mode 
* Toast notifications
* Loading & error states

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* Bootstrap (CSS)
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Authentication

* JWT (JSON Web Token)
* bcrypt.js

---

## Project Structure

```
TASK-MANAGER/
│
├── backend/
│   ├── MODELS/
│   ├── ROUTES/
│   ├── CONTROLLERS/
│   ├── MIDDLEWARE/
│   └── server.js
│
├── frontend/
│   ├── src/
│   └── pages/
│
└── README.md
```

---

##  Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/AJeshwanth/task-scheduler.git
cd task-scheduler
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

##  API Endpoints

### Auth Routes

* POST `/api/auth/signup`
* POST `/api/auth/login`

### Task Routes

* GET `/api/tasks`
* POST `/api/tasks`
* PUT `/api/tasks/:id`
* DELETE `/api/tasks/:id`
* GET `/api/tasks/analytics`

---


---

##  Key Highlights

* Clean and scalable folder structure
* Secure authentication using JWT
* Efficient MongoDB queries with filtering & pagination
* Modern UI with responsive design
* Real-world full-stack project

---


