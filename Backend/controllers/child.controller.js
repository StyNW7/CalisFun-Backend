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
      message: "Profil anak berhasil dibuat.",
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
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }

    res.status(200).json(parent.children);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
