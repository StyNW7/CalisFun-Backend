import ReadingQuestion from "../models/reading.model.js";
import WritingQuestion from "../models/writing.model.js";
import User from "../models/user.model.js";

export const getQuestionStats = async (req, res) => {
  try {
    const totalReading = await ReadingQuestion.countDocuments();
    const totalWriting = await WritingQuestion.countDocuments();

    res.status(200).json({
      reading: {
        total: totalReading,
      },
      writing: {
        total: totalWriting,
      },
    });
  } catch (error) {
    console.error("Error fetching question stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getChildProgressStats = async (req, res) => {
  try {
    const { childId } = req.params;
    const { userId } = req.user;
    const totalReading = await ReadingQuestion.countDocuments();
    const totalWriting = await WritingQuestion.countDocuments();

    const parent = await User.findById(userId);
    if (!parent) {
      return res.status(404).json({ message: "User not found" });
    }

    const child = parent.children.id(childId);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    const completedReading = child.progress.reading.length;
    const completedWriting = child.progress.writing.length;

    res.status(200).json({
      reading: {
        completed: completedReading,
        total: totalReading,
      },
      writing: {
        completed: completedWriting,
        total: totalWriting,
      },
    });
  } catch (error) {
    console.error("Error fetching child progress stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};
