# Authentication System Architecture — Developer Hiring & Assessment Platform

## 1. Users

The platform has three main user types:

- **DEVELOPER / STUDENT** — applies for jobs, takes assessments, submits coding solutions, views interviews.
- **COMPANY** — represents recruiters/employees of a company; creates jobs, manages candidates, assessments and interviews.
- **ADMIN** — platform-level administrator; manages users, companies, moderation, verification and audit operations.

All three use the same central authentication system. Do **not** create three separate login systems.

---

## 2. High-Level Architecture

```text
React + TypeScript
       |
      HTTPS
       v
Node.js + Express + TypeScript
       |
       +----------------------+
       |                      |
       v                      v
Authentication          Authorization
       |                      |
       |                 RBAC + Permissions
       v                      |
JWT + Refresh Token           |
       |                      |
       +----------+-----------+
                  |
                  v
              Services
                  |
                  v
             Sequelize
                  |
                  v
                MySQL
```

Optional infrastructure:

```text
Redis
 ├── Rate limiting
 ├── Temporary OTP/token data
 ├── Session/cache data
 └── BullMQ queues

Email Service
 ├── Email verification
 ├── Password reset
 └── Authentication notifications
```

---

# 3. Core Principle

Keep authentication data centralized:

```text
users
  |
  +---- Developer Profile
  |
  +---- Company Membership
  |
  +---- Roles
  |
  +---- Refresh Tokens
  |
  +---- Verification Tokens
  |
  +---- Password Reset Tokens
  |
  +---- Audit Logs
```

The `users` table stores common login/account information. Domain-specific information belongs in separate tables.

---

# 4. Required Database Schemas

For the initial production-style architecture:

```text
users
roles
permissions
user_roles
role_permissions

developer_profiles

companies
company_members

refresh_tokens
email_verification_tokens
password_reset_tokens

login_attempts
audit_logs
```

Optional later:

```text
user_sessions
mfa_methods
mfa_verifications
```

---

# 5. `users` Table

Central authentication table.

| Column | Type | Notes |
|---|---|---|
| id | BIGINT | PK |
| email | VARCHAR(255) | UNIQUE |
| password_hash | VARCHAR(255) | Argon2id/bcrypt hash |
| status | ENUM | PENDING, ACTIVE, INACTIVE, SUSPENDED |
| email_verified | BOOLEAN | Default false |
| last_login_at | DATETIME | Nullable |
| created_at | DATETIME | |
| updated_at | DATETIME | |

Important:

```text
Never store the user's plain password.
```

Store:

```text
password_hash
```

instead.

Recommended index:

```text
UNIQUE(email)
INDEX(status)
```

---

# 6. `roles` Table

```text
roles
```

| Column | Type |
|---|---|
| id | BIGINT PK |
| name | VARCHAR(50) UNIQUE |
| description | VARCHAR(255) |
| created_at | DATETIME |
| updated_at | DATETIME |

Initial seed:

```text
DEVELOPER
COMPANY
ADMIN
```

Later you can add:

```text
COMPANY_ADMIN
RECRUITER
HIRING_MANAGER
INTERVIEWER
SUPER_ADMIN
```

---

# 7. `user_roles` Table

Connects users with roles.

| Column | Type |
|---|---|
| id | BIGINT PK |
| user_id | BIGINT FK -> users.id |
| role_id | BIGINT FK -> roles.id |
| created_at | DATETIME |

Constraint:

```text
UNIQUE(user_id, role_id)
```

Even if your MVP gives one role per user, this structure allows multiple roles later.

---

# 8. `permissions` Table

Use permissions so authorization does not become hardcoded everywhere.

| Column | Type |
|---|---|
| id | BIGINT PK |
| name | VARCHAR(100) UNIQUE |
| resource | VARCHAR(50) |
| action | VARCHAR(50) |
| description | VARCHAR(255) |

Examples:

```text
job:view
job:create
job:update
job:delete

application:view
application:create
application:update
application:shortlist

assessment:view
assessment:create
assessment:update
assessment:publish

candidate:view

interview:view
interview:create
interview:update
interview:cancel

user:view
user:update
user:suspend
```

