import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export type QuizT = {
  question: string;
  quiz_type: "FILL";
  quiz: string;
  answer: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  try {
    if (typeof id === "number") {
      const result = await prisma.quiz.findUnique({
        where: {
          id: id,
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
  try {
    const res = await request.json();
    const quiz = await prisma.quiz.create({data: res});
    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    return NextResponse.json({error}, { status: 500 });
  }
}

/*
CREATE TYPE Quiz_Type AS ENUM ('FILL');

CREATE TABLE Quizzes(
  id SERIAL PRIMARY KEY,
  question TEXT UNIQUE,
  quiz_type Quiz_Type,
  quiz TEXT,
  answer TEXT
);

INSERT INTO public."Quizzes"(question, quiz_type, quiz, answer) VALUES('How to setup TypeScript?', 'FILL', '', 'npm install -g typescript' );

model Quizzes {
  id        Int      @id @default(autoincrement())
  question  String   @unique
  quiz_type Quiz_Type
  quiz      String   
  answer    String
}

SELECT *
FROM pg_catalog.pg_tables;

DROP TABLE public."Quizzes";
DROP TABLE _prisma_migrations

*/