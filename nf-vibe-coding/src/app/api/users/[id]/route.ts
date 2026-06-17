import { NextRequest } from "next/server";
import { handleGetById, handleUpdate, handleDelete } from "@/routes/users";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return handleGetById(request, Number(id));
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return handleUpdate(request, Number(id));
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return handleDelete(request, Number(id));
}
