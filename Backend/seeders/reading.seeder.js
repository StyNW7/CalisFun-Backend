import ReadingQuestion from "../models/reading.model.js";

export const seedReading = async () => {
  const readingQuestions = [
    // easy
    { word: "kucing", difficulty: "easy" },
    { word: "anjing", difficulty: "easy" },
    // medium
    { word: "komputer", difficulty: "medium" },
    { word: "perpustakaan", difficulty: "medium" },
    // hard
    { word: "konstitusi", difficulty: "hard" },
    { word: "globalisasi", difficulty: "hard" },
  ];

  await ReadingQuestion.deleteMany({});
  await ReadingQuestion.insertMany(readingQuestions);
  console.log("Reading questions seeded successfully!");
};
