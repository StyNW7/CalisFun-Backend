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
} from "../controllers/child.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

//auth routes
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.put("/auth/change-password/:id", changePassword);

//user routes
router.get("/user/profile", protect, getUserProfile);

//counting routes
router.put("/user/counting-difficulty", protect, updateCountingDifficulty);

// Child routes
router.post("/children", protect, upload.single("avatar"), createChild);
router.get("/children", protect, getChildren);
router.put("/children/:childId", protect, upload.single("avatar"), updateChild);

export default router;