---

# 9. `role_permissions` Table

Connects roles to permissions.

| Column | Type |
|---|---|
| id | BIGINT PK |
| role_id | BIGINT FK |
| permission_id | BIGINT FK |
| created_at | DATETIME |

Example:

```text
DEVELOPER
  ├── job:view
  ├── application:create
  ├── application:view_own
  ├── assessment:take
  ├── submission:create
  └── interview:view_own

COMPANY
  ├── job:create
  ├── job:update
  ├── job:delete
  ├── application:view
  ├── application:shortlist
  ├── assessment:create
  └── interview:create

ADMIN
  ├── user:view
  ├── user:suspend
  ├── company:view
  ├── company:verify
  └── audit_log:view
```

---

# 10. Developer Profile

Authentication information stays in `users`. Developer-specific information belongs here.

### `developer_profiles`

| Column | Type |
|---|---|
| id | BIGINT PK |
| user_id | BIGINT FK -> users.id |
| first_name | VARCHAR(100) |
| last_name | VARCHAR(100) |
| phone | VARCHAR(20) |
| headline | VARCHAR(255) |
| bio | TEXT |
| location | VARCHAR(150) |
| experience_years | DECIMAL |
| resume_url | VARCHAR(500) |
| github_url | VARCHAR(500) |
| linkedin_url | VARCHAR(500) |
| portfolio_url | VARCHAR(500) |
| created_at | DATETIME |
| updated_at | DATETIME |

Relationship:

```text
users 1 -------- 1 developer_profiles
```

---

# 11. Company Architecture

For a realistic system, do not connect one user directly to one company. A company can have multiple recruiters.

```text
Company
   |
   +---- Recruiter A
   +---- Recruiter B
   +---- Hiring Manager
   +---- Interviewer
```

## `companies`

| Column | Type |
|---|---|
| id | BIGINT PK |
| name | VARCHAR(255) |
| email | VARCHAR(255) |
| website | VARCHAR(500) |
| description | TEXT |
| industry | VARCHAR(150) |
| company_size | VARCHAR(50) |
| logo_url | VARCHAR(500) |
| location | VARCHAR(150) |
| verification_status | ENUM |
| created_at | DATETIME |
| updated_at | DATETIME |

Verification:

```text
PENDING
VERIFIED
REJECTED
```

## `company_members`

| Column | Type |
|---|---|
| id | BIGINT PK |
| company_id | BIGINT FK |
| user_id | BIGINT FK |
| company_role | VARCHAR(50) |
| created_at | DATETIME |
| updated_at | DATETIME |

Example:

```text
ABC Technologies
   |
   +-- Rajdip     RECRUITER
   +-- Ankit      HIRING_MANAGER
   +-- Priya      INTERVIEWER
```

This is better than simply storing `company_id` on `users`.

---

# 12. Refresh Tokens

### `refresh_tokens`

| Column | Type |
|---|---|
| id | BIGINT PK |
| user_id | BIGINT FK |
| token_hash | VARCHAR(255) |
| expires_at | DATETIME |
| revoked_at | DATETIME NULL |
| user_agent | TEXT |
| ip_address | VARCHAR(45) |
| created_at | DATETIME |

Store a **hash** of the refresh token rather than the raw token.

Recommended browser approach:

```text
Refresh Token -> HttpOnly + Secure + SameSite cookie
```

Avoid storing long-lived refresh tokens in `localStorage`.

---

# 13. Email Verification

### `email_verification_tokens`

| Column | Type |
|---|---|
| id | BIGINT PK |
| user_id | BIGINT FK |
| token_hash | VARCHAR(255) |
| expires_at | DATETIME |
| verified_at | DATETIME NULL |
| created_at | DATETIME |

Flow:

```text
Register
   |
   v
Create User
   |
   v
email_verified = false
   |
   v
Create verification token
   |
   v
Send email
   |
   v
User clicks link
   |
   v
Verify token
   |
   v
email_verified = true
```

