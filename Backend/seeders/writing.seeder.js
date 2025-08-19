import WritingQuestion from "../models/writing.model.js";

export const seedWriting = async () => {
  const writingQuestions = [
    
    { word: "kucing", category: "word", level: 1 },
    { word: "anjing", category: "word", level: 2 },
    { word: "buku", category: "word", level: 3 },
    { word: "meja", category: "word", level: 4 },
    
    { word: "komputer", category: "word", level: 5 },
    { word: "perpustakaan", category: "word", level: 6 },
    { word: "universitas", category: "word", level: 7 },
    
    { word: "konstitusi", category: "word", level: 8 },
    { word: "globalisasi", category: "word", level: 9 },
    
    { word: "123", category: "number", level: 1 },
    { word: "4567", category: "number", level: 2 },
    { word: "891011", category: "number", level: 3 },
    
    { word: "A", category: "letter", level: 1 },
    { word: "C", category: "letter", level: 2 },
    { word: "Y", category: "letter", level: 3 }
  ];

  await WritingQuestion.deleteMany({}); // Clear existing data
  await WritingQuestion.insertMany(writingQuestions);
  console.log("Writing questions seeded successfully!");
};