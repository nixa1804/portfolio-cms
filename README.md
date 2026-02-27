# Portfolio CMS

A headless content management system for managing portfolio projects. Built with Next.js App Router, Turso (cloud SQLite), and GitHub OAuth — enables updating project content without touching source code.

**Live demo:** [portfolio-cms-nl.vercel.app](https://portfolio-cms-nl.vercel.app/)

---

## Features

- **Public project pages** — browsable project list, detail pages, and case study pages
- **Admin dashboard** — protected CRUD panel for creating, editing, and deleting projects
- **GitHub OAuth** — single-admin authentication via GitHub, whitelisted by username
- **REST API** — `/api/projects` endpoints consumed by the admin panel
- **Case studies** — optional per-project deep-dive with challenge, solution, architecture, and outcomes
- **Status system** — In Development / Completed / Archived with colour-coded badges
- **Persistent sessions** — JWT-based, 7-day cookie lifetime
- **Responsive** — mobile-first layout throughout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Turso (cloud SQLite via `@libsql/client`) |
| Auth | NextAuth.js v5 (GitHub OAuth) |
| Validation | Zod v4 |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── page.tsx       # Projects listing
│   │   └── projects/[slug]/
│   │       ├── page.tsx         # Project detail
│   │       └── case-study/page.tsx
│   ├── admin/             # Protected admin panel
│   │   ├── page.tsx       # Dashboard with stats
│   │   ├── login/         # GitHub OAuth login
│   │   └── projects/      # CRUD pages
│   └── api/
│       └── projects/      # REST API routes
├── components/
│   ├── admin/             # ProjectForm, ProjectsTable
│   ├── projects/          # ProjectCard, CaseStudyContent
│   └── ui/                # Badge, Tag, Card, BackLink
└── lib/
    ├── auth.ts            # NextAuth config
    ├── db.ts              # Turso client
    ├── queries.ts         # SQL queries
    ├── types.ts           # TypeScript types
    └── validation.ts      # Zod schemas
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Turso](https://turso.tech) account (free tier works)
- GitHub OAuth App

### 1. Clone and install

```bash
git clone https://github.com/nixa1804/portfolio-cms.git
cd portfolio-cms
npm install
```

### 2. Create a Turso database

Sign up at [app.turso.io](https://app.turso.io), create a database, and copy the URL and auth token.

### 3. Create a GitHub OAuth App

Go to GitHub → Settings → Developer settings → OAuth Apps → New OAuth App:

- Homepage URL: `http://localhost:3000`
- Callback URL: `http://localhost:3000/api/auth/callback/github`

### 4. Set up environment variables

```env
AUTH_SECRET=            # openssl rand -base64 32
AUTH_GITHUB_ID=         # GitHub OAuth Client ID
AUTH_GITHUB_SECRET=     # GitHub OAuth Client Secret
TURSO_DATABASE_URL=     # libsql://your-db.turso.io
TURSO_AUTH_TOKEN=       # Turso auth token
NEXT_PUBLIC_APP_URL=    # http://localhost:3000
ADMIN_GITHUB_USERNAME=  # your GitHub username
```

### 5. Run migrations and seed

```bash
npm run db:migrate   # creates the projects table
npm run db:seed      # inserts 2 example projects
```

### 6. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

---

## Deployment (Vercel)

1. Push to GitHub and connect the repo on [vercel.com](https://vercel.com)
2. Add all environment variables in Vercel project settings (`NEXT_PUBLIC_APP_URL` should be your production domain)
3. Update the GitHub OAuth App callback URL to `https://your-domain.vercel.app/api/auth/callback/github`

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/projects` | — | List all projects |
| POST | `/api/projects` | ✓ | Create a project |
| GET | `/api/projects/[slug]` | — | Get a project |
| PUT | `/api/projects/[slug]` | ✓ | Update a project |
| DELETE | `/api/projects/[slug]` | ✓ | Delete a project |
