# Developer Hiring & Assessment Platform

A full-stack recruitment and technical assessment platform that allows companies to create jobs, manage candidates, conduct coding/MCQ assessments, evaluate submissions, schedule interviews, and track the complete hiring lifecycle.

## 1. Project Overview

The platform is designed as a mini combination of:

- Applicant Tracking System (ATS)
- HackerRank-style assessment platform
- Interview management system

### Main Hiring Flow

```text
Company / Recruiter
        |
        v
    Create Job
        |
        v
    Publish Job
        |
        v
 Candidate Applies
        |
        v
 Assessment Assigned
        |
        v
 Candidate Takes Assessment
        |
        +------------------+
        |                  |
       MCQ              Coding
        |                  |
        +--------+---------+
                 |
                 v
          Automatic Evaluation
                 |
                 v
             Shortlist
                 |
                 v
        Schedule Interview
                 |
                 v
         Interview Feedback
                 |
                 v
       Selected / Rejected
```

---

# 2. Objectives

The main objectives of this project are:

1. Build a production-style full-stack application.
2. Practice React and TypeScript on the frontend.
3. Build scalable REST APIs using Node.js and Express.
4. Learn MySQL database design with Sequelize ORM.
5. Implement authentication and permission-based RBAC.
6. Build an online assessment system.
7. Implement MCQ and coding-question evaluation.
8. Learn real-time communication using Socket.IO.
9. Learn Redis caching and rate limiting.
10. Learn background processing using queues/workers.
11. Practice file uploads and email notifications.
12. Containerize and deploy the application using Docker.

---

# 3. User Roles

The system will have three major roles.

## Candidate

A candidate can:

- Register and login
- Create/update profile
- Upload resume
- Search jobs
- Filter jobs
- Apply for jobs
- Track applications
- Take assessments
- Answer MCQ questions
- Solve coding questions
- Submit assessments
- View assessment results
- View interview schedules
- Receive notifications

## Recruiter

A recruiter can:

- Manage company profile
- Create jobs
- Update jobs
- Publish/close jobs
- View applications
- Shortlist candidates
- Create assessments
- Create questions
- Configure test cases
- Assign assessments
- Review candidate results
- Schedule interviews
- Add interview feedback
- Change application status

## Admin

An admin can:

- Manage users
- Manage companies
- Manage recruiters
- Manage candidates
- View platform statistics
- Manage reported content
- View audit logs

---

# 4. Core Modules

```text
Authentication
User Management
Company Management
Job Management
Application Management
Assessment Management
Question Management
Coding Evaluation
Interview Management
Notification Management
Audit Logging
Admin Dashboard
```

---

# 5. Authentication

The authentication system should support:

- Registration
- Login
- Logout
- Password hashing
- Access token
- Refresh token
- Forgot password
- Reset password
- Email verification
- Role-based authorization

### Authentication Flow

```text
User
 |
 | Login
 v
Express API
 |
 v
Validate Credentials
 |
 v
Generate Access Token
 |
 v
Generate Refresh Token
 |
 v
Return Authentication Response
```

Recommended technologies:

```text
JWT
bcrypt / Argon2
HTTP-only cookies
Zod validation
```

---

# 6. Role-Based Access Control

Use permission-based authorization instead of checking roles directly throughout the application.

Example permissions:

```text
job:create
job:update
job:delete
job:view

assessment:create
assessment:update
assessment:publish

candidate:view
candidate:shortlist

interview:create
interview:update
interview:cancel
```

### RBAC Flow

```text
User
  |
  v
Role
  |
  v
Permissions
  |
  v
Authorization Middleware
  |
  v
Controller
```

Example:

```text
Recruiter
   |
   +-- job:create
   +-- job:update
   +-- job:view
   +-- assessment:create
   +-- candidate:view
   +-- interview:create
```

---

# 7. Company Management

Recruiters belong to a company.

Company information:

```text
Company
- id
- name
- description
- website
- logo
- industry
- location
- created_at
- updated_at
```

A company can have multiple recruiters and multiple jobs.

---

# 8. Job Management

Recruiters can create jobs.

### Job Information

```text
Job
- id
- company_id
- title
- description
- location
- employment_type
- experience_min
- experience_max
- salary_min
- salary_max
- status
- created_at
- updated_at
```

### Job Status

```text
DRAFT
PUBLISHED
CLOSED
ARCHIVED
```

### Job Skills

Example:

```text
Frontend Developer

Skills:
- React
- JavaScript
- TypeScript
- HTML
- CSS
```

