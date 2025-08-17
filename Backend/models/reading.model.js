import mongoose from "mongoose";

const readingQuestionSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["word", "number", "letter"],
  },
});

const ReadingQuestion = mongoose.model(
  "ReadingQuestion",
  readingQuestionSchema
);

export default ReadingQuestion;
