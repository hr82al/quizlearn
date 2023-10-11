import { prisma } from "@/components/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params: { id }}: { params: { id: number }}
) {
  try {
    const result = await prisma.quiz.delete({
      where: {
        id: Number(id),
      }
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500});
  }
}