Use a separate `job_skills` table if skills need to be queried independently.

---

# 9. Candidate Profile

Candidate profile contains:

```text
Candidate
- id
- user_id
- full_name
- phone
- location
- summary
- experience_years
- github_url
- linkedin_url
- portfolio_url
- resume_url
```

Candidates can upload their resume.

Recommended technologies:

```text
Multer
Cloudinary / AWS S3
```

---

# 10. Job Application

Candidates can apply for published jobs.

### Application

```text
Application
- id
- candidate_id
- job_id
- status
- applied_at
- updated_at
```

### Application Status

```text
APPLIED
SCREENING
ASSESSMENT
SHORTLISTED
INTERVIEW
SELECTED
REJECTED
WITHDRAWN
```

### Application Flow

```text
Candidate
   |
   v
Apply
   |
   v
APPLIED
   |
   v
SCREENING
   |
   v
ASSESSMENT
   |
   v
SHORTLISTED
   |
   v
INTERVIEW
   |
   +---------> SELECTED
   |
   +---------> REJECTED
```

The backend should validate allowed state transitions.

---

# 11. Assessment System

Recruiters can create assessments for jobs.

Example:

```text
Frontend Developer Assessment

Duration: 60 minutes

JavaScript: 5 questions
React: 4 questions
DSA: 3 questions
SQL: 3 questions

Total: 15 questions
```

### Assessment

```text
Assessment
- id
- job_id
- title
- description
- duration_minutes
- total_marks
- passing_marks
- status
- created_by
- created_at
- updated_at
```

### Assessment Status

```text
DRAFT
PUBLISHED
CLOSED
```

---

# 12. Question Types

The platform should support:

```text
MCQ
CODING
SHORT_ANSWER
```

For the initial MVP, implement:

```text
MCQ
CODING
```

---

# 13. MCQ Questions

Example:

```text
Question:

Which JavaScript method creates a new array?

A. forEach()
B. map()
C. filter()
D. reduce()

Correct Answer:
B
```

### Question

```text
Question
- id
- assessment_id
- type
- title
- description
- difficulty
- marks
```

### Question Options

```text
QuestionOption
- id
- question_id
- option_text
- is_correct
```

---

# 14. Coding Questions

Example:

```text
Problem: Two Sum

Given an array of integers nums and an integer target,
return indices of the two numbers such that they add up
to target.

Input:
[2, 7, 11, 15]
9

Expected Output:
[0, 1]
```

### Coding Question

```text
Question
- id
- type = CODING
- title
- description
- constraints
- input_format
- output_format
- difficulty
- marks
```

---

# 15. Test Cases

Each coding question can have multiple test cases.

```text
TestCase
- id
- question_id
- input
- expected_output
- is_hidden
```

Example:

```text
Public Test Case

Input:
[2,7,11,15]
9

Expected:
[0,1]
```

Hidden test cases should not be exposed to candidates.

---

# 16. Code Submission

Candidates submit code through the coding editor.

### Code Submission

```text
CodeSubmission
- id
- attempt_id
- question_id
- language
- code
- status
- score
- execution_time
- memory_used
- submitted_at
```

Possible statuses:

```text
QUEUED
RUNNING
PASSED
FAILED
TIME_LIMIT
MEMORY_LIMIT
ERROR
```

---

# 17. Code Execution Architecture

Do not execute untrusted candidate code directly inside the main Node.js API process.

Recommended architecture:

```text
Candidate
    |
    v
Node.js API
    |
    v
Queue
    |
    v
Code Execution Worker
    |
    v
Isolated Execution Environment
    |
    v
Run Test Cases
    |
    v
Save Result
    |
    v
Notify Candidate
```

For the first version, support only one programming language.

Later, explore:

```text
Docker isolation
CPU limits
Memory limits
Execution timeout
Process isolation
```

---

# 18. Assessment Attempt

When a candidate starts an assessment, create an attempt.

```text
AssessmentAttempt
- id
- candidate_id
- assessment_id
- started_at
- expires_at
- submitted_at
- status
- score
```

### Attempt Status

```text
STARTED
SUBMITTED
EXPIRED
EVALUATED
```

---

# 19. Assessment Timer

The backend must be the source of truth for the timer.

Example:

```text
Assessment duration = 60 minutes

started_at = 10:00
expires_at = 11:00
```

The frontend displays:

```text
59:32
```

But the backend validates:

```text
current_time > expires_at
```

This prevents users from manipulating the client-side timer.

---

