import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.aggregate([
      { $unwind: "$children" },
      { $sort: { "children.xp": -1 } },
      { $replaceRoot: { newRoot: "$children" } },
      {
        $project: {
          _id: 1,
          name: 1,
          avatarImg: 1,
          level: 1,
          xp: 1,
        },
      },
    ]);

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server error" });
  }
};
