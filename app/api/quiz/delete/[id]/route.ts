import { options } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/components/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params: { id }}: { params: { id: string }}
) {
  try {
    const session = await getServerSession(options);
    if (session === null) {
      throw new Error("There is no session.");
    }

    if (typeof session.user.name !== "string" && typeof session.user.email !== "string") {
      throw new Error("Session doesn't have user's data");
    }

    const quiz = await prisma.quiz.findUnique({ where: { id: +id }});

    if (quiz?.ownerEmail !== session.user.email) {
      throw new Error(`You cannot remove this quiz. You doesn't own it. Your name is ${session.user.name} but this quiz belong to ${quiz?.ownerName}`);
    }
    const result = await prisma.quiz.delete({
      where: {
        id: Number(id),
      }
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message  }, { status: 500});
  }
}