# 20. Candidate Answers

```text
CandidateAnswer
- id
- attempt_id
- question_id
- answer
- is_correct
- marks_obtained
- submitted_at
```

For MCQs, the system automatically checks the selected answer.

---

# 21. Automatic Evaluation

Example:

```text
Assessment
--------------------
JavaScript       5 questions
React            4 questions
DSA              3 questions
SQL              3 questions

Total             15
```

Candidate result:

```text
JavaScript        85%
React             75%
DSA               60%
SQL               90%

Overall            78%
```

---

# 22. Recruiter Dashboard

Dashboard should display:

```text
Candidates       342
Applications     128
Assessments       74
Shortlisted       18
Interviews         9
```

Recruiters can view:

```text
Candidate
Resume
Skills
Application
Assessment Score
Coding Performance
Interview History
```

---

# 23. Candidate Dashboard

Candidate dashboard:

```text
Applications
-------------------------
Frontend Developer
Status: Assessment

Backend Developer
Status: Interview

Full Stack Developer
Status: Rejected
```

Assessment section:

```text
Available Assessments
-------------------------
Frontend Assessment
Duration: 60 min
Questions: 15

[Start Assessment]
```

---

# 24. Interview Management

Recruiters can schedule interviews.

```text
Interview
- id
- application_id
- interviewer_id
- scheduled_at
- duration
- meeting_link
- status
- feedback
- created_at
- updated_at
```

### Interview Status

```text
SCHEDULED
COMPLETED
CANCELLED
RESCHEDULED
```

---

# 25. Interview Feedback

Recruiters/interviewers can submit:

```text
Technical Skills: 4/5
Communication: 3/5
Problem Solving: 4/5
```

And written feedback:

```text
Strong JavaScript fundamentals.
Needs improvement in system design.
```

Possible decision:

```text
PASS
REJECT
NEXT_ROUND
```

---

# 26. Notifications

Notifications should be generated for important events.

Examples:

```text
Application received
Assessment assigned
Assessment deadline reminder
Assessment submitted
Interview scheduled
Interview rescheduled
Application status changed
```

### Notification

```text
Notification
- id
- user_id
- type
- title
- message
- is_read
- created_at
```

---

# 27. Real-Time Communication

Use Socket.IO for real-time events.

Example:

```text
Recruiter schedules interview
        |
        v
Node.js
        |
        v
Socket.IO
        |
        v
Candidate Browser
        |
        v
Notification
```

Other real-time events:

```text
Assessment submitted
Interview scheduled
Application status changed
Recruiter dashboard updates
```

---

# 28. Email Notifications

Use Nodemailer or an email provider.

Examples:

```text
Application confirmation
Assessment invitation
Assessment reminder
Assessment result
Interview invitation
Interview rescheduling
Final application status
```

---

# 29. Redis

Redis should be added for actual use cases.

## Rate Limiting

Example:

```text
POST /auth/login

5 attempts / minute / IP
```

## Caching

Potential cached endpoints:

```text
GET /jobs
GET /jobs/:id
GET /companies/:id
```

## Temporary Data

Redis can also be used for:

```text
Assessment session data
OTP expiration
Rate-limit counters
Short-lived tokens
```

---

# 30. Background Jobs

Use a queue such as BullMQ with Redis.

Good use cases:

```text
Send email
Evaluate coding submission
Send assessment reminders
Generate reports
Clean expired assessment attempts
```

### Example

```text
Candidate submits code
        |
        v
API returns quickly
        |
        v
BullMQ Queue
        |
        v
Worker
        |
        v
Evaluate Code
        |
        v
Save Result
```

---

# 31. Audit Logs

Important recruiter/admin actions should be recorded.

```text
AuditLog
- id
- user_id
- action
- entity
- entity_id
- old_value
- new_value
- ip_address
- created_at
```

Example:

```text
Recruiter changed application status

Candidate:
Rajdip Das

Old:
ASSESSMENT

New:
SHORTLISTED
```

---

# 32. Database Design

Initial tables:

```text
users
companies
candidate_profiles
recruiter_profiles

jobs
job_skills
applications

assessments
assessment_questions
questions
question_options
test_cases

assessment_attempts
candidate_answers
code_submissions

interviews
interview_feedback

notifications
audit_logs
```

### Main Relationships

```text
Company
   |
   +---- Jobs
           |
           +---- Applications
                    |
                    +---- Candidate


Job
 |
 +---- Assessment
          |
          +---- Questions
                   |
                   +---- Test Cases
```

---

