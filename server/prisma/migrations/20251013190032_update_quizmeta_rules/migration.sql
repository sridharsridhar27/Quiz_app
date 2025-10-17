-- CreateTable
CREATE TABLE "QuizMeta" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "maxMarks" INTEGER NOT NULL,
    "negativeMarking" BOOLEAN NOT NULL DEFAULT false,
    "attemptsAllowed" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizMeta_pkey" PRIMARY KEY ("id")
);
