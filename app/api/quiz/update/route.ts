import { prisma } from "@/components/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = await prisma.quiz.update(
      {
        where: {
          id: Number(json.id),
        },
        data: {
          ...json,
        }
      }
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500});
  }
  
}