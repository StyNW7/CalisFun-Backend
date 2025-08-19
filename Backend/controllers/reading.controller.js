import ReadingQuestion from "../models/reading.model.js";
import User from "../models/user.model.js";

export const createReadingQuestion = async (req, res) => {
  try {
    const { word, category } = req.body;

    if (!word || !category) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    // Check if word already exists (case-sensitive)
    const existingQuestion = await ReadingQuestion.findOne({ 
      word: word,
      category: category 
    });

    if (existingQuestion) {
      return res.status(409).json({
        message: "Question already exists.",
        error: `The word "${word}" already exists in the ${category} category.`,
        existingQuestion: {
          _id: existingQuestion._id,
          word: existingQuestion.word,
          category: existingQuestion.category,
          level: existingQuestion.level
        }
      });
    }

    // Find the next level for this category
    const lastQuestion = await ReadingQuestion.findOne({ category }).sort({
      level: -1,
    });
    const nextLevel = lastQuestion ? lastQuestion.level + 1 : 1;

    // Create new question
    const newQuestion = new ReadingQuestion({
      word,
      category,
      level: nextLevel,
    });

    await newQuestion.save();

    res.status(201).json({
      message: "Reading question created successfully.",
      question: newQuestion,
    });
  } catch (error) {
    console.error("Error creating reading question:", error);
    
    // Handle duplicate key error (if unique index is set in schema)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Question already exists.",
        error: "This word already exists in the specified category.",
        details: error.keyValue
      });
    }

    res.status(500).json({ 
      message: "Server error. Please try again later.",
      error: error.message 
    });
  }
};

export const getReadingQuestions = async (req, res) => {
  try {
    const { childId } = req.params;
    const { userId } = req.user;
    const { category } = req.query;

    const parent = await User.findById(userId);
    if (!parent) {
      return res.status(404).json({ message: "User not found" });
    }

    const child = parent.children.id(childId);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    const query = {
      _id: { $nin: child.progress.reading },
    };

    if (category) {
      query.category = category;
    }

    const nextQuestion = await ReadingQuestion.findOne(query).sort({
      level: 1,
    });

    if (!nextQuestion) {
      return res
        .status(200)
        .json({ message: "Congratulation! You have completed all questions." });
    }

    res.status(200).json(nextQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getAllReadingQuestions = async (req, res) => {
  try {
    const questions = await ReadingQuestion.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const updateReadingQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { word } = req.body;

    if (!word) {
      return res.status(400).json({ message: "Word is required." });
    }

    const question = await ReadingQuestion.findByIdAndUpdate(
      id,
      { word },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res
      .status(200)
      .json({ message: "Reading question updated successfully", question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const updateUserReadingProgress = async (req, res) => {
  const { childId } = req.params;
  const { questionId } = req.body;
  const { userId } = req.user;

  if (!questionId) {
    return res.status(400).json({ message: "Question ID needed." });
  }

  try {
    const parent = await User.findById(userId);
    if (!parent) {
      return res.status(404).json({ message: "User not found" });
    }

    const child = parent.children.id(childId);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    child.progress.reading.push(questionId);
    await parent.save();

    res.status(200).json({ message: "Progress successfully updated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const deleteReadingQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await ReadingQuestion.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ message: "Reading question deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
