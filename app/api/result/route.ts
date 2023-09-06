import { prisma } from "@/components/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const req = await request.json();

    if (
      Prisma.ResultScalarFieldEnum.userId in req && 
      Prisma.ResultScalarFieldEnum.quizId in req &&
      Prisma.ResultScalarFieldEnum.isCorrect in req
    ) {
      const result = await prisma.result.create({
        data: {
          userId: req.userId,
          quizId: req.quizId,
          isCorrect: req.isCorrect,
        }
      });

      return NextResponse.json(result, { status: 200});
    }
    return NextResponse.json(`Wrong params: ${req}`, { status: 500});
  } catch (error) {
    return NextResponse.json({ error }, { status: 500});
  }
}