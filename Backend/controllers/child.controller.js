import mongoose from "mongoose";
import User from "../models/user.model.js";
import { uploadFileToGridFS } from "../helper/largefile.js";

export const createChild = async (req, res) => {
  const { name } = req.body;
  const file = req.file;

  if (!name || !file) {
    return res.status(400).json({ message: "Name must be inputed." });
  }

  try {
    const uploadResult = await uploadFileToGridFS(
      file.buffer,
      file.originalname
    );

    const newChild = {
      name: name,
      avatarImg: uploadResult.fileId.toString(),
    };

    const parent = await User.findById(req.user.userId);
    parent.children.push(newChild);
    await parent.save();

    res.status(201).json({
      message: "Profile Children Succesfully Created",
      child: parent.children[parent.children.length - 1],
    });
  } catch (error) {
    console.error("Error creating child:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getChildren = async (req, res) => {
  const parentId = req.user.userId;

  try {
    const parent = await User.findById(parentId).select("children");
    if (!parent) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(parent.children);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getOneChildren = async (req, res) => {
  const parentId = req.user.userId;
  const { childId } = req.params;

  try {
    const parent = await User.findById(parentId).select("children");
    if (!parent) {
      return res.status(404).json({ message: "User not found" });
    }

    const child = parent.children.id(childId);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    res.status(200).json(child);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateChild = async (req, res) => {
  const id = req.params.childId;
  const name = req.body.name;
  const avatarImg = req.file;
  const parentId = req.user.userId;

  try {
    const parent = await User.findById(parentId);
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    const child = parent.children.id(id);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    child.name = name;
    if (avatarImg) {
      const uploadResult = await uploadFileToGridFS(
        avatarImg.buffer,
        avatarImg.originalname
      );
      child.avatarImg = uploadResult.fileId.toString();
    }

    await parent.save();
    res.status(200).json({ message: "Child updated successfully", child });
  } catch (error) {
    console.error("Error updating child:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateChildStreak = async (req, res) => {
  const { childId } = req.params;
  const { streak } = req.body;
  const { userId } = req.user;

  if (typeof streak !== "number" || streak < 0) {
    return res.status(400).json({ message: "Invalid streak value." });
  }

  try {
    const parent = await User.findById(userId);
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    const child = parent.children.id(childId);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    child.streak = streak;
    child.lastStreakUpdate = new Date();

    await parent.save();

    res.status(200).json({
      message: "Streak updated successfully",
      streak: child.streak,
      lastStreakUpdate: child.lastStreakUpdate,
    });
  } catch (error) {
    console.error("Error updating streak:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteChild = async (req, res) => {
  const { childId } = req.params;
  const { userId } = req.user;

  try {
    const parent = await User.findById(userId);
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    const child = parent.children.id(childId);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    child.deleteOne();

    await parent.save();
    res.status(200).json({ message: "Child deleted successfully" });
  } catch (error) {
    console.error("Error deleting child:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAvatarImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid image ID format" });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(id)
    );

    downloadStream.on("file", (file) => {
      res.set("Content-Type", file.contentType);
    });

    downloadStream.on("error", (err) => {
      if (err.code === "ENOENT") {
        return res.status(404).json({ message: "Image not found" });
      }
      res.status(500).json({ message: "Error retrieving image" });
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error in getAvatarImage:", error);
    res.status(500).json({ message: "Server error" });
  }
};
