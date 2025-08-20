import request from "supertest";
import express from "express";
import router from "../routes/routes.js";
import "./setup.js";
import User from "../models/user.model.js";
import ReadingQuestion from "../models/reading.model.js";
import WritingQuestion from "../models/writing.model.js";

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

    // Test 3: Logout
    it("POST /api/auth/logout - should logout the user successfully", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("Logged out successfully");
    });
  });

  describe("Security Middleware", () => {
    // Test 4: Security Middleware
    it("should return 401 Unauthorized if no token is provided", async () => {
      const res = await request(app).get("/api/leaderboard");

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe("No token, authorization denied");
    });

    it("should return 401 Unauthorized if token is invalid", async () => {
      const invalidToken = "this.is.an.invalid.token";
      const res = await request(app)
        .get("/api/leaderboard")
        .set("Authorization", `Bearer ${invalidToken}`);

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe("Token is not valid");
    });
  });
});
