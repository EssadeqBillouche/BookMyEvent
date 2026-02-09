# 🎫 BookMyEvent

<div align="center">

![BookMyEvent](https://img.shields.io/badge/BookMyEvent-Event%20Management-d4a574?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**A modern, full-stack event management platform**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Documentation](#-api-documentation) • [Project Structure](#-project-structure)

</div>

---

## 📋 Overview

BookMyEvent is a comprehensive event management platform that enables users to discover, register for, and attend events. Administrators can create and manage events, approve registrations, and generate PDF tickets for confirmed attendees.

## ✨ Features

### 🎯 Core Features

| Feature | Description |
|---------|-------------|
| 🔐 **Secure Authentication** | HTTP-only cookie-based JWT authentication |
| 📅 **Event Management** | Create, edit, publish, and cancel events |
| 📝 **Registration System** | User registration with approval workflow |
| 🎟️ **PDF Tickets** | Generate downloadable PDF tickets |
| 👥 **Role-Based Access** | Admin and participant roles |
| 🌙 **Dark/Light Theme** | Beautiful UI with theme switching |

### 🛡️ Security Features

- ✅ HTTP-only cookies (XSS protection)
- ✅ SameSite cookie attribute (CSRF protection)
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Role-based authorization

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white) | Framework |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) | Language |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white) | Database |
| ![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=flat&logo=typeorm&logoColor=white) | ORM |
| ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black) | API Docs |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) | Auth |

### Frontend
| Technology | Purpose |
|------------|---------|
| ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white) | Framework |
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | UI Library |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) | Language |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white) | Styling |
| ![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white) | Testing |

### DevOps
| Technology | Purpose |
|------------|---------|
| ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) | Containers |
| ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat&logo=githubactions&logoColor=white) | CI/CD |

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x
- **PostgreSQL** >= 15.x
- **Docker** (optional)

### 📦 Installation

#### 1. Clone the repository

```bash
git clone https://github.com/EssadeqBillouche/BookMyEvent.git
cd BookMyEvent
```

#### 2. Environment Setup

**Backend (.env)**
```bash
cd backend
cp .env.example .env
```

Configure the following variables:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=bookmyevent

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Environment
NODE_ENV=development
```

**Frontend (.env.local)**
```bash
cd frontend
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

#### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

#### 4. Database Setup

```bash
# Start PostgreSQL (if using Docker)
docker-compose up -d postgres

# Run migrations (from backend directory)
npm run migration:run
```

#### 5. Start Development Servers

```bash
# Backend (http://localhost:4000)
cd backend
npm run start:dev

# Frontend (http://localhost:3000)
cd frontend
npm run dev
```

### 🐳 Docker Setup

```bash
# Build and run all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:

🔗 **Swagger UI**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

### API Endpoints Overview

#### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | User login |
| `POST` | `/auth/logout` | User logout |
| `GET` | `/auth/me` | Get current user |
| `GET` | `/auth/profile` | Get user profile |

#### 📅 Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/events` | List all published events |
| `GET` | `/events/:id` | Get event details |
| `GET` | `/events/featured` | Get featured events |
| `GET` | `/events/upcoming` | Get upcoming events |
| `POST` | `/events` | Create event (Admin) |
| `PATCH` | `/events/:id` | Update event (Admin) |
| `PATCH` | `/events/:id/publish` | Publish event (Admin) |
| `DELETE` | `/events/:id` | Delete event (Admin) |

#### 📝 Registrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/registrations` | Register for event |
| `GET` | `/registrations/my` | Get my registrations |
| `PATCH` | `/registrations/:id/validate` | Approve registration (Admin) |
| `PATCH` | `/registrations/:id/refuse` | Reject registration (Admin) |
| `PATCH` | `/registrations/:id/cancel` | Cancel registration |

#### 🎟️ Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tickets/:registrationId/download` | Download PDF ticket |
| `GET` | `/tickets/:registrationId/check` | Check ticket availability |

## 📁 Project Structure

```
bookMyEvent/
├── 📁 backend/                 # NestJS API
│   ├── 📁 src/
│   │   ├── 📁 auth/           # Authentication module
│   │   ├── 📁 event/          # Event management
│   │   ├── 📁 registration/   # Registration system
│   │   ├── 📁 ticket/         # PDF ticket generation
│   │   ├── 📁 user/           # User management
│   │   └── 📁 common/         # Shared utilities
│   ├── 📁 config/             # Configuration files
│   └── 📁 test/               # E2E tests
│
├── 📁 frontend/               # Next.js Application
│   ├── 📁 app/               # App router pages
│   │   ├── 📁 admin/         # Admin dashboard
│   │   ├── 📁 events/        # Event pages
│   │   └── 📁 dashboard/     # User dashboard
│   ├── 📁 components/        # React components
│   │   ├── 📁 ui/            # Reusable UI components
│   │   ├── 📁 layouts/       # Page layouts
│   │   └── 📁 auth/          # Auth components
│   ├── 📁 contexts/          # React contexts
│   ├── 📁 hooks/             # Custom hooks
│   └── 📁 lib/               # Utilities & API client
│
├── 📁 .github/workflows/     # CI/CD pipelines
├── 📄 docker-compose.yml     # Docker configuration
└── 📄 README.md              # This file
```

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Frontend Tests
```bash
cd frontend

# Component tests
npm run test

# With coverage
npm run test -- --coverage
```

## 🔄 CI/CD Pipeline

The project uses GitHub Actions for continuous integration:

```
📋 Pipeline Stages
├── 🔍 Lint      → Code quality checks
├── 🧪 Test      → Unit & integration tests
└── 🏗️ Build     → Production build verification
```

Pipeline runs on:
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| 🟤 Primary Gold | `#d4a574` | Primary buttons, CTAs |
| 🔵 Secondary Teal | `#5eaaa8` | Secondary elements, icons |
| ⬛ Background | `#0f1419` | Dark theme background |
| 🔘 Elevated | `#22303f` | Cards, elevated surfaces |

### UI Components

The frontend includes a comprehensive component library:
- `Button` - Multiple variants (primary, secondary, outline, ghost)
- `Input` - Form inputs with validation states
- `Card` - Content containers
- `LoadingSpinner` - Loading states
- `ErrorAlert` - Error display

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Participant** | Browse events, register, download tickets |
| **Admin** | Full CRUD, approve registrations, manage users |

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [TypeORM](https://typeorm.io/) - TypeScript ORM

---

<div align="center">

**Made with ❤️ by the BookMyEvent Team**

[⬆ Back to top](#-bookmyevent)

</div>
