# CalisFun Backend Repository Documentation

---

## 📃 Table of Contents
- [⚙️ Technology Stack](#-technology-stack)
- [🧩 Core Features](#-core-features)
- [🚀 Live Demo](#-live-demo)
- [🏗️ Architecture Pattern](#-architecture-pattern)
- [📈 Design Pattern](#-design-pattern)
- [🧑‍💻 Clean Code](#-clean-code)
- [🔒 Security](#-test-coverage)
- [📝 CI/CD](#-ci/cd)
- [🧪 Test Coverage](#-test-coverage)
- [🤵 Admin Account Information](#-admin-account)
- [🔐 .env Configuration](#-env-configuration)
- [🧰 Getting Started Locally](#-getting-started-locally)
- [🧭 Website Preview](#-website-preview)
- [👥 Owner](#-owner)
- [📬 Contact](#-contact)

---

## ⚙️ Technology Stack

<div align="center">

<kbd><img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/node_js.png" height="60" /></kbd>
<kbd><img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/express.png" height="60" /></kbd>
<kbd><img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/mongodb.png" height="60" /></kbd>
<kbd><img src="./Images/tech/jwt.png" height="60" /></kbd>
<kbd><img src="./Images/tech/multer.png" height="60" /></kbd>
<kbd><img src="./Images/tech/vercel.png" height="60" /></kbd>
<kbd><img src="./Images/tech/azure.png" height="60" /></kbd>

</div>

<div align="center">
<h4>Node JS | Express JS | MongoDB | JWT | Multer | Vercel | Microsoft Azure</h4>
</div>

---

## 🧩 List of APIs

[Tolong bang Radit]

---

## 🚀 Live Demo

👉 [https://calis-fun-backend.vercel.app/](https://calis-fun-backend.vercel.app/)

---

## 🏗️ Architecture Pattern

### Repository Structure

```
calis-fun-be/
├── .github/                    # GitHub workflows / CI configuration
├── Backend/                    # Main source code
│   ├── config/                 # Database & environment configuration
│   ├── controllers/            # Request handlers (business orchestration)
│   ├── helper/                 # Helper functions (utilities, reusable logic)
│   ├── middleware/             # Express middlewares (auth, validation, error handling)
│   ├── models/                 # Database models (MongoDB/Mongoose schemas)
│   ├── routes/                 # Route definitions and API mapping
│   ├── seeders/                # Database seed scripts (initial data)
│   └── tests/                  # Unit & integration tests (Jest + Supertest)
│
├── node\_modules/               # Dependencies (auto-generated)
├── server.js                   # Application entry point (Express server)
│
├── .env                        # Environment variables (local)
├── .env.example                # Sample environment file
├── .env.test                   # Environment variables for testing
├── .gitignore                  # Git ignore rules
├── babel.config.cjs            # Babel configuration
├── jest.config.cjs             # Jest testing configuration
├── package.json                # Project metadata & dependencies
├── package-lock.json           # Locked dependency tree
├── README.md                   # Repository documentation
└── vercel.json                 # Vercel deployment configuration
```

### **Architecture Principles**

The architecture for the **CalisFun Backend** follows a **Layered MVC Architecture**, designed for **clarity, scalability, and testability**.

1. **Layered Architecture Pattern**
   - **Presentation Layer (API Layer):**  
     `routes/` + `middleware/`  
     Defines all API endpoints and request/response handling. Middleware secures routes (JWT, validation, error handling).
   
   - **Application Layer (Controllers):**  
     `controllers/`  
     Orchestrates business logic, connects services, and prepares responses for clients.
   
   - **Domain Layer (Business & Models):**  
     `models/` + `helper/`  
     Contains the data schema (MongoDB via Mongoose) and domain logic (validation, utilities).
   
   - **Infrastructure Layer (Config & Persistence):**  
     `config/` + `seeders/`  
     Handles database connection, environment setup, and initial dataset seeding.

2. **Model–View–Controller (MVC) Principles**
   - **Model:** Represents the database schema and rules (`models/`).  
   - **Controller:** Encapsulates business logic and response handling (`controllers/`).  
   - **View:** Instead of HTML views, the backend serves **JSON responses** as the "view" layer for the mobile/web frontend.

3. **Separation of Concerns**
   - **`routes/`** → Handles endpoint mapping.  
   - **`controllers/`** → Business logic orchestration.  
   - **`models/`** → Data definition and persistence.  
   - **`middleware/`** → Security, validation, and error control.  
   - **`helper/`** → Utility functions reused across layers.  

4. **Scalability in Mind**
   - Organized in modular domains → easy to add new features (e.g., new quiz type, new role).  
   - `tests/` ensures new changes don’t break existing functionality.  
   - CI/CD integrated with GitHub Actions and Vercel for automatic deployments.

5. **Express.js + MongoDB Stack**
   - `server.js` initializes Express app and applies routes/middlewares.  
   - `Mongoose` provides ODM for MongoDB with schema validation.  
   - `Jest + Supertest` ensure testability of routes, controllers, and middleware.  

---

## 🎨 Design Pattern

### 🔨 Creational Patterns
- **Singleton Pattern**  
  - Applied in database connection (`config/database.js`) to ensure only **one instance** of the MongoDB connection is created and reused.  
  - Prevents multiple connections and improves performance.  

- **Factory Pattern**  
  - Used in `models/` where Mongoose schemas generate model instances (e.g., `User`, `Quiz`, `Progress`).  
  - Ensures consistent creation of objects that interact with MongoDB.  

### 🏗️ Structural Patterns
- **Module Pattern**  
  - Code is organized into self-contained modules (`controllers/`, `routes/`, `middleware/`, `helper/`).  
  - Each module handles a single responsibility and can be extended independently.  

- **Facade Pattern**  
  - `controllers/` act as a facade between incoming HTTP requests and deeper logic (models, services).  
  - Provides a simplified API to the routes layer, hiding database or service complexity.  

- **Proxy Pattern**  
  - Implemented in middleware (e.g., `authMiddleware`) to intercept and validate requests before reaching controllers.  
  - Adds security and logging behavior transparently.  

### 🤝 Behavioral Patterns
- **Observer Pattern**  
  - Database models can trigger hooks/events (e.g., Mongoose pre/post save hooks).  
  - Useful for audit logging, notifications, or cascading updates.  

- **Strategy Pattern**  
  - Authentication strategies (JWT, role-based access control) are encapsulated, allowing flexible extension (e.g., adding OAuth in the future).  

- **Command Pattern**  
  - User actions (e.g., register, login, submit answer) are processed as commands via controllers.  
  - Decouples the request handling from the execution logic.  

- **Middleware Chain (Chain of Responsibility Pattern)**  
  - Express middlewares (auth, validation, error handler) form a **chain of responsibility**.  
  - Each middleware decides whether to handle the request or pass it to the next one.  

---

## 🧼 Clean Code Principles

To ensure maintainability, scalability, and readability, the **CalisFun Backend** follows Clean Code practices:

- **Naming Conventions**  
  - Follows **camelCase** for variables & functions, **PascalCase** for models, and **UPPER_CASE** for constants/environment variables.  
  - Example: `userController.js`, `authMiddleware.js`, `UserModel`.  

- **Small & Focused Modules**  
  - Each folder (controllers, routes, middleware, models) has a **single responsibility**.  
  - Example: `authController` only handles login/register, `quizController` only manages quiz-related endpoints.  

- **Consistent Project Structure**  
  - Organized in layered MVC pattern: `routes → controllers → models → database`.  
  - Utilities/helpers are isolated in `/helper` to avoid duplication.  

- **Linting & Formatting**  
  - Enforced with **ESLint** and **Prettier** for consistent code style.  
  - GitHub Actions block merges if linting/tests fail.  

- **Error Handling**  
  - Centralized error handling in `middleware/errorHandler.js`.  
  - Ensures all errors return consistent JSON responses.  

- **Testing**  
  - Unit and integration tests live in `/tests` (Jest + Supertest).  
  - Covers critical flows like authentication, CRUD operations, and role-based access.  

- **Separation of Concerns**  
  - `routes/` define endpoints only.  
  - `controllers/` orchestrate business logic.  
  - `models/` manage data schema & persistence.  
  - `middleware/` add reusable cross-cutting concerns (auth, validation).  

---

## 🔒 Security Implementation

The **CalisFun Backend** implements multiple security mechanisms to protect data and users:

- **JWT Authentication**  
  - All protected routes require a valid **JSON Web Token (JWT)**.  
  - Tokens are signed with a secret key stored in environment variables.  

- **Role-Based Access Control (RBAC)**  
  - Roles like **Admin** and **User** are enforced.  
  - Example: Only Admin can manage questions, while Users can only access their own progress.  

- **Input Validation & Sanitization**  
  - Requests are validated with middleware to prevent malformed data.  
  - Prevents SQL/NoSQL injections and invalid payloads.  

- **Secure Communication**  
  - All API endpoints are served via **HTTPS** (handled at deployment level with Vercel/Reverse Proxy).  
  - Secrets (DB URI, JWT_SECRET, API Keys) are injected from `.env`, never hardcoded.  

- **Error & Logging Security**  
  - Centralized error handler avoids leaking sensitive stack traces in production.  
  - Logs only necessary details for debugging.  

- **Middleware Security**  
  - Authentication middleware ensures only authorized requests reach controllers.  
  - Rate limiting and CORS can be configured for extra protection.  

- **Dependency & Vulnerability Checks**  
  - Regular `npm audit` to detect vulnerable packages.  
  - Dependabot/GitHub Actions notify when upgrades are required.  

---


## 📝 CI/CD

The CI/CD pipeline for **CalisFun Backend** is designed to ensure **automation, code quality, and reliable deployment**:

- **GitHub Actions (Workflows)**  
  - Runs **unit + integration tests** with **Jest + Supertest** on every `pull request` and `main` branch push.   
  - Generates **test coverage reports** under `/tests/coverage`.  

- **Vercel Deployment**  
  - Integrated with **Vercel** for backend hosting.  
  - Every push to the `main` branch triggers an **automatic build & deployment** to production.  
  - Preview deployments are created for each pull request → enabling QA and developer review before merging.  

**CI/CD Flow:**  
1. Developer pushes code → GitHub Actions runs linting + tests.  
2. If pipeline passes, Vercel automatically deploys the latest version.  
3. Production API is updated instantly with **zero-downtime deployment**.  

---

## 🧪 Test Coverage

The **CalisFun Backend** follows a **multi-layered testing strategy** to ensure stable APIs and reliable data handling.

### 🔍 Testing Scope
- **Unit Tests**  
  - For helper functions and utility modules (e.g., password hashing, JWT generation).  
  - For isolated controllers logic (register, login, CRUD operations).  

- **Integration Tests**  
  - Using **Supertest** to validate API endpoints.  
  - Example flows tested:  
    - User Registration → Login → Authenticated Request (JWT)  
    - Admin → Create Question → Fetch Question → Update/Delete Question  

- **End-to-End (E2E) Tests**
  - Simulated flows combining multiple layers (e.g., Full User Lifecycle: Register → Play Quiz → Progress Saved → Leaderboard Updated).  

---

### 🧪 Testing Tools
- **Jest** → For unit & integration tests.  
- **Supertest** → To test HTTP API endpoints.  
- **MongoDB Memory Server** → For running tests against an in-memory MongoDB instance (fast, isolated, no need for real DB).  

---

### 📊 Coverage Metrics
Test coverage reports are generated automatically under `/tests/coverage`.  
Metrics tracked:  
- **Statements** → Percentage of code statements executed.  
- **Branches** → Conditional branches tested.  
- **Functions** → Functions invoked during test runs.  
- **Lines** → Executed lines vs total lines.  

We already passed several tests such as:  
- Authentication Flow (Register, Login, JWT Verification)  
- User Role Access (Admin vs User)  
- Question Management API (CRUD operations)  
- Error Handling (Invalid payloads, unauthorized access)  

<img src="./Images/backend_test_coverage.png" height="210"/>

---

## 🔐 .env Configuration

.env for the Backend
```
MONGO_URI=<mongo_db_url/>
JWT_SECRET=
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

AZURE_OPENAI_KEY=<azure_open_ai_key_subscription/>
AZURE_OPENAI_ENDPOINT=<azure_open_ai_endpoint/>
AZURE_API_VERSION=2024-12-01-preview
AZURE_OPENAI_DEPLOYMENT=gpt-35-turbo
```

You can also copy the .env.sample then rename it to .env

---

## 🧰 Getting Started Locally

### Prerequisites
- **Node.js** (v16+)
- **MongoDB**
- **Git**
- **MongoDB Compass** (optional)
- **Postman** (optional)

### Clone the Project
```bash
git clone https://github.com/best-team-compfest17/CalisFun-Backend.git
cd CalisFun-Backend
cd Backend
npm install
npm run seed:all  # Seeding the database
npm run dev       # Run the local server
npm run test      # Run jest test
```

---

## 🧭 Diagram

*Overall Database System Flow:*
<p align="center">
  <img src="./Images/diagram.png" width="700">
</p>

This diagram shows how the models connected using ERD Diagram

---

## 🔥 API Documentation

Postman Link:

[CalisFun Backend Postman](https://app.getpostman.com/join-team?invite_code=e7dd52085df5b11f72bad1da0e022ed6fa6f9438b0444aaae1468d66de5cf840&target_code=26db97613300939b2f3574d983144d7a )

---

## 👥 Owner

This Repository is created by Team 1
<ul>
<li>Stanley Nathanael Wijaya - Fullstack Developer</li>
<li>Haikal Iman F - Mobile Developer</li>
<li>Muhammad Favian Jiwani - Mobile Developer</li>
<li>Raditya Ramadhan - Backend Developer</li>
<li>Muhammad Ridho Ananda - Mentor</li>
</ul>
As Final Project for SEA Academy Compfest 17

---

## 📬 Contact
Have questions or want to collaborate?

- 📧 Email: stanley.n.wijaya7@gmail.com
- 💬 Discord: `stynw7`

<code>Made with ❤️ by The Calon Best Team</code>