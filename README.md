# 🚀 JobBoard – Enterprise AI Recruitment Platform

![React](https://img.shields.io/badge/React-19-blue)
![Django](https://img.shields.io/badge/Django-5-green)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Python](https://img.shields.io/badge/Python-yellow)
![MySQL](https://img.shields.io/badge/MySQL-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📌 About JobBoard

JobBoard is a modern full-stack recruitment platform built using Django, React, TypeScript, and MySQL.

It enables recruiters to publish job opportunities while allowing candidates to discover companies, search jobs, submit applications, and manage their career journey through a responsive dashboard.

The application follows a production-oriented architecture with secure JWT authentication, role-based authorization, responsive UI components, lazy-loaded routes, API-driven data management, and an attractive showcase mode for first-time visitors.

---

## ✨ Features

- Candidate Registration
- Candidate Login
- JWT Authentication
- Browse Companies
- Browse Jobs
- Advanced Job Search
- Job Details
- Apply for Jobs
- Withdraw Applications
- Candidate Dashboard
- Profile Management
- Notifications

### Recruiter 

- Recruiter Registration
- Company Management
- Post Jobs
- Edit Jobs
- Publish Jobs
- Manage Applicants
- Recruiter Dashboard
- Notifications

---

## Platform

- Responsive UI
- React Query
- Lazy Loading
- Animated Statistics
- Toast Notifications
- Global Search
- Landing Page Showcase
- Role-Based Routing
- Protected Routes
- Error Handling

## Technology Stack

| Frontend     | Backend               | Database             | Tools         |
| ------------ | --------------------- | -------------------- | ------------- |
| React 19     | Django                | MySQL                | Git           |
| TypeScript   | Django REST Framework | SQLite (Development) | GitHub        |
| Vite         | JWT Authentication    | PostgreSQL Ready     | Vercel        |
| Tailwind CSS | REST APIs             |                      | Railway       |
| React Query  | Python                |                      | Framer Motion |

## Folder Structure

JobBoard
│
├── backend
│   ├── apps
│   ├── config
│   ├── manage.py
│
├── frontend
│   ├── src
│   │
│   ├── api
│   ├── assets
│   ├── components
│   ├── context
│   ├── hooks
│   ├── layout
│   ├── pages
│   ├── routes
│   └── services
│
├── docs
├── database
└── docker-compose.yml

## Installation Guide

## Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```
## Frontend

```bash
cd frontend

npm install

npm run dev
```
##Environmental Variables

Backend

SECRET_KEY=

DEBUG=True

DB_NAME=

DB_USER=

DB_PASSWORD=

DB_HOST=

DB_PORT=

Frontend

VITE_API_BASE_URL=http://localhost:8000/api

## Authentication Flow

Candidate

↓

Register

↓

Login

↓

JWT Token

↓

Protected Routes

↓

Dashboard

↓

Apply Job

Similarly for recruiters

Recruiter

↓

Register

↓

Login

↓

Create Company

↓

Post Jobs

↓

Manage Applicants

## Database

User

Company

Job

Application

Notification

## Future Enhancements

Email Verification

Resume Parsing

AI Resume Matching

Interview Scheduling

Chat System

Video Interviews

Admin Analytics

Company Reviews

Saved Jobs

Dark Mode

## License

MIT License

## Author 

Developed by

Venkatesh Yallabilli


```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000/api/](http://localhost:8000/api/)
- **Swagger Documentation**: [http://localhost:8000/api/schema/swagger-ui/](http://localhost:8000/api/schema/swagger-ui/)
- **Redoc Documentation**: [http://localhost:8000/api/schema/redoc/](http://localhost:8000/api/schema/redoc/)

For detailed developer guidelines, refer to [CONTRIBUTING.md](file:///c:/Users/venkatesh/Downloads/JobSpher-AI/CONTRIBUTING.md) and [architecture.md](file:///c:/Users/venkatesh/Downloads/JobSpher-AI/docs/architecture.md).