# 33. Recommended Tech Stack

## Frontend

```text
React
TypeScript
React Router
TanStack Query
React Hook Form
Zod
Tailwind CSS
Axios
Socket.IO Client
Monaco Editor
```

## Backend

```text
Node.js
Express
TypeScript
Sequelize
MySQL
JWT
Zod
Socket.IO
Multer
Nodemailer
```

## Advanced

```text
Redis
BullMQ
Docker
AWS
GitHub Actions
Nginx
```

---

# 34. Backend Folder Structure

```text
backend/
│
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── companies/
│   │   ├── jobs/
│   │   ├── applications/
│   │   ├── assessments/
│   │   ├── questions/
│   │   ├── submissions/
│   │   ├── interviews/
│   │   └── notifications/
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── database/
│   │   ├── models/
│   │   ├── migrations/
│   │   └── seeders/
│   │
│   ├── queues/
│   ├── workers/
│   ├── sockets/
│   ├── utils/
│   ├── routes/
│   ├── app.ts
│   └── server.ts
│
├── package.json
├── tsconfig.json
└── Dockerfile
```

---

# 35. Frontend Folder Structure

```text
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── auth/
│   │   ├── candidate/
│   │   ├── recruiter/
│   │   └── admin/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── jobs/
│   │   ├── applications/
│   │   ├── assessments/
│   │   ├── interviews/
│   │   └── notifications/
│   │
│   ├── hooks/
│   ├── services/
│   ├── api/
│   ├── types/
│   ├── utils/
│   ├── routes/
│   ├── layouts/
│   └── main.tsx
│
├── package.json
└── tsconfig.json
```

---

# 36. Development Roadmap

Build the project incrementally.

## Phase 1 — Project Setup

- Create React + TypeScript application
- Create Node + Express + TypeScript server
- Configure MySQL
- Configure Sequelize
- Configure environment variables
- Setup Git repository
- Setup basic folder structure

## Phase 2 — Authentication

- Registration
- Login
- Logout
- Password hashing
- JWT access token
- Refresh token
- Protected routes
- RBAC middleware

## Phase 3 — Company and Jobs

- Company creation
- Job CRUD
- Publish/close jobs
- Job search
- Filtering
- Sorting
- Pagination

## Phase 4 — Applications

- Apply for job
- Prevent duplicate applications
- Application status
- Recruiter application dashboard
- Candidate application dashboard

## Phase 5 — Assessment

- Create assessment
- Create questions
- MCQ
- Assessment assignment
- Assessment attempt
- Timer
- Automatic MCQ evaluation

## Phase 6 — Coding Assessment

- Coding questions
- Monaco Editor
- Code submission
- Test cases
- Code execution
- Result calculation

## Phase 7 — Interview

- Shortlisting
- Interview scheduling
- Interview feedback
- Application status updates

## Phase 8 — Advanced Features

- Socket.IO
- Redis
- Rate limiting
- Caching
- BullMQ
- Background jobs
- Email notifications
- Audit logs

## Phase 9 — Deployment

- Docker
- Docker Compose
- Nginx
- AWS
- GitHub Actions
- CI/CD
- Production environment variables
- Logging

---

# 37. MVP Scope

Do not build every feature initially.

The first working version should contain:

```text
Authentication
      ↓
Jobs
      ↓
Applications
      ↓
Assessments
      ↓
MCQ Questions
      ↓
Assessment Attempt
      ↓
Automatic Evaluation
      ↓
Recruiter Dashboard
      ↓
Interview Scheduling
```

After this works, add:

```text
Coding Evaluation
Socket.IO
Redis
Queues
Email
Audit Logs
Docker
AWS
```

---

# 38. API Examples

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

## Jobs

```text
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PATCH  /api/jobs/:id
DELETE /api/jobs/:id
POST   /api/jobs/:id/publish
POST   /api/jobs/:id/close
```

## Applications

```text
POST  /api/jobs/:jobId/apply
GET   /api/applications
GET   /api/applications/:id
PATCH /api/applications/:id/status
POST  /api/applications/:id/withdraw
```

## Assessments

```text
POST   /api/assessments
GET    /api/assessments/:id
PATCH  /api/assessments/:id
DELETE /api/assessments/:id
POST   /api/assessments/:id/publish
POST   /api/assessments/:id/assign
```

## Questions

```text
POST   /api/questions
GET    /api/questions/:id
PATCH  /api/questions/:id
DELETE /api/questions/:id
POST   /api/questions/:id/test-cases
```

