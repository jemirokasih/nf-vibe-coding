import { NextRequest } from "next/server";
import { handleGetAll, handleCreate } from "@/routes/users";

export async function GET() {
  return handleGetAll();
}

export async function POST(request: NextRequest) {
  return handleCreate(request);
}
