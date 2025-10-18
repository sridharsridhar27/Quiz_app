import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting quiz seed...");

  // Step 1: Create quiz metadata
  const quiz = await prisma.quiz.create({
    data: {
      title: "IQvest",
      totalMarks: 100,
      durationMinutes: 45,
    },
  });

  console.log("✅ Quiz created:", quiz.title);

  // Step 2: Load questions from JSON file
  const questions = JSON.parse(fs.readFileSync("./prisma/questions.json", "utf-8"));

  // Step 3: Insert all questions in bulk
  const questionData = questions.map((q) => ({
    quizId: quiz.id,
    text: q.text,
    options: q.options,
    correctOption: q.correctOption,
    marks: 2.5, // since each carries 2.5 marks
  }));

  await prisma.question.createMany({
    data: questionData,
  });

  console.log(`✅ Inserted ${questions.length} questions successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
