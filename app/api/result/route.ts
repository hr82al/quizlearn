import { prisma } from "@/components/prisma";
import { Prisma, Result } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"
import { options } from "../auth/[...nextauth]/options";

type ResultT = Result | Result[] | null;

async function runProtectByUserId(fn: (userId: number) => Promise<ResultT>) {
  const session = await getServerSession(options);
  const userId = session?.user.id;
  if (typeof userId === "number") {
    try {
      const result = await fn(userId);
      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  } else {
    return NextResponse.json("You must login to view the protected content.", { status: 500 });
  }
}

export async function POST(request: Request) {
  return await runProtectByUserId(async (userId) => {
    const req = await request.json();
    if (
      Prisma.ResultScalarFieldEnum.quizId in req &&
      Prisma.ResultScalarFieldEnum.isCorrect in req
    ) {
      const result = await prisma.result.create({
        data: {
          userId: userId,
          quizId: req.quizId,
          isCorrect: req.isCorrect,
        }
      });
      return result;
    }
    return null;
  });
}

export async function GET() {
  return await runProtectByUserId(async (userId) => {
    const result = await prisma.result.findMany({
      where: {
        userId: userId,
      }
    })
    return result;
  });
}