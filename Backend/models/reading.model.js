import mongoose from "mongoose";

const readingQuestionSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
  },
});

const ReadingQuestion = mongoose.model(
  "ReadingQuestion",
  readingQuestionSchema
);

export default ReadingQuestion;
