-- CreateEnum
CREATE TYPE "Quiz_Type" AS ENUM ('FILL');

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "quiz_type" "Quiz_Type" NOT NULL,
    "quiz" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_question_key" ON "Quiz"("question");