---

# 14. Password Reset

### `password_reset_tokens`

| Column | Type |
|---|---|
| id | BIGINT PK |
| user_id | BIGINT FK |
| token_hash | VARCHAR(255) |
| expires_at | DATETIME |
| used_at | DATETIME NULL |
| created_at | DATETIME |

Flow:

```text
Forgot Password
      |
      v
Enter email
      |
      v
Generate reset token
      |
      v
Send email
      |
      v
Validate token
      |
      v
Hash new password
      |
      v
Update users.password_hash
      |
      v
Revoke existing sessions/tokens
```

---

# 15. Login Attempts

### `login_attempts`

| Column | Type |
|---|---|
| id | BIGINT PK |
| user_id | BIGINT NULL |
| email | VARCHAR(255) |
| ip_address | VARCHAR(45) |
| success | BOOLEAN |
| failure_reason | VARCHAR(255) |
| created_at | DATETIME |

Useful for detecting repeated failed logins.

For high-volume rate limiting, use Redis.

---

# 16. Audit Logs

### `audit_logs`

| Column | Type |
|---|---|
| id | BIGINT PK |
| user_id | BIGINT NULL |
| action | VARCHAR(100) |
| entity_type | VARCHAR(100) |
| entity_id | BIGINT NULL |
| old_value | JSON NULL |
| new_value | JSON NULL |
| ip_address | VARCHAR(45) |
| user_agent | TEXT |
| created_at | DATETIME |

Authentication actions:

```text
USER_REGISTERED
USER_LOGIN
USER_LOGIN_FAILED
EMAIL_VERIFIED
PASSWORD_CHANGED
PASSWORD_RESET
USER_LOGOUT
USER_SUSPENDED
ROLE_CHANGED
```

---

# 17. Admin Account

Do **not** expose a public endpoint such as:

```text
POST /auth/register/admin
```

Instead:

```text
Initial Admin
     |
     v
Database seed/script
     |
     v
ADMIN
```

An existing authorized admin can later create another admin if your business rules require it.

This prevents someone from simply sending:

```json
{
  "role": "ADMIN"
}
```

during public registration.

---

# 18. Developer Registration

Endpoint:

```http
POST /api/v1/auth/register/developer
```

Request:

```json
{
  "email": "developer@example.com",
  "password": "StrongPassword123!",
  "firstName": "Rajdip",
  "lastName": "Das"
}
```

Flow:

```text
Request
   |
   v
Zod Validation
   |
   v
Check email uniqueness
   |
   v
Hash password
   |
   v
BEGIN TRANSACTION
   |
   +--> Create User
   |
   +--> Assign DEVELOPER role
   |
   +--> Create Developer Profile
   |
   +--> Create Email Verification Token
   |
   v
COMMIT
   |
   v
Send Verification Email
```

If database operations fail:

```text
ROLLBACK
```

---

# 19. Company Registration

Endpoint:

```http
POST /api/v1/auth/register/company
```

Request:

```json
{
  "email": "hr@company.com",
  "password": "StrongPassword123!",
  "companyName": "ABC Technologies",
  "website": "https://example.com",
  "industry": "Software"
}
```

Flow:

```text
Company Registration
        |
        v
Validate request
        |
        v
Check email
        |
        v
Create user
        |
        v
Assign COMPANY role
        |
        v
Create company
        |
        v
Create company_members record
        |
        v
Company = PENDING
        |
        v
Email verification
        |
        v
Admin verifies company
        |
        v
Company = VERIFIED
```

---

# 20. Common Login

Use one endpoint:

```http
POST /api/v1/auth/login
```

Request:

```json
{
  "email": "developer@example.com",
  "password": "StrongPassword123!"
}
```

Flow:

```text
Login Request
     |
     v
Validate Input
     |
     v
Find User
     |
     v
Check Account Status
     |
     v
Verify Password
     |
     +------ FAIL ------> Record Attempt -> 401
     |
     v
Load Roles
     |
     v
Load Permissions
     |
     v
Generate Access Token
     |
     v
Generate Refresh Token
     |
     v
Store Refresh Token Hash
     |
     v
Return Authentication Response
```

