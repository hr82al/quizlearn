import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (typeof id !== "object") {
    try {
      const result = await prisma.quiz.findUnique({where: {id: Number(id)}});
      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 })
    }
  } else {
    return NextResponse.json({ error: "Request does not contain params" }, { status: 500 });
  }
}