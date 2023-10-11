-- CreateEnum
CREATE TYPE "CategoryEnum" AS ENUM ('TS', 'RUST', 'PYTHON', 'C', 'HTML', 'CSS', 'JS', 'TAILWINDCSS', 'PHP', 'JAVA');

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "variants" TEXT NOT NULL,
    "isRadio" BOOLEAN NOT NULL,
    "isShort" BOOLEAN NOT NULL,
    "answers" TEXT NOT NULL,
    "category" "CategoryEnum" NOT NULL,
    "ownerEmail" VARCHAR(254) NOT NULL,
    "ownerName" VARCHAR(25) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "bcryptHash" CHAR(60) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(254) NOT NULL,

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
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
