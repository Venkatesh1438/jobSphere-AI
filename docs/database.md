# JobSphere AI - Database Specification

This document details the database schema configuration, column mapping, index designs, and optimization decisions for JobSphere AI.

---

## 1. Table Definitions

### Table: `users`
Stores user authentication details and role indicators.

| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Default: UUIDv4 | Unique user ID. |
| `email` | VARCHAR(254) | Unique, Indexed | User email address. |
| `password` | VARCHAR(128) | Not Null | PBKDF2 password hash. |
| `role` | VARCHAR(20) | Not Null | ENUM: `'admin'`, `'candidate'`, `'recruiter'`. |
| `is_active` | BOOLEAN | Default: True | Authentication status indicator. |
| `created_at` | DATETIME | Indexed | Audit creation timestamp. |
| `updated_at` | DATETIME | Not Null | Audit update timestamp. |

### Table: `companies`
Stores company details managed by Recruiters.

| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Default: UUIDv4 | Unique company identifier. |
| `name` | VARCHAR(255) | Not Null | Legal company name. |
| `logo_url` | VARCHAR(500) | Nullable | Cloudinary logo link. |
| `website` | VARCHAR(200) | Nullable | Corporate URL. |
| `created_at` | DATETIME | Indexed | Creation timestamp. |

### Table: `jobs`
Stores job postings published by Recruiters.

| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Default: UUIDv4 | Unique job ID. |
| `company_id` | UUID | FK (companies.id), Cascade | Owner company. |
| `title` | VARCHAR(255) | Not Null | Job position title. |
| `description` | TEXT | Not Null | Full job requirements spec. |
| `status` | VARCHAR(20) | Not Null, Indexed | ENUM: `'draft'`, `'open'`, `'closed'`. |
| `created_at` | DATETIME | Indexed | Job post timestamp. |

### Table: `applications`
Connects candidate profiles to job postings.

| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Default: UUIDv4 | Application identifier. |
| `job_id` | UUID | FK (jobs.id), Cascade | Job applied to. |
| `candidate_id` | UUID | FK (users.id), Cascade | Applicant user. |
| `status` | VARCHAR(20) | Not Null, Indexed | ENUM: `'applied'`, `'screening'`, `'interviewing'`, `'offered'`, `'rejected'`. |
| `applied_at` | DATETIME | Indexed | Submission timestamp. |

### Table: `ai_analyses`
Holds parsed resumes and AI match scoring evaluations.

| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Default: UUIDv4 | Analysis identifier. |
| `application_id` | UUID | FK (applications.id), Cascade | Target application. |
| `match_score` | DECIMAL(5,2) | Not Null, Indexed | Score percentage (0.00 - 100.00). |
| `resume_parsed_text` | LONGTEXT | Nullable | Extracted resume markdown content. |
| `ai_feedback` | TEXT | Nullable | Recommendation explanation logs. |
| `evaluated_at` | DATETIME | Not Null | Assessment completion time. |

---

## 2. Index Optimization Strategy

To ensure sub-second response times across large datasets, we define the following composite and single indexes:

1. **Job Searching Optimization**:
   - Index on `jobs(status, created_at DESC)`: Speeds up public job listing searches.
2. **Application Status Funnel**:
   - Index on `applications(status, applied_at DESC)`: Accelerates candidate pipeline dashboard filters.
3. **AI Score Queries**:
   - Index on `ai_analyses(match_score DESC)`: Allows rapid sorting of applicant lists by AI-matched compatibility.
