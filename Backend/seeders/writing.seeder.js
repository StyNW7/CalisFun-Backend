import WritingQuestion from "../models/writing.model.js";

export const seedWriting = async () => {
  const writingQuestions = [
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

  await WritingQuestion.deleteMany({});
  await WritingQuestion.insertMany(writingQuestions);
  console.log("Writing questions seeded successfully!");
};
