# JobSphere AI - Database Documentation

This folder contains the database schema specifications, design decisions, and relational diagrams for the JobSphere AI recruitment application.

## Schema ER Diagram

The database uses a relational MySQL structure to store core transactional data, including candidates, recruiters, jobs, and assessments.

* **Diagram File**: `ER_Diagram.png` (Visual raster format)
* **Editable Source**: `ER_Diagram.drawio` (Open in Draw.io or diagrams.net to make edits)

---

## Relational Entity Mapping

The database schema is organized around the following primary entities:

1. **User / Profile**: Base authentication user and role mapping (Admin, Candidate, Recruiter).
2. **Job**: Posted positions containing description, requirements, status, and associated Company.
3. **Application**: Linking Candidate profiles to specific Job postings. Track status (Applied, Interviewing, Offered, Rejected).
4. **Assessment**: AI-generated testing parameters and candidate answers.
5. **AI_Analysis**: Resume parser reports, match scoring indexes, and automated screening logs.
6. **Message**: Real-time message exchange between candidates and recruiters.

---

## Schema Maintenance via Django Migrations

Instead of manual SQL files, the database schema is generated and modified programmatically through Django's migration engine.

### Apply Migrations
To verify and run all pending schema modifications:
```bash
python manage.py migrate
```

### Create New Schema Changes
After updating model fields in any django app's `models.py` file, generate a new migration file:
```bash
python manage.py makemigrations
```
