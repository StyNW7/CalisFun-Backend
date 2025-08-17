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
    const { childId } = req.params;
    const { userId } = req.user;

    const parent = await User.findById(userId);
    if (!parent) {
      return res.status(404).json({ message: "User not found" });
    }

    const child = parent.children.id(childId);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    const nextQuestion = await WritingQuestion.findOne({
      _id: { $nin: child.progress.writing },
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

export const updateUserWritingProgress = async (req, res) => {
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

    child.progress.writing.push(questionId);
    await parent.save();

    res.status(200).json({ message: "Progress successfully updated." });
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
