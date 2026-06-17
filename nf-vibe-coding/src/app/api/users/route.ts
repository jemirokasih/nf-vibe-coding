import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, NewUser } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newUser: NewUser = {
      name: body.name,
      email: body.email,
    };
    const [result] = await db.insert(users).values(newUser);
    const insertId = (result as { insertId: number }).insertId;
    const created = await db.select().from(users).where(eq(users.id, insertId));
    return NextResponse.json(created[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
