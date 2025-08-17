import WritingQuestion from "../models/writing.model.js";

export const createWritingQuestion = async (req, res) => {
  try {
    const { word, category } = req.body;

    if (!word || !category) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const newQuestion = new WritingQuestion({
      word,
      category,
    });

    await newQuestion.save();

    res.status(201).json({
      message: "Writing question created successfully.",
      question: newQuestion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getWritingQuestions = async (req, res) => {
  try {
    const questions = await WritingQuestion.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const deleteWritingQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await WritingQuestion.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ message: "Writing question deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
