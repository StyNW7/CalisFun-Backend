import mongoose from "mongoose";

const writingQuestionSchema = new mongoose.Schema({
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

const WritingQuestion = mongoose.model(
  "WritingQuestion",
  writingQuestionSchema
);

export default WritingQuestion;
