import mongoose from "mongoose";

const writingQuestionSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["word", "number", "letter"],
  },
  level: {
    type: Number,
    required: true,
  },
});

const WritingQuestion = mongoose.model(
  "WritingQuestion",
  writingQuestionSchema
);

export default WritingQuestion;
