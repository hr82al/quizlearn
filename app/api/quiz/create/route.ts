import { prisma } from "@/components/prisma";
import { QuizWithEmail } from "@/redux/features/quiz/quizSlice";
import { NextResponse } from "next/server";


function isQuizWithEmail(value: any): value is QuizWithEmail {
  let x = value as QuizWithEmail;
  return (
    x.data !== undefined && 
    x.data.answers !== undefined && 
    x.data.category !== undefined && 
    x.data.isRadio !== undefined && 
    x.data.isShort !== undefined &&
    x.data.question !== undefined &&
    x.data.variants !== undefined &&
    x.email !== undefined &&
    x.username !== undefined
  );
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    
    if (isQuizWithEmail(json)) {
      const result = await prisma.quiz.create({
        data: {
          question: json.data.question,
          variants: JSON.stringify(json.data.variants),
          category: json.data.category,
          isRadio: json.data.isRadio,
          isShort: json.data.isShort,
          answers: JSON.stringify(json.data.answers),
          ownerEmail: json.email,
          ownerName: json.username,
        }
      });
      return NextResponse.json(result, { status: 200 });
    }
    return NextResponse.json({ error: `Unknown request`, request: json}, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500});
  }
}
