# Job Tracker — Backend

A production-ready REST API for tracking job applications, built with Node.js, Express, TypeScript, and MongoDB.

**Live Repo:** [github.com/mahedihsharif/job-tracker-backend](https://github.com/mahedihsharif/job-tracker-backend)

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (Access Token + Refresh Token via HttpOnly Cookie)
- **Validation:** Zod
- **File Upload:** Multer + Cloudinary
- **Password Hashing:** bcrypt

---

## Features

- User registration and login with secure cookie-based JWT authentication
- Automatic token refresh with queue-based concurrent request handling
- Job application CRUD — create, read, update, delete
- Advanced filtering — search by title/company, status, apply date range, last date range
- Pagination support
- Centralized error handling (Zod, Mongoose, JWT, Cast errors)
- MVC + Service Layer architecture

---

## Project Structure

```
src/
├── app.ts
├── server.ts
├── config/
├── middleware/
├── utils/
├── types/
└── modules/
    ├── auth/
    │   ├── auth.routes.ts
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    |
    ├── users/
    │   ├── user.routes.ts
    │   ├── user.controller.ts
    │   ├── user.service.ts
    |   ├── user.types.ts
    │   ├── user.model.ts
    │   ├── user.validation.ts
    │ 
    └── jobs/
        ├── job.routes.ts
        ├── job.controller.ts
        ├── job.service.ts
        ├── job.model.ts
        ├── job.validation.ts
        └── job.types.ts
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive tokens |
| POST | `/api/v1/auth/logout` | Logout and clear cookies |
| POST | `/api/v1/auth/refresh-token` | Refresh access token |
| GET | `/api/v1/auth/me` | Get current user info |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
###users endpoints will design later

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/jobs` | Create a new job |
| GET | `/api/v1/jobs` | Get all jobs with filters |
| PATCH | `/api/v1/jobs/:id` | Update a job |
| DELETE | `/api/v1/jobs/:id` | Delete a job |

### Query Params for GET /jobs

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search by job title or company |
| `status` | string | Filter by status (pending/applied/shortlisted) |
| `page` | number | Page number |
| `limit` | number | Items per page |
| `apply_date_start` | string (yyyy-MM-dd) | Apply date range start |
| `apply_date_end` | string (yyyy-MM-dd) | Apply date range end |
| `last_date_start` | string (yyyy-MM-dd) | Last date range start |
| `last_date_end` | string (yyyy-MM-dd) | Last date range end |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB

### Installation

```bash
git clone https://github.com/mahedihsharif/job-tracker-backend.git
cd job-tracker-backend
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/job-tracker
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

---

## Author

**Mahedi H Sharif** — [github.com/mahedihsharif](https://github.com/mahedihsharif)