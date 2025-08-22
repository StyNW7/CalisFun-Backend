import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
  logoutUser,
} from "../controllers/auth.controller.js";
import {
  getUserProfile,
  getAllUsers,
  getLeaderboard,
  editUserProfile,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/protect.js";
import { isAdmin } from "../middleware/admin.js";
import { updateCountingDifficulty } from "../controllers/counting.controller.js";
import {
  createChild,
  getChildren,
  getOneChildren,
  updateChild,
  updateChildStreak,
  deleteChild,
  getAvatarImage,
} from "../controllers/child.controller.js";
import upload from "../middleware/upload.js";
import {
  createReadingQuestion,
  getReadingQuestions,
  deleteReadingQuestion,
  updateUserReadingProgress,
  updateReadingQuestion,
  getAllReadingQuestions,
} from "../controllers/reading.controller.js";
import {
  createWritingQuestion,
  getWritingQuestions,
  deleteWritingQuestion,
  updateUserWritingProgress,
  updateWritingQuestion,
  getAllWritingQuestions,
} from "../controllers/writing.controller.js";

import {
  getQuestionStats,
  getChildProgressStats,
} from "../controllers/stats.controller.js";
import { chatWithAI } from "../controllers/chatbot.controller.js";

const router = express.Router();

//get image
router.get("/images/:id", getAvatarImage);

//auth routes

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.put("/auth/change-password/:id", protect, changePassword);
router.post("/auth/logout", protect, logoutUser);

//user routes

router.get("/user/profile", protect, getUserProfile);
router.get("/leaderboard", protect, getLeaderboard);
router.put("/user/profile/edit", protect, editUserProfile);

//counting routes

router.put(
  "/children/counting-difficulty/:childId",
  protect,
  updateCountingDifficulty
);

// Child routes

router.post("/children/create", protect, upload.single("avatar"), createChild);
router.delete("/children/delete/:childId", protect, deleteChild);
router.get("/children/all", protect, getChildren);
router.get("/children/one/:childId", protect, getOneChildren);
router.put(
  "/children/update/:childId",
  protect,
  upload.single("avatar"),
  updateChild
);
router.put("/children/streak/:childId", protect, updateChildStreak);

// Reading Question Routes

router.get("/reading/all", protect, getAllReadingQuestions);
router.get("/reading/user/:childId", protect, getReadingQuestions);
router.post("/reading/progress/:childId", protect, updateUserReadingProgress);

// Writing Question Routes

router.get("/writing/all", protect, getAllWritingQuestions);
router.get("/writing/user/:childId", protect, getWritingQuestions);
router.post("/writing/progress/:childId", protect, updateUserWritingProgress);

// Chatbot

router.post("/chat", chatWithAI);

//stats routes

router.get("/questions/stats", protect, isAdmin, getQuestionStats);
router.get("/children/stats/:childId", protect, getChildProgressStats);

//Admin routes

router.get("/users/all", protect, isAdmin, getAllUsers);

router.post("/reading/create", protect, isAdmin, createReadingQuestion);
router.put("/reading/update/:id", protect, isAdmin, updateReadingQuestion);
router.delete("/reading/delete/:id", protect, isAdmin, deleteReadingQuestion);

router.post("/writing/create", protect, isAdmin, createWritingQuestion);
router.put("/writing/update/:id", protect, isAdmin, updateWritingQuestion);
router.delete("/writing/delete/:id", protect, isAdmin, deleteWritingQuestion);

export default router;
