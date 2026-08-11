# TaskFlow — Task Management App

A full-stack task management application built with React, Node.js, PostgreSQL, and JWT authentication.

## Live Demo
(https://task-manager-eta-ashen.vercel.app/login)

## Features
- User registration and login with JWT authentication
- Create, update, and delete tasks
- Kanban-style board — To Do, In Progress, Done
- Overall progress tracking with percentage
- Update password from account settings
- Clean responsive UI with Tailwind CSS

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router DOM

**Backend:** Node.js, Express.js, PostgreSQL, JWT, bcryptjs

## Getting Started

### Backend Setup
```bash
cd server
npm install
node index.js
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

> Note: Create a `.env` file in the server folder with your database credentials before running.

## Folder Structure
task-manager/
├── client/
│ └── src/
│ ├── pages/
│ │ ├── Login.tsx
│ │ └── Dashboard.tsx
│ ├── App.tsx
│ └── main.tsx
└── server/
├── routes/
│ ├── auth.js
│ └── tasks.js
├── db.js
└── index.js


## Author
**Natasha Najib** — Full Stack Developer
- LinkedIn: [linkedin.com/in/natasha-najib](https://linkedin.com/in/natasha-najib)
- Portfolio: [discovery-connect.com](https://discovery-connect.com)