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
