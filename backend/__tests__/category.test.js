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

describe("Category API Tests", () => {
  beforeEach(async () => {
    await Category.deleteMany();
  });

  it("should create a new category", async () => {
    const res = await request(app)
      .post("/api/category")
      .send({ name: "Electronics" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", "Electronics");
  });

  it("should retrieve categories as a tree structure", async () => {
    const res = await request(app).get("/api/category/");
    expect(res.status).toBe(200);
  });

  it("should update a category", async () => {
    const category = await Category.create({ name: "Old Name" });
    const res = await request(app)
      .put(`/api/category/${category._id}`)
      .send({ name: "New Name" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", "New Name");
  });

  it("should delete a category and its subcategories", async () => {
    const category = await Category.create({ name: "To Delete" });
    const res = await request(app).delete(`/api/category/${category._id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Category and all its subcategories deleted"
    );
  });
});
