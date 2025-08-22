import ReadingQuestion from "../models/reading.model.js";

export const seedReading = async () => {
  const readingQuestions = [
    
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
    { word: "B", category: "letter", level: 2 },
    { word: "X", category: "letter", level: 3 }
  ];

  await ReadingQuestion.deleteMany({}); // Clear existing data
  await ReadingQuestion.insertMany(readingQuestions);
  console.log("Reading questions seeded successfully!");
};