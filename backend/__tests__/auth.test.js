import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../index.js";
import User from "../modals/User.js";
import Category from "../modals/Category.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("POST /auth/register", () => {
  beforeEach(async () => {
    await User.deleteMany(); // Clear database before each test
  });

  it("should register a new user and return a token", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "test@example.com",
      password: "password123",
      role: "user",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
    expect(res.body).toHaveProperty("token");

    const user = await User.findOne({ email: "test@example.com" });
    expect(user).not.toBeNull();
    const isPasswordValid = await bcrypt.compare("password123", user.password);
    expect(isPasswordValid).toBe(true);
  });

  it("should not register a user with an existing email", async () => {
    await User.create({
      email: "test@example.com",
      password: await bcrypt.hash("password123", 10),
      role: "user",
    });

    const res = await request(app).post("/auth/register").send({
      email: "test@example.com",
      password: "password456",
      role: "user",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "User already exists");
  });
});

describe("POST /auth/login", () => {
  beforeEach(async () => {
    await User.deleteMany(); // Clear database before each test
  });

  it("should login successfully and return a token", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await User.create({
      email: "test@example.com",
      password: hashedPassword,
      role: "user",
    });

    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Login successful");
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("role", "user");
    expect(res.body).toHaveProperty("userId", user._id.toString());
  });

  it("should not login with incorrect password", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await User.create({
      email: "test@example.com",
      password: hashedPassword,
      role: "user",
    });

    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid email or password");
  });

  it("should not login with non-existing email", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid email or password");
  });
});
