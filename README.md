# Multi-Tenant SaaS Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

A RESTful backend for a multi-tenant SaaS application built with **Node.js, Express.js, MongoDB, and Mongoose**. It provides tenant isolation, JWT-based authentication, role-based access control, project management, and team member management.

## Features

- **Multi-Tenant Architecture** — Multiple organizations can use the same application while keeping their data isolated.
- **Authentication** — Secure registration and login using JWT and bcrypt password hashing.
- **Role-Based Access Control (RBAC)** — Supports `owner`, `admin`, and `member` roles.
- **Organization Management** — Automatically creates a tenant workspace during registration.
- **Project Management** — Create, retrieve, update, delete, paginate, and filter projects.
- **Team Management** — Add members, list users, update roles, and remove members.
- **Tenant Data Isolation** — Tenant-owned resources are queried using the authenticated tenant ID.
- **Request Validation** — Validates request bodies and parameters using Zod.
- **Security Middleware** — Helmet, CORS configuration, and rate limiting.
- **Centralized Error Handling** — Consistent error responses.
- **Docker Support** — Dockerfile and Docker Compose configuration for local development and deployment.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| JavaScript | Backend programming language |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Zod | Request validation |
| Helmet | HTTP security headers |
| express-rate-limit | API rate limiting |
| Docker | Containerization |

## Project Structure

```text
multi-tenant-saas/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── member.controller.js
│   │   └── project.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── models/
│   │   ├── Project.js
│   │   ├── Tenant.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── member.routes.js
│   │   └── project.routes.js
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   ├── slugify.js
│   │   └── validate.js
│   ├── validation/
│   │   ├── auth.validation.js
│   │   ├── member.validation.js
│   │   └── project.validation.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Install the following:

- [Node.js 20+](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community) or a MongoDB Atlas database
- [Git](https://git-scm.com/)
- npm, included with Node.js

### 1. Clone the Repository

```bash
git clone https://github.com/ajinkya029/multi-tenant-saas.git
cd multi-tenant-saas
```

Replace `YOUR_USERNAME` with your GitHub username and use your actual repository URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root using `.env.example` as a template.

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/multitenant_saas
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
CLIENT_ORIGIN=http://localhost:5173
```

**Important:** Use a strong, randomly generated JWT secret. Never commit your `.env` file or production secrets to GitHub.

### 4. Start MongoDB

If MongoDB is installed locally, ensure the MongoDB service is running.

Alternatively, start the database using Docker:

```bash
docker compose up -d mongo
```

### 5. Start the Development Server

```bash
npm run dev
```

For production mode:

```bash
npm start
```

The API will be available at:

`http://localhost:5000`

### 6. Verify the API

Send a GET request to:

```http
GET http://localhost:5000/api/health
```

Example response:

```json
{
  "status": "ok",
  "service": "multi-tenant-saas-api"
}
```

## API Documentation

All request bodies should use `Content-Type: application/json`.

Protected endpoints require an access token:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new organization and owner | Public |
| POST | `/api/auth/login` | Authenticate a user within a workspace | Public |
| GET | `/api/auth/me` | Get the current user and tenant | Authenticated |

### Projects

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/projects` | List tenant projects | Authenticated |
| POST | `/api/projects` | Create a project | Authenticated |
| GET | `/api/projects/:id` | Get a project by ID | Authenticated |
| PATCH | `/api/projects/:id` | Update a project | Authenticated |
| DELETE | `/api/projects/:id` | Delete a project | Authenticated |

Supported query parameters for listing projects:

- `page` — Page number, default `1`
- `limit` — Results per page, default `20`, maximum `100`
- `status` — Filter by `active`, `archived`, or `completed`

Example:

```http
GET /api/projects?page=1&limit=10&status=active
```

### Team Members

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/members` | List tenant members | Authenticated |
| POST | `/api/members` | Create a member account | Owner/Admin |
| PATCH | `/api/members/:id/role` | Update a member's role | Owner |
| DELETE | `/api/members/:id` | Remove a member | Owner/Admin |

Available roles:

- `owner` — Workspace owner
- `admin` — Workspace administrator
- `member` — Regular workspace member

## Example API Requests

### Register an Organization

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "organizationName": "Acme Studio",
    "name": "Avery Owner",
    "email": "owner@example.com",
    "password": "ChangeMe123!"
  }'
```

The API creates the tenant and its owner account, then returns a JWT, user details, and tenant details.

The tenant slug is generated automatically from the organization name.

### Log In

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@example.com",
    "password": "ChangeMe123!",
    "tenantSlug": "acme-studio"
  }'
```

### Create a Project

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Website Redesign",
    "description": "Redesign the customer portal",
    "status": "active"
  }'
```

### Get Projects

```bash
curl http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Current User

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Multi-Tenant Architecture

Each organization is represented by a tenant document. Users and projects reference their owning tenant through `tenantId`.

```text
Tenant A
├── Owner
├── Admin
├── Members
└── Projects

Tenant B
├── Owner
├── Admin
├── Members
└── Projects
```

The authenticated user's tenant membership is loaded from the database. Project queries and member-management operations are scoped to that tenant, preventing users from accessing another tenant's resources through ordinary API requests.

**Design principle:** Never query tenant-owned resources by document ID alone. Include the authenticated `tenantId` in the database query.

## Security Considerations

- Passwords are hashed using bcryptjs.
- JWTs are signed with a secret configured through environment variables.
- Tenant identity is derived from the authenticated user's database record.
- Protected routes enforce authentication and role-based permissions.
- Request data is validated using Zod.
- Helmet configures common HTTP security headers.
- Rate limiting helps reduce excessive API requests.
- Tenant-owned records are filtered by `tenantId`.

This is a starter implementation. Perform a security review and add automated tenant-isolation tests before production use.

## Docker

Build and start the API and MongoDB containers:

```bash
docker compose up --build
```

Stop the containers:

```bash
docker compose down
```

The included Compose configuration is intended as a development starting point. Replace its example secrets and configure production-grade networking, TLS, persistence, and secret management before deployment.

## Future Improvements

- Email verification and password reset
- Email-based team invitations
- Subscription plans and billing integration
- Usage limits and tenant quotas
- Audit logs and activity tracking
- Refresh tokens and session management
- Automated unit and integration tests
- API documentation with Swagger/OpenAPI
- CI/CD pipeline and cloud deployment
- Tenant suspension and account lifecycle management

## Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request describing the changes.

## License

This project is available under the MIT License. Add a `LICENSE` file to the repository if you intend to distribute it under that license.

## 👨‍💻 Author

**Ajinkya Dhatrak**

GitHub: [ajinkya029](https://github.com/ajinkya029)

---

**Built with Node.js, Express.js, and MongoDB.**
