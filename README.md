<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

# 🔄 SyncFlow

**SyncFlow** is a modern, collaborative project management application built with the MERN stack. It features a Kanban-style task board with drag-and-drop, real-time activity tracking, team member management, and a polished UI with full dark mode support.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Kanban Task Board** | Drag-and-drop task management with `@dnd-kit` across Todo → In Progress → Done columns |
| **Project Management** | Create projects, invite team members by email, and track progress |
| **Dark / Light Mode** | System-aware theme toggle with `localStorage` persistence |
| **Zod Validation** | Client-side schema validation for auth, projects, and tasks |
| **Activity Feed** | Real-time activity log per project (task created, status changed, etc.) |
| **Search & Sort** | Client-side filtering by status, search by title/description, sort by date/priority/user |
| **Responsive Design** | Mobile-first layout with collapsible sidebar and snap-scroll Kanban |
| **JWT Authentication** | Secure signup/login with token-based session management |
| **Pagination** | Server-side paginated task lists with navigation controls |

---

## 🛠 Tech Stack

### Frontend (`/client`)

- **React 19** — UI component library
- **React Router 7** — Client-side routing with protected/guest routes
- **Tailwind CSS 4** — Utility-first styling with custom dark mode variant
- **@dnd-kit** — Accessible drag-and-drop for the Kanban board
- **Zod** — Runtime schema validation for forms
- **Axios** — HTTP client with interceptors for JWT auth
- **Lucide React** — Icon library
- **Vite 8** — Build tool and dev server

### Backend (`/server`)

- **Express 5** — REST API framework
- **MongoDB + Mongoose 9** — Database and ODM
- **JWT** — Stateless authentication
- **bcrypt** — Password hashing

---

## 📁 Project Structure

```
SyncFlow/
├── client/                         # React frontend
│   ├── index.html                  # Entry HTML with Google Fonts
│   ├── vite.config.js              # Vite + Tailwind CSS plugin config
│   └── src/
│       ├── api/                    # Axios instance & API modules
│       │   ├── axios.js            # Base config with JWT interceptor
│       │   ├── auth.api.js         # Login, signup, getMe
│       │   ├── projects.api.js     # CRUD + member management
│       │   ├── tasks.api.js        # CRUD + status updates
│       │   └── activities.api.js   # Activity log fetching
│       ├── components/
│       │   ├── activities/         # ActivityFeed sidebar
│       │   ├── layout/             # AppShell, Sidebar, TopBar
│       │   ├── projects/           # ProjectCard, CreateProjectModal, AddMemberModal
│       │   ├── tasks/              # TaskCard, DroppableColumn, SortableTaskCard, Modals
│       │   └── ui/                 # Badge, Modal, StatCard, EmptyState, AvatarGroup, Pagination
│       ├── constants/              # Nav items, status/priority enums & styles
│       ├── context/                # AuthContext, ThemeContext
│       ├── hooks/                  # useProjects, useTasks, useActivities
│       ├── pages/                  # AuthPage, DashboardPage, ProjectsPage, ProjectDetailsPage, TasksPage, SettingsPage
│       ├── validation/             # Zod schemas (auth, project, task)
│       ├── index.css               # Tailwind imports, theme tokens, dark mode styles
│       ├── main.jsx                # App entry — wraps with ThemeProvider + AuthProvider
│       └── App.jsx                 # Router config with protected routes
│
└── server/                         # Express backend
    ├── .env                        # Environment variables
    └── src/
        ├── app.js                  # Express app with middleware & route mounting
        ├── server.js               # HTTP server + MongoDB connection
        ├── config/                 # Database config
        ├── constants/              # API response constants
        ├── middlewares/            # Auth middleware (JWT verification)
        ├── models/                 # Mongoose schemas (User, Project, Task, Activity)
        ├── modules/                # Feature modules (auth, projects, tasks, activities)
        └── utiles/                 # ApiError, ApiResponse, asyncHandler utilities
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/SyncFlow.git
cd SyncFlow
```

### 2. Setup the Server

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/syncflow
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your-super-secret-jwt-key
ACCESS_TOKEN_EXPIRY=7d
```

Start the server:

```bash
npm run dev        # Development (with nodemon)
npm start          # Production
```

### 3. Setup the Client

```bash
cd client
npm install
npm run dev
```

The client runs on `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and receive JWT |
| `GET` | `/api/auth/me` | Get current user profile |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | List all user's projects |
| `POST` | `/api/projects` | Create a new project |
| `POST` | `/api/projects/:id/members` | Add a member by email |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks/:projectId` | List tasks (with pagination & status filter) |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update task details |
| `PATCH` | `/api/tasks/:id/status` | Update task status |
| `DELETE` | `/api/tasks/:id` | Delete a task |

### Activities
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/activities/:projectId` | Get project activity log |

---

## 🎨 Theming

SyncFlow uses **Tailwind CSS v4** with a custom dark mode variant:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

- **Fonts**: Inter (body) + Plus Jakarta Sans (headings) via Google Fonts
- **Dark mode**: Toggled via `.dark` class on `<html>`, persisted in `localStorage`
- **Theme toggle**: Available in the TopBar (icon) and Settings page (card selector)
- **Color tokens**: Defined in `@theme` block in `index.css` — brand palette + dark surface colors

---

## ✅ Validation

All form inputs are validated client-side using **Zod** schemas before API calls:

| Schema | File | Validates |
|--------|------|-----------|
| `loginSchema` | `auth.schema.js` | Email format, password ≥ 6 chars |
| `signupSchema` | `auth.schema.js` | Name ≥ 2 chars, email, password |
| `createProjectSchema` | `project.schema.js` | Title 2–80 chars, description ≤ 500 |
| `addMemberSchema` | `project.schema.js` | Valid email format |
| `createTaskSchema` | `task.schema.js` | Title 2–120 chars, description ≤ 1000, priority enum |
| `updateTaskSchema` | `task.schema.js` | Same as create (without assignedTo) |

---

## 📜 Available Scripts

### Client

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Production build to `/dist` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Server

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (auto-restart) |
| `npm start` | Start production server |

---

## 🗺 Roadmap

- [ ] **Profile Settings** — Update name, avatar, and bio
- [ ] **Notifications** — Email, push, and in-app notification preferences
- [ ] **Security & Privacy** — Password management, 2FA, active sessions
- [ ] **Language & Region** — Timezone, locale, and date format settings
- [ ] **Billing & Plans** — Subscription management and invoicing
- [ ] **Real-time Updates** — WebSocket integration for live collaboration
- [ ] **File Attachments** — Upload and attach files to tasks
- [ ] **Comments** — Discussion threads on tasks

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using React, Express, MongoDB, and Tailwind CSS
</p>
