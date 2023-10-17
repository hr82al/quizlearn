import { prisma } from "@/components/prisma";
import { isQuizRecord } from "@/redux/features/quiz/quizSlice";
import { NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";



export async function POST(request: Request, response: Response) {
  try {
    const json = await request.json();
    const session = await getServerSession(options);
    if (session === null) {
      throw new Error("There is no session.");
    }

    if (typeof session.user.name !== "string" && typeof session.user.email !== "string") {
      throw new Error("Session doesn't have user's data");
    }
    if (isQuizRecord(json)) {
      const result = await prisma.quiz.create({
        data: {
          question: json.question,
          variants: JSON.stringify(json.variants),
          category: json.category,
          isRadio: json.isRadio,
          isShort: json.isShort,
          answers: JSON.stringify(json.answers),
          ownerEmail: session.user.email!,
          ownerName: session.user.name!,
        }
      });
      return NextResponse.json(result, { status: 200 });
    }
    return NextResponse.json({ error: `Unknown request`, request: json}, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500});
  }
}
