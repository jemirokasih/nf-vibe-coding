import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, NewUser } from "@/db/schema";

// Strip password from user object before returning
function sanitize(user: typeof users.$inferSelect) {
  const { password: _pwd, ...safe } = user;
  return safe;
}

export async function getAllUsers() {
  const rows = await db.select().from(users);
  return rows.map(sanitize);
}

export async function getUserById(id: number) {
  const rows = await db.select().from(users).where(eq(users.id, id));
  if (!rows.length) return null;
  return sanitize(rows[0]);
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  if (!data.name || !data.email || !data.password) {
    throw new Error("name, email, and password are required");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser: NewUser = {
    name: data.name,
    email: data.email,
    password: hashedPassword,
  };

  const [result] = await db.insert(users).values(newUser);
  const insertId = (result as { insertId: number }).insertId;
  const created = await db.select().from(users).where(eq(users.id, insertId));
  return sanitize(created[0]);
}

export async function updateUser(
  id: number,
  data: { name?: string; email?: string; password?: string }
) {
  const existing = await db.select().from(users).where(eq(users.id, id));
  if (!existing.length) return null;

  const updates: Partial<NewUser> = {};
  if (data.name) updates.name = data.name;
  if (data.email) updates.email = data.email;
  if (data.password) updates.password = await bcrypt.hash(data.password, 10);

  if (!Object.keys(updates).length) {
    return sanitize(existing[0]);
  }

  await db.update(users).set(updates).where(eq(users.id, id));
  const updated = await db.select().from(users).where(eq(users.id, id));
  return sanitize(updated[0]);
}

export async function deleteUser(id: number) {
  const existing = await db.select().from(users).where(eq(users.id, id));
  if (!existing.length) return false;
  await db.delete(users).where(eq(users.id, id));
  return true;
}
