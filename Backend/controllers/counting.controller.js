import User from "../models/user.model.js";

export const updateCountingDifficulty = async (req, res) => {
  const { difficulty } = req.body;
  const { userId } = req.user;
  const { childId } = req.params;

  if (!difficulty || !["easy", "medium", "hard"].includes(difficulty)) {
    return res.status(400).json({ message: "Invalid difficulty level." });
  }

  try {
    const parent = await User.findById(userId);
    if (!parent) {
      return res.status(404).json({ message: "User not found." });
    }

    const child = parent.children.id(childId);
    if (!child) {
      return res.status(404).json({ message: "Child not found." });
    }

    child.countingDifficulty = difficulty;
    await parent.save();

    res.status(200).json({
      message: "Difficulty updated successfully!",
      newDifficulty: child.countingDifficulty,
    });
  } catch (error) {
    console.error("Error updating difficulty:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
