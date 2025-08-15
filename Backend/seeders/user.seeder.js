import User from "../models/user.model.js";

export const seedUsers = async () => {
  const dummyUsers = [
    {
      username: "tes",
      email: "test@gmail.com",
      number: "08123456789",
      password: "tes",
      role: "user",
    },
  ];

  await User.insertMany(dummyUsers);
  console.log("Users seeded successfully!");
};
