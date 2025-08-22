import request from "supertest";
import express from "express";
import router from "../../routes/routes.js";
import "../setup.js";
import User from "../../models/user.model.js";
import ReadingQuestion from "../../models/reading.model.js";
import WritingQuestion from "../../models/writing.model.js";

const app = express();
app.use(express.json());
app.use("/api", router);

describe("API Endpoints", () => {
  let token;
  let childId;
  let readingQuestionId;
  let writingQuestionId;

  beforeEach(async () => {
    const testUser = {
      username: "testuser",
      email: "test@example.com",
      phone_number: "081234567890",
      password: "password123",
      role: "parent",
      pass_key: 1234,
      children: [
        { name: "Anak Test", avatarImg: "avatar.png", xp: 80, level: 1 },
      ],
    };
    await User.create(testUser);

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    token = loginRes.body.token;

    const user = await User.findOne({ email: "test@example.com" });
    childId = user.children[0]._id.toString();

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
    it("POST /api/auth/register - should register a new user successfully", async () => {
      const newUser = {
        username: "newuser",
        email: "new@example.com",
        phone_number: "089876543210",
        password: "password123",
        role: "parent",
        pass_key: 1234,
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
        pass_key: 1234,
      };
      const res = await request(app)
        .post("/api/auth/register")
        .send(existingUser);
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe("Email is already registered.");
    });

    it("POST /api/auth/login - should return a token for valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
    });

    it("POST /api/auth/login - should fail with incorrect credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });
      expect(res.statusCode).toEqual(400);
    });

    it("POST /api/auth/logout - should logout the user successfully", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("Logged out successfully");
    });
  });

  describe("Security Middleware", () => {
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

  describe("Child Routes", () => {
    it("POST /api/children/create - should add a new child", async () => {
      const newChild = { name: "Anak Baru", avatarImg: "avatar2.png" };
      const res = await request(app)
        .post("/api/children/create")
        .set("Authorization", `Bearer ${token}`)
        .send(newChild);
      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe("Profile Children Succesfully Created");
    });

    it("GET /api/children/one/:childId - should get child data", async () => {
      const res = await request(app)
        .get(`/api/children/one/${childId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe("Anak Test");
    });

    it("PUT /api/children/update/:childId - should update child data", async () => {
      const updatedData = { name: "Anak Test Updated" };
      const res = await request(app)
        .put(`/api/children/update/${childId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedData);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("Child updated successfully");
    });

    it("DELETE /api/children/delete/:childId - should delete a child", async () => {
      const res = await request(app)
        .delete(`/api/children/delete/${childId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("Child deleted successfully");
    });
  });

  describe("Exercise Routes", () => {
    it("GET /api/reading/user/:childId - should get a reading question", async () => {
      const res = await request(app)
        .get(`/api/reading/user/${childId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("word");
    });

    it("POST /api/reading/progress/:childId - should handle correct answer", async () => {
      const answer = { answer: "apel", questionId: readingQuestionId };
      const res = await request(app)
        .post(`/api/reading/progress/${childId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(answer);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("Progress successfully updated.");
    });

    it("POST /api/reading/progress/:childId - should handle incorrect answer", async () => {
      const answer = { answer: "jeruk", questionId: readingQuestionId };
      const res = await request(app)
        .post(`/api/reading/progress/${childId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(answer);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("Progress successfully updated.");
    });
  });
});