## Attempts

```text
POST /api/assessments/:id/start
POST /api/attempts/:id/answer
POST /api/attempts/:id/submit
GET  /api/attempts/:id/result
```

## Interviews

```text
POST  /api/interviews
GET   /api/interviews
PATCH /api/interviews/:id
POST  /api/interviews/:id/cancel
POST  /api/interviews/:id/feedback
```

---

# 39. Important Backend Concepts to Learn

While building this project, focus on understanding:

### Node.js / Express

- Middleware
- Controllers
- Services
- Error handling
- REST API design
- Validation
- Authentication
- Authorization

### TypeScript

- Interfaces
- Types
- Generics
- Enums
- Utility types
- DTOs
- Type-safe API responses

### MySQL

- Primary keys
- Foreign keys
- Joins
- Indexes
- Constraints
- Transactions
- Normalization
- Aggregations
- Pagination

### Sequelize

- Models
- Associations
- Migrations
- Seeders
- Transactions
- Scopes
- Eager loading

### React

- Components
- Hooks
- Forms
- Routing
- Protected routes
- Server state
- Error/loading states
- Reusable components

### Advanced

- Redis
- WebSockets
- Queues
- Workers
- Docker
- CI/CD

---

# 40. Resume Value

Possible resume title:

**Developer Hiring & Technical Assessment Platform**

Tech stack:

```text
React, TypeScript, Node.js, Express, MySQL, Sequelize,
Redis, Socket.IO, Docker
```

Possible resume bullets after actually implementing the features:

- Developed a full-stack hiring platform enabling recruiters to manage job postings, candidate applications, technical assessments and interview workflows using React, TypeScript, Node.js and Express.
- Implemented permission-based RBAC and JWT authentication for Candidate, Recruiter and Admin roles with protected API routes.
- Designed normalized MySQL schemas using Sequelize migrations, associations, indexes and transactions for jobs, applications, assessments and interview workflows.
- Built an assessment engine supporting MCQ and coding questions with server-authoritative timers, automated evaluation and candidate scoring.
- Implemented real-time notifications and background processing using Socket.IO, Redis and BullMQ.
- Containerized the application with Docker and configured production deployment and CI/CD.

Only include features you actually implement.

---

# 41. Final Architecture

```text
                         ┌──────────────────────┐
                         │       React          │
                         │    TypeScript UI     │
                         └──────────┬───────────┘
                                    │
                         REST / WebSocket
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Node.js + Express  │
                         │                      │
                         │ Controllers          │
                         │ Services             │
                         │ Middleware           │
                         │ RBAC                 │
                         └───────┬───────┬──────┘
                                 │       │
                    ┌────────────┘       └─────────────┐
                    ▼                                  ▼
             ┌──────────────┐                   ┌──────────────┐
             │    MySQL     │                   │    Redis     │
             │  Sequelize   │                   │              │
             └──────────────┘                   └──────┬───────┘
                                                       │
                                                    BullMQ
                                                       │
                                                       ▼
                                                ┌──────────────┐
                                                │    Worker    │
                                                │              │
                                                │ Code Eval    │
                                                │ Emails       │
                                                │ Reminders    │
                                                └──────────────┘

                         ┌──────────────────────┐
                         │     Socket.IO        │
                         │  Real-time Events    │
                         └──────────────────────┘
```

---

# 42. Project Success Criteria

The project is considered MVP-complete when:

- [ ] Candidate can register/login.
- [ ] Recruiter can register/login.
- [ ] Admin can manage users.
- [ ] Recruiter can create and publish jobs.
- [ ] Candidate can search and apply for jobs.
- [ ] Recruiter can view applications.
- [ ] Recruiter can create assessments.
- [ ] Recruiter can create MCQ questions.
- [ ] Candidate can start an assessment.
- [ ] Server controls assessment expiration.
- [ ] Candidate can submit answers.
- [ ] System automatically calculates MCQ score.
- [ ] Recruiter can view candidate results.
- [ ] Recruiter can shortlist candidates.
- [ ] Recruiter can schedule interviews.
- [ ] Candidate can view interview details.

Advanced completion:

- [ ] Coding questions.
- [ ] Code execution worker.
- [ ] Hidden test cases.
- [ ] Socket.IO notifications.
- [ ] Redis caching.
- [ ] Redis rate limiting.
- [ ] BullMQ background jobs.
- [ ] Email notifications.
- [ ] Audit logs.
- [ ] Docker.
- [ ] CI/CD.
- [ ] AWS deployment.
