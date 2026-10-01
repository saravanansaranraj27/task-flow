# TaskFlow

> A full-stack workspace for managing tasks, quick notes, and long-term goals — built with React 19, Vite 8, a Go standard-library API, and MySQL.

![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Go](https://img.shields.io/badge/Go-1.22%2B-00add8?logo=go&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479a1?logo=mysql&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.19%2B-339933?logo=node.js&logoColor=white)
![ESLint](https://img.shields.io/badge/Lint-ESLint-4b32c3?logo=eslint&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-0f766e)

TaskFlow is a responsive React application backed by a Go service and a MySQL database. Users can sign in, manage tasks with status tracking, capture colorful quick notes, and set goals with progress sliders, all from one dashboard.

The project is split into two folders, `task-flow-backend` and `task-flow-frontend`, plus a `schema.sql` file that creates the database. The frontend and backend run as separate processes, and in development Vite proxies API requests to the backend.

> ⚠️ **Local development project.** Passwords are stored in plain text, and the task, note, and goal endpoints do not check who is calling them. See [Limitations](#limitations) before using it anywhere other than your own machine.

## Contents

- [System coverage](#system-coverage)
- [Features](#features)
- [Quick start](#quick-start)
- [Using the app](#using-the-app)
- [API endpoints](#api-endpoints)
- [Database](#database)
- [Configuration](#configuration)
- [Project structure](#project-structure)
- [Technology](#technology)
- [Development commands](#development-commands)
- [Build and deployment](#build-and-deployment)
- [Linting](#linting)
- [Troubleshooting](#troubleshooting)
- [Complete command reference](#complete-command-reference)
- [Limitations](#limitations)
- [Contributing](#contributing)
- [License](#license)

## System coverage

The project has **3 parts** that run together.

| Part     | Folder               | Runs on                 | Purpose                                                   |
| -------- | -------------------- | ----------------------- | --------------------------------------------------------- |
| Frontend | `task-flow-frontend` | `http://localhost:5173` | React interface, with a dev proxy for `/api`              |
| Backend  | `task-flow-backend`  | `http://localhost:8080` | Go service with 4 endpoints for auth, tasks, notes, goals |
| Database | MySQL server         | `localhost:3306`        | Stores users, tasks, notes, and goals                     |

### Views

The frontend has **5 views**, switched with in-app state rather than a router.

| View      | File                            | Purpose                                   |
| --------- | ------------------------------- | ----------------------------------------- |
| Login     | `pages/Auth/LoginView.jsx`      | Sign in or create an account              |
| Dashboard | `pages/Dashboard/Dashboard.jsx` | Stats, recent activity, and quick actions |
| My Tasks  | `pages/Tasks/TaskView.jsx`      | Add, filter, edit, and delete tasks       |
| Notes     | `pages/Notes/NoteView.jsx`      | Add, edit, color, and delete notes        |
| Goals     | `pages/Goals/GoalView.jsx`      | Add, edit, track, and delete goals        |

### Dashboard

| Item            | How it is calculated                                                                         |
| --------------- | -------------------------------------------------------------------------------------------- |
| Tasks Done      | Tasks with the `done` status                                                                 |
| Pending         | All tasks that are not `done`, so it includes `in_progress`                                  |
| Notes           | Total number of notes                                                                        |
| Active Goals    | Goals with progress below 100                                                                |
| Recent Activity | The 5 newest tasks, notes, and goals by creation time, with a relative time such as `2h ago` |

The dashboard loads fresh data from the API each time you open it.

### Tasks, notes, and goals

| Item | Fields                                                                                     |
| ---- | ------------------------------------------------------------------------------------------ |
| Task | Title, optional description, and status: Pending, In Progress, or Done                     |
| Note | Title, content, and one of 5 colors: `#ffffff`, `#fef3c7`, `#dbeafe`, `#dcfce7`, `#f3e8ff` |
| Goal | Title, target date (required in the interface), and progress from 0 to 100                 |

## Features

| Area            | Capabilities                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------- |
| Tasks           | Creates, lists, filters by status, edits, and deletes tasks                                       |
| Notes           | Creates colorful notes, edits their content and color, and deletes them                           |
| Goals           | Sets goals with target dates, edits them, and updates progress with a slider that saves on change |
| Accounts        | Creates accounts with a name, email, and password, signs in, and keeps the session across reloads |
| Dashboard       | Shows task, note, and goal stats, recent activity, and quick action shortcuts                     |
| Editing         | Edits tasks, notes, and goals in a shared modal pattern                                           |
| Delete safety   | Asks for confirmation before deleting a task, note, or goal, and closes on `Esc`                  |
| Theming         | Switches light and dark mode and remembers your choice, with dark as the default                  |
| Navigation      | Provides a sidebar with a hamburger menu on small screens                                         |
| Loading states  | Shows a spinner for 800ms on first load, and while data loads                                     |
| Back to top     | Shows a floating button after scrolling past 300px in the main content area                       |
| Layered backend | Separates the Go code into config, handler, middleware, model, repository, and service layers     |
| ESLint          | Lints the frontend with a flat config, React Hooks rules, and React Refresh rules                 |

## Quick start

### Requirements

- Go 1.22 or newer
- Node.js 20.19 or newer (or 22.13 or newer), as required by Vite 8 and ESLint 10
- npm
- MySQL 8 or a compatible server
- Visual Studio Code is recommended

### Clone the repository

```bash
git clone https://github.com/saravanansaranraj27/task-flow.git
cd task-flow
```

### Create the database

`schema.sql` creates the `taskflow_db` database and its four tables. Make sure MySQL is running, then run it from the project root.

In PowerShell, which does not support `<` redirection, use `cmd`:

```powershell
cmd /c "mysql -u root -p < schema.sql"
```

In Command Prompt, macOS, or Linux:

```bash
mysql -u root -p < schema.sql
```

MySQL prompts for your password. The script is safe to run again, because it uses `IF NOT EXISTS`.

### Configure the backend

Create `task-flow-backend/.env` with your MySQL connection details:

```env
DB_USER=your_mysql_user
DB_PASS=your_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=taskflow_db
SERVER_PORT=8080
```

The password variable is `DB_PASS`. `SERVER_PORT` is optional and defaults to `8080`. `.env` is excluded from Git by `.gitignore`. Keep it that way, and never share it.

### Install the backend dependencies

```bash
cd task-flow-backend
go mod download
```

### Install the frontend dependencies

In a second terminal:

```bash
cd task-flow-frontend
npm install
```

`lucide-react` is already listed in `package.json`, so no separate install is needed.

### Verify the tools

```bash
go version
node --version
```

### Verify the project

```bash
cd task-flow-backend
go vet ./...
cd ../task-flow-frontend
npm run lint
npm run build
```

## Using the app

### Start the backend

From `task-flow-backend`:

```powershell
go run cmd/server/main.go
```

The server logs `Connected to MySQL successfully` and then starts on:

```text
http://localhost:8080
```

If it cannot reach the database, it stops with `Failed to ping DB`.

### Start the frontend

From `task-flow-frontend`, in a second terminal:

```powershell
npm run dev
```

The app runs at:

```text
http://localhost:5173/
```

### Workflow

1. Open the frontend and select **Create one** to make an account with a name, email, and password of at least 6 characters. Registering also signs you in
2. Use the **Dashboard** for an overview of your stats and recent activity
3. Open **My Tasks** to add tasks, filter them by status, and edit or delete them
4. Open **Quick Notes** to capture ideas with a background color, and edit them any time
5. Open **Goals** to set a title and target date, edit the details, and update progress with the slider
6. Confirm each deletion in the dialog
7. Use the theme toggle in the sidebar to switch between light and dark mode. On smaller screens, open the sidebar with the hamburger menu
8. Select **Sign Out** in the sidebar to leave

## API endpoints

The backend runs at `http://localhost:8080`. Request and response bodies are JSON, and errors use the form `{ "error": "message" }`. None of the endpoints need an authentication header.

### Authentication

Both actions use `POST /api/auth` with an `action` query parameter. Any other method returns `405`.

| Action             | Body                        | Success                          | Errors                                                                              |
| ------------------ | --------------------------- | -------------------------------- | ----------------------------------------------------------------------------------- |
| `?action=register` | `name`, `email`, `password` | `201` with `{ id, email, name }` | `400` missing fields or password under 6 characters, `409` email already registered |
| `?action=login`    | `email`, `password`         | `200` with `{ id, email, name }` | `401` invalid email or password                                                     |

An unknown or missing `action` returns `400`.

### Tasks

| Method | Endpoint             | Description                                        | Success | Errors                                   |
| ------ | -------------------- | -------------------------------------------------- | :-----: | ---------------------------------------- |
| GET    | `/api/tasks`         | List tasks, newest first, with optional `?status=` |   200   |                                          |
| POST   | `/api/tasks`         | Create a task                                      |   201   | `400` empty title, `500` invalid status  |
| DELETE | `/api/tasks?id={id}` | Delete a task                                      |   204   | `400` bad or missing ID, `404` not found |

A task body is `{ "title": "...", "description": "...", "status": "pending" }`. The status is `pending`, `in_progress`, or `done`, and defaults to `pending`. A `?status=` filter with an unknown value returns an empty list.

### Notes

| Method | Endpoint             | Description   | Success | Errors                  |
| ------ | -------------------- | ------------- | :-----: | ----------------------- |
| GET    | `/api/notes`         | List notes    |   200   |                         |
| POST   | `/api/notes`         | Create a note |   201   | `400` empty title       |
| DELETE | `/api/notes?id={id}` | Delete a note |   204   | `400` bad or missing ID |

A note body is `{ "title": "...", "content": "...", "color": "#fef3c7" }`. Deleting an ID that does not exist still returns `204`.

### Goals

| Method | Endpoint             | Description                           | Success | Errors                                           |
| ------ | -------------------- | ------------------------------------- | :-----: | ------------------------------------------------ |
| GET    | `/api/goals`         | List goals, soonest target date first |   200   |                                                  |
| POST   | `/api/goals`         | Create a goal                         |   201   | `400` empty title, `500` missing or invalid date |
| PUT    | `/api/goals`         | Update a goal                         |   200   | `400` bad ID or empty title, `404` not found     |
| DELETE | `/api/goals?id={id}` | Delete a goal                         |   204   | `400` bad or missing ID, `404` not found         |

A goal body is `{ "title": "...", "target_date": "2026-12-31", "progress": 40 }`. Progress is limited to 0 through 100, so values outside that range are clamped.

`PUT /api/goals` has two forms:

| Form          | Body                                     | Effect                                |
| ------------- | ---------------------------------------- | ------------------------------------- |
| Full edit     | `id`, `title`, `target_date`, `progress` | Updates the title, date, and progress |
| Progress only | `id`, `progress`                         | Updates only the progress             |

The progress-only form is used when the body has no title and no target date.

The tasks and notes endpoints have no update method. The interface edits them by deleting the item and creating it again. See [Limitations](#limitations).

### CORS

Every route sends `Access-Control-Allow-Origin: http://localhost:5173` and allows the `GET`, `POST`, `PUT`, `DELETE`, and `OPTIONS` methods and the `Content-Type` header.

## Database

`schema.sql` creates the `taskflow_db` database and four tables.

| Table   | Columns                                                                                               |
| ------- | ----------------------------------------------------------------------------------------------------- |
| `users` | `id`, `email` (unique), `password`, `name`, `created_at`                                              |
| `tasks` | `id`, `title`, `description`, `status` (`pending`, `in_progress`, `done`), `created_at`, `updated_at` |
| `notes` | `id`, `title`, `content`, `color` (defaults to `#ffffff`), `created_at`                               |
| `goals` | `id`, `title`, `target_date`, `progress` (defaults to 0), `created_at`                                |

The `tasks` table has an index on `status`. The `tasks`, `notes`, and `goals` tables have no user column, so those records are shared by every account.

## Configuration

### Backend

The backend reads these variables from `task-flow-backend/.env`, or from the system environment if there is no `.env` file:

| Variable      | Default | Purpose                      |
| ------------- | ------- | ---------------------------- |
| `DB_USER`     | none    | MySQL user                   |
| `DB_PASS`     | none    | MySQL password               |
| `DB_HOST`     | none    | MySQL host                   |
| `DB_PORT`     | none    | MySQL port                   |
| `DB_NAME`     | none    | Database name, `taskflow_db` |
| `SERVER_PORT` | `8080`  | Port the API listens on      |

Only `SERVER_PORT` has a default. The `DB_*` variables must all be set. The connection uses a pool of up to 25 open and 5 idle connections.

### Frontend

The frontend has no environment variables. It calls relative `/api` URLs, and `vite.config.js` proxies them in development:

```js
server: {
  port: 5173,
  proxy: {
    "/api": { target: "http://localhost:8080", changeOrigin: true },
  },
},
```

If you change `SERVER_PORT`, update the proxy `target` to match.

### Browser storage

| Key             | Contents                                      |
| --------------- | --------------------------------------------- |
| `taskflow_user` | The signed-in user: `id`, `email`, and `name` |
| `theme`         | `light` or `dark`                             |

## Project structure

```text
task-flow/
├── task-flow-backend/
│   ├── cmd/
│   │   └── server/
│   │       └── main.go                    # Entry point: wiring, routes, and port
│   ├── internal/
│   │   ├── config/
│   │   │   └── db.go                      # Loads .env, opens and pings the MySQL pool
│   │   ├── handler/
│   │   │   ├── auth_handler.go            # /api/auth: register and login
│   │   │   ├── goal_handler.go            # /api/goals: list, create, update, delete
│   │   │   ├── note_handler.go            # /api/notes: list, create, delete
│   │   │   └── task_handler.go            # /api/tasks: list, create, delete
│   │   ├── middleware/
│   │   │   └── cors.go                    # CORS headers and preflight handling
│   │   ├── model/
│   │   │   ├── goal.go                    # Goal data type
│   │   │   ├── note.go                    # Note data type
│   │   │   ├── task.go                    # Task data type
│   │   │   └── user.go                    # User data type
│   │   ├── repository/
│   │   │   ├── goal_repository.go         # Goal SQL queries
│   │   │   ├── note_repository.go         # Note SQL queries
│   │   │   ├── task_repository.go         # Task SQL queries
│   │   │   └── user_repository.go         # User SQL queries
│   │   └── service/
│   │       ├── auth_service.go            # Registration rules and login
│   │       ├── errors.go                  # Shared validation errors
│   │       ├── goal_service.go            # Goal rules, including progress limits
│   │       ├── note_service.go            # Note rules
│   │       └── task_service.go            # Task rules and default status
│   ├── .env                               # Database settings (not committed)
│   ├── .gitignore                         # Excludes .env, binaries, and editor files
│   ├── go.mod                             # Go module and dependencies
│   └── go.sum                             # Dependency checksums
│
├── task-flow-frontend/
│   ├── public/
│   │   ├── favicon.svg                    # Site favicon
│   │   └── icons.svg                      # Static SVG icons
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js                    # Register and login requests
│   │   │   ├── client.js                  # Fetch wrapper and JSON request helper
│   │   │   ├── goals.js                   # Goal requests, including progress updates
│   │   │   ├── notes.js                   # Note requests
│   │   │   └── tasks.js                   # Task requests
│   │   ├── assets/
│   │   │   ├── hero.png                   # Image asset
│   │   │   ├── react.svg                  # Default Vite template asset
│   │   │   └── vite.svg                   # Default Vite template asset
│   │   ├── components/
│   │   │   ├── ConfirmDialog.jsx          # Delete confirmation dialog
│   │   │   └── ui/
│   │   │       ├── DateField.jsx          # Date input
│   │   │       └── ThemeSelect.jsx        # Custom select control
│   │   ├── data/
│   │   │   └── constants.js               # Dashboard quick actions and module cards
│   │   ├── hooks/
│   │   │   └── useDashboardData.js        # Dashboard stats and recent activity
│   │   ├── layouts/
│   │   │   └── AppLayout.jsx              # Sidebar, mobile menu, and back-to-top button
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   └── LoginView.jsx          # Sign in and create account
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.jsx          # Stats, activity, and quick actions
│   │   │   ├── Goals/
│   │   │   │   └── GoalView.jsx           # Goals page
│   │   │   ├── Notes/
│   │   │   │   └── NoteView.jsx           # Notes page
│   │   │   └── Tasks/
│   │   │       └── TaskView.jsx           # Tasks page
│   │   ├── styles/
│   │   │   ├── globals.css                # Global layout and component styles
│   │   │   ├── themes.css                 # Light and dark theme values
│   │   │   └── variables.css              # Shared CSS custom properties
│   │   ├── utils/
│   │   │   ├── date.js                    # Relative time helper
│   │   │   └── storage.js                 # Saved session helpers
│   │   ├── App.jsx                        # Session, theme, view switching, and loader
│   │   └── main.jsx                       # Entry point
│   ├── .gitignore                         # Git exclusions for generated files
│   ├── eslint.config.js                   # ESLint flat configuration
│   ├── index.html                         # HTML shell
│   ├── package.json                       # Dependencies and npm scripts
│   ├── package-lock.json                  # Locked npm dependency versions
│   └── vite.config.js                     # Vite config with the /api proxy
│
├── schema.sql                             # Creates the database and tables
└── README.md                              # Project documentation
```

## Technology

- [Go](https://go.dev/) standard library — `net/http` and `database/sql`, organized into config, handler, middleware, model, repository, and service layers
- [`go-sql-driver/mysql`](https://github.com/go-sql-driver/mysql) 1.8 — MySQL driver
- [`godotenv`](https://github.com/joho/godotenv) 1.5 — loads `.env` for backend configuration
- [MySQL](https://www.mysql.com/) — data storage
- [React 19](https://react.dev/) — interface components and hooks
- [Vite 8](https://vite.dev/) — frontend dev server, API proxy, and build
- [Lucide React](https://lucide.dev/) — icons
- CSS — CSS variables for light and dark theming, split across `variables.css`, `themes.css`, and `globals.css`, with no CSS framework
- [ESLint](https://eslint.org/) — frontend linting, with the React Hooks and React Refresh plugins

## Development commands

### Backend

Run from `task-flow-backend`.

#### Download dependencies

```powershell
go mod download
```

#### Start the API

```powershell
go run cmd/server/main.go
```

#### Build the binary

```powershell
go build -o taskflow ./cmd/server
```

#### Check the code with go vet

```powershell
go vet ./...
```

#### Check formatting

```powershell
gofmt -l .
```

`gofmt -l .` prints the names of files that are not formatted. No output means everything is formatted.

### Frontend

Run from `task-flow-frontend`.

#### Install dependencies

```powershell
npm install
```

#### Start the development server

```powershell
npm run dev
```

#### Create a production build

```powershell
npm run build
```

#### Preview the production build

```powershell
npm run preview
```

#### Run linting

```powershell
npm run lint
```

## Build and deployment

The project has no deployment configuration. It is set up for local development.

### Build the backend

```powershell
cd task-flow-backend
go build -o taskflow ./cmd/server
```

Run the binary with the `DB_*` variables in the environment or in a `.env` file in the working folder.

### Build the frontend

```powershell
cd task-flow-frontend
npm run build
```

The built files are located in `task-flow-frontend/dist/` and can be served by any static host.

### Connecting the two

The frontend calls relative `/api` URLs, and the dev proxy that forwards them exists only in `npm run dev`. In production, serve the frontend and the API from the same origin with a reverse proxy that forwards `/api` to the backend. The backend only allows the origin `http://localhost:5173`, so change `internal/middleware/cors.go` if you serve the app from another origin.

### Preview the production build

```powershell
npm run preview
```

`npm run preview` uses the same `/api` proxy settings from `vite.config.js`.

## Linting

The frontend uses ESLint with a flat configuration, with the React Hooks and React Refresh plugins.

```powershell
cd task-flow-frontend
npm run lint
```

The backend has no linter configured. Use the Go tools:

```powershell
cd task-flow-backend
go vet ./...
gofmt -l .
```

## Troubleshooting

### Node.js version error or build failure

Vite 8 needs Node.js 20.19 or newer (or 22.12 or newer), and ESLint 10 needs 22.13 or newer on the 22 line. Check your version:

```powershell
node --version
```

Install a supported version, then run `npm install` again.

### `Cannot find native binding` after copying the project

This happens when `node_modules` was installed on a different operating system. Delete it and reinstall:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### `go` is not recognized

Install Go 1.22 or newer and make sure it is on your `PATH`:

```powershell
go version
```

### The backend stops with `Failed to ping DB`

The server could not connect to MySQL. Check that:

- MySQL is running
- `.env` uses the variable names `DB_USER`, `DB_PASS`, `DB_HOST`, `DB_PORT`, and `DB_NAME`
- `DB_PORT` matches your MySQL port, usually `3306`
- The user and password are correct

### `Unknown database 'taskflow_db'`

`schema.sql` has not been run yet. Run it, then start the backend again:

```bash
mysql -u root -p < schema.sql
```

### `Access denied for user`

Check `DB_USER` and `DB_PASS` in `.env`. The password variable is `DB_PASS`, not `DB_PASSWORD`.

### The log says `No .env file found`

The backend looks for `.env` in the folder where you run it. Run `go run cmd/server/main.go` from `task-flow-backend`, or set the variables in the system environment.

### Port 8080 or 5173 is already in use

Set another port for the API in `.env`, and update the proxy `target` in `task-flow-frontend/vite.config.js` to match:

```env
SERVER_PORT=8081
```

For the frontend, the dev server port is set in `vite.config.js`.

### The frontend shows errors or empty lists, and Vite logs `ECONNREFUSED`

The backend is not running, or it is on a different port from the proxy `target`. Start the backend first, and check the port.

### Adding a task fails with `Failed to create task`

The API accepts only the statuses `pending`, `in_progress`, and `done`. Any other value is rejected by the database. The interface always sends a valid status.

### Editing a task or note changed its position or date

Edits delete the item and create it again, so the item gets a new ID and creation time. See [Limitations](#limitations).

### The theme resets or the sign-in disappears

Both are saved in your browser's `localStorage` under `theme` and `taskflow_user`. They are removed when site data is cleared.

## Complete command reference

### General

```powershell
git clone https://github.com/saravanansaranraj27/task-flow.git
go version
node --version
```

### Database

Run from the project root:

```powershell
cmd /c "mysql -u root -p < schema.sql"
```

### Backend

Run from `task-flow-backend`:

```powershell
go mod download
go run cmd/server/main.go
go build -o taskflow ./cmd/server
go vet ./...
gofmt -l .
```

### Frontend

Run from `task-flow-frontend`:

```powershell
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Limitations

- Passwords are stored and compared as plain text. Use the project only for local development, or replace authentication before production use.
- Registration trims spaces from the password, but login does not, so a password with leading or trailing spaces cannot be used to sign in.
- The task, note, and goal endpoints do not check who is calling. Signing in only controls the interface, and anyone who can reach the API can read and change every record.
- Tasks, notes, and goals are shared by all accounts, because those tables have no user column.
- Editing a task or note deletes it and creates it again, so it gets a new `id` and `created_at`. The two requests are not atomic, so if the create step fails, the item is already deleted.
- The API does not validate a task's status. An unknown status fails in the database and returns `500`.
- Creating a goal without a target date through the API returns `500`. The interface requires a date.
- Create responses for tasks, notes, and goals do not include the saved creation time. Tasks return a zero time, and notes and goals return an empty value. The interface reloads the list instead.
- Deleting a note that does not exist returns `204`, while tasks and goals return `404`.
- Tasks have no priority field, although some interface text mentions priorities.
- `db.SetConnMaxLifetime(5 * 60)` is a duration of 300 nanoseconds, not 5 minutes, so pooled connections are replaced almost immediately. Use `5 * time.Minute` to get the intended behavior.
- The Vite proxy target is fixed to `http://localhost:8080`, and CORS allows only `http://localhost:5173`.
- The frontend does not remember the current view, so a reload returns to the dashboard.
- No automated tests are included in the project.

## Contributing

Bug reports, improvements, and pull requests are welcome.

Keep changes focused and verify them before opening a pull request:

```powershell
cd task-flow-backend
go vet ./...
cd ../task-flow-frontend
npm run lint
npm run build
```

## License

This project is licensed under the MIT License.
