# NF Vibe Coding

Next.js + MySQL user management app built with Drizzle ORM.

## Stack

- **Framework**: Next.js (App Router, TypeScript)
- **Database**: MySQL
- **ORM**: Drizzle ORM

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```
DATABASE_URL=mysql://user:password@localhost:3306/nf_vibe_coding
```

### 3. Run database migration

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 4. Start dev server

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Features

- List all users
- Create new user
- View user detail
- Edit user
- Delete user

## API Routes

| Method | Endpoint         | Description      |
|--------|-----------------|------------------|
| GET    | /api/users       | List all users   |
| POST   | /api/users       | Create user      |
| GET    | /api/users/:id   | Get user by id   |
| PUT    | /api/users/:id   | Update user      |
| DELETE | /api/users/:id   | Delete user      |
