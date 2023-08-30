import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

function isNumber(value: string | null): boolean {
  if (typeof value !== "string") {
    return false;
  } else if (!isNaN(Number(value)) && value !== "") {
    return true;
  }
  return false;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const n = searchParams.get("n");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  try {
    if (isNumber(n)) {
      const result = await prisma.quiz.findFirst({ skip: Number(n) });
      return NextResponse.json(result, { status: 200 });
    } else if (isNumber(start) && isNumber(end)) {

      const result = await prisma.quiz.findMany({
        skip: Number(start),
        take: Number(end) - Number(start),
      });
      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json({ error: `Error: n: ${n}, start: ${start}, end: ${end}`}, { status: 500 });
}