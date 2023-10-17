import { prisma } from "@/components/prisma";
import { NextResponse } from "next/server";


// get quiz by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const result = await prisma.quiz.findUnique({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}