import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
} from "../controllers/auth.controller.js";
import { getUserProfile, getAllUsers } from "../controllers/user.controller.js";
import { protect } from "../middleware/protect.js";
import { isAdmin } from "../middleware/admin.js";
import { updateCountingDifficulty } from "../controllers/counting.controller.js";
import {
  createChild,
  getChildren,
  updateChild,
  deleteChild,
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

import { getQuestionStats } from "../controllers/stats.controller.js";
import { chatWithAI } from "../controllers/chatbot.controller.js";

const router = express.Router();

//auth routes
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.put("/auth/change-password/:id", protect, changePassword);

//user routes
router.get("/user/profile", protect, getUserProfile);

//counting routes
router.put(
  "/children/counting-difficulty/:childId",
  protect,
  updateCountingDifficulty
);

// Child routes
router.post("/children/create", protect, upload.single("avatar"), createChild);
router.delete("/children/delete/:childId", protect, deleteChild);
router.get("/children", protect, getChildren);
router.put(
  "/children/update/:childId",
  protect,
  upload.single("avatar"),
  updateChild
);

// Reading Question Routes
router.get("/reading/:childId", protect, getReadingQuestions);
router.post("/reading/progress/:childId", protect, updateUserReadingProgress);

// Writing Question Routes

router.get("/writing/:childId", protect, getWritingQuestions);
router.post("/writing/progress/:childId", protect, updateUserWritingProgress);

// Chatbot
router.post("/chat", chatWithAI);

//stats routes
router.get("/questions/stats", protect, getQuestionStats);

//Admin routes
router.get("/users/all", protect, isAdmin, getAllUsers);

router.post("/reading/create", protect, isAdmin, createReadingQuestion);
router.put("/reading/update/:id", protect, isAdmin, updateReadingQuestion);
router.get("/reading/all", protect, isAdmin, getAllReadingQuestions);
// router.delete("/reading/delete/:id", protect, isAdmin, deleteReadingQuestion);

router.post("/writing/create", protect, isAdmin, createWritingQuestion);
router.put("/writing/update/:id", protect, isAdmin, updateWritingQuestion);
router.get("/writing/all", protect, isAdmin, getAllWritingQuestions);
// router.delete("/writing/delete/:id", protect, isAdmin, deleteWritingQuestion);
export default router;
