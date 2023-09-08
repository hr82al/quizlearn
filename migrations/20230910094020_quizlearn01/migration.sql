-- CreateEnum
CREATE TYPE "QuizEnum" AS ENUM ('FILL', 'FILL_PART', 'RADIO', 'CHECK', 'ORDER');

-- CreateEnum
CREATE TYPE "CategoryEnum" AS ENUM ('TS');

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "quizType" "QuizEnum" NOT NULL,
    "quiz" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" "CategoryEnum" NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "bcryptHash" CHAR(60) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(64),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_question_key" ON "Quiz"("question");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
