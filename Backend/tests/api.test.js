import request from "supertest";
import express from "express";
import router from "../routes/routes.js";
import "../tests/setup.js";
import User from "../models/user.model.js";
import ReadingQuestion from "../models/reading.model.js";
import WritingQuestion from "../models/writing.model.js";
jest.mock("../controllers/chatbot.controller.js");
const app = express();
app.use(express.json());
app.use("/api", router);

describe("API Endpoints", () => {
  let token;
  let childId;
  let readingQuestionId;
  let writingQuestionId;

  beforeEach(async () => {
    // 1. Create a test user
    const testUser = {
      username: "testuser",
      email: "test@example.com",
      phone_number: "081234567890",
      password: "password123",
      role: "parent",
      children: [
        { name: "Anak Test", avatarImg: "avatar.png", xp: 80, level: 1 },
      ],
    };
    await User.create(testUser);

    // 2. Log in as the test user
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    token = loginRes.body.token;

    // 3. Get the child's ID
    const user = await User.findOne({ email: "test@example.com" });
    childId = user.children[0]._id.toString();

    // 4. Create dummy questions
    const readingQ = await ReadingQuestion.create({
      word: "apel",
      category: "word",
      level: 1,
    });
    readingQuestionId = readingQ._id.toString();

    const writingQ = await WritingQuestion.create({
      word: "jeruk",
      category: "word",
      level: 1,
    });
    writingQuestionId = writingQ._id.toString();
  });

  describe("Auth Routes", () => {
    // Test 1: User Registration
    it("POST /api/auth/register - should register a new user successfully", async () => {
      const newUser = {
        username: "newuser",
        email: "new@example.com",
        phone_number: "089876543210",
        password: "password123",
        role: "parent",
      };
      const res = await request(app).post("/api/auth/register").send(newUser);
      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe("User registered successfully.");
    });

    it("POST /api/auth/register - should fail if email already exists", async () => {
      const existingUser = {
        username: "anotheruser",
        email: "test@example.com",
        phone_number: "081122334455",
        password: "password123",
        role: "parent",
      };
      const res = await request(app)
        .post("/api/auth/register")
        .send(existingUser);
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe("Email is already registered.");
    });

    // Test 2: User Login
    it("POST /api/auth/login - should return a token for valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
    });
  });

  describe("Children and Progress Routes", () => {
    // Test 3: Get Children
    it("GET /api/children - should return children for an authenticated user", async () => {
      const res = await request(app)
        .get("/api/children")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body[0].name).toBe("Anak Test");
    });

    // Test 4: Update Reading Progress
    it("POST /api/reading/progress/:childId - should update XP and level up", async () => {
      const res = await request(app)
        .post(`/api/reading/progress/${childId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ questionId: readingQuestionId });

      expect(res.statusCode).toEqual(200);

      const updatedUser = await User.findOne({ "children._id": childId });
      const child = updatedUser.children.id(childId);

      expect(child.xp).toBe(100);
      expect(child.level).toBe(2);
    });

    // Test 5: Update Writing Progress
    it("POST /api/writing/progress/:childId - should update XP", async () => {
      await request(app)
        .post(`/api/reading/progress/${childId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ questionId: readingQuestionId });

      const res = await request(app)
        .post(`/api/writing/progress/${childId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ questionId: writingQuestionId });

      expect(res.statusCode).toEqual(200);

      const updatedUser = await User.findOne({ "children._id": childId });
      const child = updatedUser.children.id(childId);

      expect(child.xp).toBe(120);
    });

    // Test 6: Get Child Stats
    it("GET /api/children/stats/:childId - should return correct progress stats", async () => {
      await request(app)
        .post(`/api/reading/progress/${childId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ questionId: readingQuestionId });

      const res = await request(app)
        .get(`/api/children/stats/${childId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.reading.completed).toBe(1);
      expect(res.body.writing.completed).toBe(0);
    });
  });

  describe("Main Feature Routes", () => {
    // Test 7: Get Leaderboard
    it("GET /api/leaderboard - should return the leaderboard successfully", async () => {
      const res = await request(app)
        .get("/api/leaderboard")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body[0].xp).toBe(80);
    });

    // Test 8: Update Streak
    it("PUT /api/children/streak/:childId - should update the streak and return the new data", async () => {
      const res = await request(app)
        .put(`/api/children/streak/${childId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ streak: 5 });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("Streak updated successfully");
      expect(res.body.streak).toBe(5);
    });
  });
});
