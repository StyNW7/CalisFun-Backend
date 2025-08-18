import User from "../models/user.model.js";

export const seedUsers = async () => {
  const usersToSeed = [
    {
      username: "admin",
      email: "admin@gmail.com",
      phone_number: "081200000001",
      password: "admin",
      role: "admin",
    },
    {
      username: "parent_test",
      email: "parent@gmail.com",
      phone_number: "081200000002",
      password: "password",
      role: "parent",
    },
  ];

  await User.insertMany(usersToSeed);
  console.log("Users seeded successfully!");
};
