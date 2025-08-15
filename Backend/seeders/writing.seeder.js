import WritingQuestion from "../models/writing.model.js";

export const seedWriting = async () => {
  const writingQuestions = [
    // easy
    { word: "kucing", difficulty: "easy" },
    { word: "anjing", difficulty: "easy" },
    { word: "rumah", difficulty: "easy" },
    { word: "mobil", difficulty: "easy" },
    { word: "sekolah", difficulty: "easy" },
    { word: "buku", difficulty: "easy" },
    { word: "meja", difficulty: "easy" },
    { word: "kursi", difficulty: "easy" },
    { word: "pintu", difficulty: "easy" },
    { word: "jendela", difficulty: "easy" },
    // medium
    { word: "komputer", difficulty: "medium" },
    { word: "perpustakaan", difficulty: "medium" },
    { word: "transportasi", difficulty: "medium" },
    { word: "telepon", difficulty: "medium" },
    { word: "televisi", difficulty: "medium" },
    { word: "restoran", difficulty: "medium" },
    { word: "informasi", difficulty: "medium" },
    { word: "teknologi", difficulty: "medium" },
    { word: "pendidikan", difficulty: "medium" },
    { word: "kesehatan", difficulty: "medium" },
    // hard
    { word: "konstitusi", difficulty: "hard" },
    { word: "globalisasi", difficulty: "hard" },
    { word: "demokrasi", difficulty: "hard" },
    { word: "transformasi", difficulty: "hard" },
    { word: "infrastruktur", difficulty: "hard" },
    { word: "partisipasi", difficulty: "hard" },
    { word: "revolusi", difficulty: "hard" },
    { word: "konservasi", difficulty: "hard" },
    { word: "diversifikasi", difficulty: "hard" },
    { word: "kolaborasi", difficulty: "hard" },
  ];

  await WritingQuestion.deleteMany({});
  await WritingQuestion.insertMany(writingQuestions);
  console.log("Writing questions seeded successfully!");
};
