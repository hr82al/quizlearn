import { prisma } from "@/components/prisma";
import { NextResponse } from "next/server";


// get quiz range from start to end
export async function GET(
  _request: Request,
  { params: { start, end } }:
    { params: { start: number, end: number } }
) {
  try {
    const result = await prisma.quiz.findMany({
      skip: Number(start),
      take: Number(end - start),
    });
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}