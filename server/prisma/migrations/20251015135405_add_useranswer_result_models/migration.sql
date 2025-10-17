/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Result` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,quizId]` on the table `Result` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `correctCount` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizId` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeTakenSeconds` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalQuestions` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Made the column `score` on table `Result` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Result` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Result" DROP CONSTRAINT "Result_userId_fkey";

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "createdAt",
ADD COLUMN     "correctCount" INTEGER NOT NULL,
ADD COLUMN     "quizId" INTEGER NOT NULL,
ADD COLUMN     "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "timeTakenSeconds" INTEGER NOT NULL,
ADD COLUMN     "totalQuestions" INTEGER NOT NULL,
ALTER COLUMN "score" SET NOT NULL,
ALTER COLUMN "score" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "UserAnswer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "selectedOption" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserAnswer_userId_idx" ON "UserAnswer"("userId");

-- CreateIndex
CREATE INDEX "UserAnswer_questionId_idx" ON "UserAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAnswer_userId_questionId_key" ON "UserAnswer"("userId", "questionId");

-- CreateIndex
CREATE INDEX "Result_userId_idx" ON "Result"("userId");

-- CreateIndex
CREATE INDEX "Result_quizId_idx" ON "Result"("quizId");

-- CreateIndex
CREATE UNIQUE INDEX "Result_userId_quizId_key" ON "Result"("userId", "quizId");

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
