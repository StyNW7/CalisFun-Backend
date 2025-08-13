import User from "../models/user.model";

export const updateCountingDifficulty = async (req, res) => {
  const { difficulty } = req.body;
  const { userId } = req.user;

  if (!difficulty || !["easy", "medium", "hard"].includes(difficulty)) {
    return res.status(400).json({ message: "Invalid difficulty level." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { countingDifficulty: difficulty },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({
      message: "Difficulty updated successfully!",
      newDifficulty: updatedUser.countingDifficulty,
    });
  } catch (error) {
    console.error("Error updating difficulty:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
