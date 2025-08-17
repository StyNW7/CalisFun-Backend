import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
} from "../controllers/auth.controller.js";
import { getUserProfile } from "../controllers/user.controller.js";
import { protect } from "../middleware/protect.js";
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
} from "../controllers/reading.controller.js";
import {
  createWritingQuestion,
  getWritingQuestions,
  deleteWritingQuestion,
  updateUserWritingProgress,
  updateWritingQuestion,
} from "../controllers/writing.controller.js";

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
router.post("/reading/create", protect, createReadingQuestion);
router.get("/reading/:childId", protect, getReadingQuestions);
router.put("/reading/update/:id", protect, updateReadingQuestion);
router.post("/reading/progress/:childId", protect, updateUserReadingProgress);
// router.delete("/reading/delete/:id", protect, deleteReadingQuestion);

// Writing Question Routes
router.post("/writing/create", protect, createWritingQuestion);
router.get("/writing/:childId", protect, getWritingQuestions);
router.put("/writing/update/:id", protect, updateWritingQuestion);
router.post("/writing/progress/:childId", protect, updateUserWritingProgress);
// router.delete("/writing/delete/:id", protect, deleteWritingQuestion);

// Chatbot
router.post("/chat", chatWithAI);

export default router;
