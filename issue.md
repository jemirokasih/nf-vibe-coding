# Planning: User Management Feature

## Overview
Implementasi fitur manajemen user lengkap dengan tabel database, API routes, dan struktur folder yang terorganisir.

---

## Database Schema

Buat tabel `users` di Drizzle ORM schema (`src/db/schema.ts`):

| Column       | Type           | Constraint                        |
|-------------|----------------|-----------------------------------|
| id          | integer        | primary key, auto increment       |
| name        | varchar(255)   | not null                          |
| email       | varchar(255)   | not null, unique                  |
| password    | varchar(255)   | not null (bcrypt hash)            |
| created_at  | timestamp      | default current_timestamp         |
| updated_at  | timestamp      | default current_timestamp on update |

---

## Folder Structure

Semua file berada di dalam `src/`:

```
src/
├── app/
│   └── api/
│       └── users/
│           ├── route.ts          ← GET all, POST create
│           └── [id]/
│               └── route.ts      ← GET by id, PUT update, DELETE
├── routes/
│   └── users.ts                  ← handler wiring (memanggil service)
├── services/
│   └── userService.ts            ← business logic (CRUD, validasi, hashing)
└── db/
    └── schema.ts                 ← Drizzle schema (update tabel users)
```

---

## API Endpoints

| Method | Endpoint         | Deskripsi              |
|--------|-----------------|------------------------|
| GET    | /api/users       | Ambil semua user       |
| POST   | /api/users       | Buat user baru         |
| GET    | /api/users/:id   | Ambil user by ID       |
| PUT    | /api/users/:id   | Update user by ID      |
| DELETE | /api/users/:id   | Hapus user by ID       |

---

## Tahapan Implementasi

### Step 1 — Install dependency
- Install `bcryptjs` dan type-nya: `npm install bcryptjs && npm install -D @types/bcryptjs`

### Step 2 — Update DB Schema
- Edit `src/db/schema.ts`
- Tambahkan kolom `password`, `updatedAt` ke tabel `users`
- Jalankan `npx drizzle-kit generate` lalu `npx drizzle-kit migrate`

### Step 3 — Buat `src/services/userService.ts`
Berisi fungsi-fungsi business logic:
- `getAllUsers()` — query semua user, exclude field `password` dari response
- `getUserById(id)` — query single user, return 404 jika tidak ditemukan
- `createUser(data)` — validasi input, hash password dengan bcrypt, insert ke DB
- `updateUser(id, data)` — update name/email, hash password baru jika dikirim, set `updatedAt`
- `deleteUser(id)` — cek user exist, lalu delete

### Step 4 — Buat `src/routes/users.ts`
Berisi handler function untuk setiap route yang memanggil service:
- `handleGetAll(request)` → panggil `getAllUsers()`
- `handleGetById(request, id)` → panggil `getUserById(id)`
- `handleCreate(request)` → parse body, panggil `createUser(data)`
- `handleUpdate(request, id)` → parse body, panggil `updateUser(id, data)`
- `handleDelete(request, id)` → panggil `deleteUser(id)`

Setiap handler wrap response dalam `NextResponse.json()` dengan status code yang tepat.

### Step 5 — Buat/Update API Route files

**`src/app/api/users/route.ts`**
- Export `GET` → panggil `handleGetAll`
- Export `POST` → panggil `handleCreate`

**`src/app/api/users/[id]/route.ts`**
- Export `GET` → panggil `handleGetById`
- Export `PUT` → panggil `handleUpdate`
- Export `DELETE` → panggil `handleDelete`

### Step 6 — Error Handling
- Semua handler harus return response dengan HTTP status yang tepat:
  - `200` success
  - `201` created
  - `400` bad request (validasi gagal)
  - `404` not found
  - `500` internal server error
- Jangan expose stack trace ke response

### Step 7 — Verifikasi
- Jalankan `npm run build` — harus sukses tanpa error TypeScript
- Test manual setiap endpoint dengan curl atau Postman

---

## Catatan Penting
- Password **tidak boleh** pernah dikembalikan di response API
- Gunakan `bcrypt.hash(password, 10)` untuk hashing
- Gunakan `bcrypt.compare(plain, hash)` untuk verifikasi (jika nanti perlu login)
- `updatedAt` diupdate otomatis setiap kali row diupdate