---

# 21. JWT Architecture

Use two tokens:

```text
Access Token
Refresh Token
```

## Access Token

Short-lived, for example:

```text
15 minutes
```

Example payload:

```json
{
  "sub": "101",
  "type": "access"
}
```

Keep sensitive information out of the JWT.

## Refresh Token

Longer-lived, for example:

```text
7–30 days
```

Flow:

```text
Access Token
     |
     | short lifetime
     v
API requests

Refresh Token
     |
     | longer lifetime
     v
Get new Access Token
```

For a browser application, keep the refresh token in an HttpOnly Secure cookie.

---

# 22. Protected Request Flow

```text
React
  |
  | Authorization: Bearer <access_token>
  v
Express
  |
  v
authenticate()
  |
  v
Verify JWT
  |
  +---- Invalid ---> 401 Unauthorized
  |
  +---- Valid
          |
          v
       req.user
          |
          v
   authorization middleware
          |
          v
      Controller
```

Example:

```typescript
req.user = {
  id: 101,
  roles: ["DEVELOPER"],
  permissions: [
    "job:view",
    "application:create",
    "assessment:take"
  ]
};
```

---

# 23. Authentication vs Authorization

### Authentication

```text
Who are you?
```

Example:

```text
Rajdip successfully logged in.
```

Uses:

```text
Password
JWT
Refresh Token
Session
```

### Authorization

```text
What are you allowed to do?
```

Example:

```text
DEVELOPER -> Can take assessment
DEVELOPER -> Cannot create a job

COMPANY -> Can create a job
ADMIN -> Can suspend a user
```

---

# 24. Middleware

Recommended order:

```text
Request
  |
  v
Helmet
  |
  v
CORS
  |
  v
Rate Limiter
  |
  v
Authentication
  |
  v
Authorization
  |
  v
Zod Validation
  |
  v
Controller
  |
  v
Service
  |
  v
Sequelize
```

Example:

```typescript
router.post(
  "/jobs",
  authenticate,
  authorizePermission("job:create"),
  validate(createJobSchema),
  createJobController
);
```

---

# 25. Recommended Auth APIs

## Public

```text
POST /api/v1/auth/register/developer
POST /api/v1/auth/register/company

POST /api/v1/auth/login
POST /api/v1/auth/refresh

POST /api/v1/auth/verify-email
POST /api/v1/auth/resend-verification

POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
```

## Authenticated

```text
POST  /api/v1/auth/logout
POST  /api/v1/auth/logout-all

GET   /api/v1/auth/me
PATCH /api/v1/auth/change-password
```

## Admin

```text
GET   /api/v1/admin/users
POST  /api/v1/admin/users/:id/suspend
POST  /api/v1/admin/users/:id/activate

GET   /api/v1/admin/companies
PATCH /api/v1/admin/companies/:id/verify
PATCH /api/v1/admin/companies/:id/reject

GET   /api/v1/admin/audit-logs
```

---

# 26. Backend Folder Structure

```text
src/
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.validation.ts
│   │   └── auth.types.ts
│   │
│   ├── users/
│   ├── developers/
│   ├── companies/
│   ├── roles/
│   ├── permissions/
│   └── audit-logs/
│
├── middleware/
│   ├── authenticate.ts
│   ├── authorize.ts
│   ├── validate.ts
│   ├── rateLimiter.ts
│   └── errorHandler.ts
│
├── models/
│   ├── User.ts
│   ├── Role.ts
│   ├── Permission.ts
│   ├── UserRole.ts
│   ├── RolePermission.ts
│   ├── DeveloperProfile.ts
│   ├── Company.ts
│   ├── CompanyMember.ts
│   ├── RefreshToken.ts
│   ├── EmailVerificationToken.ts
│   ├── PasswordResetToken.ts
│   ├── LoginAttempt.ts
│   └── AuditLog.ts
│
├── config/
│   ├── database.ts
│   ├── redis.ts
│   └── env.ts
│
├── utils/
│   ├── password.ts
│   ├── jwt.ts
│   ├── token.ts
│   └── email.ts
│
└── app.ts
```

