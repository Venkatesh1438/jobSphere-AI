# JobSphere AI - Enterprise AI Recruiting Platform

JobSphere AI is a production-grade, AI-powered recruitment SaaS application designed for candidate assessment, resume parsing, match scoring, and candidate-recruiter interaction.

## Architecture

This project is organized as an enterprise monorepo:
* **`/backend`**: Python 3.12, Django 5, Django REST Framework, Simple JWT, Django Channels, MySQL, and Redis.
* **`/frontend`**: React 18.3.x, Vite, TypeScript, Tailwind CSS v3.4.x, React Router DOM, and React Query.
* **`/database`**: Database schema documents, Draw.io ER diagram, and setup guides.
* **`/docs`**: In-depth system design, API design patterns, and database specification sheets.

---

## Tech Stack

### Frontend
- **React**: 18.3.x (Ecosystem stability)
- **Vite**: Modern builder
- **TypeScript**: Typed safety
- **Tailwind CSS**: v3.4.x utility-first styling
- **React Query (TanStack)**: Server state synchronization
- **Framer Motion**: Premium micro-animations
- **Chart.js**: Hiring dashboards & recruiting funnel reports

### Backend
- **Python**: 3.12
- **Django**: 5.x REST Framework
- **Simple JWT**: JSON Web Token Authentication
- **MySQL**: Persistent relational data store
- **Django Channels**: WebSocket notifications & live chat
- **drf-spectacular**: Swagger / OpenAPI 3.0 generation

---

## Quick Start (with Docker Compose)

To spin up the entire application locally including the database, cache server, API backend, and web frontend:

```bash
docker-compose up --build
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000/api/](http://localhost:8000/api/)
- **Swagger Documentation**: [http://localhost:8000/api/schema/swagger-ui/](http://localhost:8000/api/schema/swagger-ui/)
- **Redoc Documentation**: [http://localhost:8000/api/schema/redoc/](http://localhost:8000/api/schema/redoc/)

For detailed developer guidelines, refer to [CONTRIBUTING.md](file:///c:/Users/venkatesh/Downloads/JobSpher-AI/CONTRIBUTING.md) and [architecture.md](file:///c:/Users/venkatesh/Downloads/JobSpher-AI/docs/architecture.md).
