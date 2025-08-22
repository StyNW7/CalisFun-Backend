import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const childSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatarImg: {
    type: String,
    required: false,
  },
  level: {
    type: Number,
    default: 1,
  },
  xp: {
    type: Number,
    default: 0,
  },
  progress: {
    reading: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReadingQuestion",
      },
    ],
    writing: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WritingQuestion",
      },
    ],
  },
  countingDifficulty: {
    type: String,
    required: true,
    default: "easy",
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastStreakUpdate: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "parent",
  },
  passKey: {
    type: Number,
    required: true,
  },
  children: [childSchema],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