---

# 27. ER Diagram

```text
                         +----------------+
                         |     USERS      |
                         +----------------+
                         | id PK          |
                         | email UNIQUE   |
                         | password_hash  |
                         | status         |
                         | email_verified |
                         +-------+--------+
                                 |
             +-------------------+-------------------+
             |                   |                   |
             v                   v                   v
 +---------------------+ +----------------+ +-------------------+
 | developer_profiles  | | company_members| | refresh_tokens    |
 +---------------------+ +-------+--------+ +-------------------+
                                 |
                                 v
                         +---------------+
                         |   companies   |
                         +---------------+

users
  |
  v
user_roles
  |
  v
roles
  |
  v
role_permissions
  |
  v
permissions

users
  |
  +---- email_verification_tokens
  |
  +---- password_reset_tokens
  |
  +---- login_attempts
  |
  +---- audit_logs
```

---

# 28. Security Checklist

## MVP

- [ ] Password hashing with Argon2id or bcrypt
- [ ] Unique email
- [ ] Email verification
- [ ] JWT access token
- [ ] Refresh token
- [ ] Refresh-token revocation
- [ ] HttpOnly Secure cookie
- [ ] RBAC
- [ ] Permission authorization
- [ ] Zod validation
- [ ] Rate limiting
- [ ] Account status checking
- [ ] Password reset
- [ ] Logout
- [ ] Audit logs

## Advanced

- [ ] Refresh-token rotation
- [ ] Redis
- [ ] MFA
- [ ] Google/GitHub OAuth
- [ ] Device/session management
- [ ] Suspicious-login detection
- [ ] OTP
- [ ] Login notification emails

---

# 29. Recommended Implementation Order

## Phase 1 — Core

```text
users
roles
user_roles

Developer Registration
Company Registration
Login
Logout
JWT
```

## Phase 2 — Security

```text
Password hashing
Email verification
Refresh tokens
Password reset
Rate limiting
```

## Phase 3 — Authorization

```text
permissions
role_permissions
authenticate middleware
authorize middleware
```

## Phase 4 — Profiles

```text
developer_profiles
companies
company_members
```

## Phase 5 — Audit

```text
login_attempts
audit_logs
logout all
session management
```

## Phase 6 — Advanced

```text
Redis
MFA
OAuth
BullMQ
Email workers
```

---

# 30. Final Recommended Architecture

```text
                       React Client
                            |
                           HTTPS
                            |
                            v
                  +---------------------+
                  | Express API Server  |
                  +----------+----------+
                             |
                 +-----------+-----------+
                 |                       |
                 v                       v
          Authentication          Authorization
                 |                       |
        +--------+--------+        +-----+------+
        |                 |        |            |
     Password            JWT      RBAC     Permissions
        |                 |        |            |
        +--------+--------+        +-----+------+
                 |                       |
                 +-----------+-----------+
                             |
                             v
                         Services
                             |
                             v
                         Sequelize
                             |
                             v
                           MySQL
                             |
          +------------------+------------------+
          |                  |                  |
        Users              Roles            Profiles
          |                                     |
          +---- Developer                       |
          |                                     |
          +---- Company ------------------------+
          |
          +---- Admin
          |
          +---- Tokens
          |
          +---- Audit Logs
```

## Key Decisions

1. **One authentication system** for all user types.
2. `users` stores common authentication data.
3. Developer and company data are stored separately.
4. Use **RBAC + permissions** for authorization.
5. Public users can register as Developer or Company.
6. Admin accounts are created through a controlled seed/admin flow.
7. New companies should start as `PENDING` and require verification.
8. Use MySQL + Sequelize because the authentication and platform data is relational.
9. Use short-lived access tokens and longer-lived refresh tokens.
10. Build the MVP first, then add Redis, MFA, OAuth and session management.
