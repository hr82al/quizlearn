import { prisma } from '@/components/prisma';
import { NextResponse } from 'next/server';


export type QuizT = {
  question: string;
  quiz: string;
  answer: string;
}

export async function GET(request: Request) {
  return NextResponse.json({}, { status: 500 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  try {
    if (typeof id === "number") {
      const result = await prisma.quiz.findUnique({
        where: {
          id: 0 //id,
        },
      });
      return NextResponse.json(result, { status: 200 });
    } else {
      const result = await prisma.quiz.findMany();
      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return NextResponse.json({}, { status: 500 });
  try {
    const res = await request.json();
    const quiz = await prisma.quiz.create({data: res});
    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    return NextResponse.json({error}, { status: 500 });
  }
}
