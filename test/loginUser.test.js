import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { app } from "../app.js";

// import { loginUser } from "../controllers/userControllers.js";

const { DB_HOST } = process.env;

const ENDPOINT = "/api/users/login";
const TEST_LOGIN_USER = {
  password: "1234567",
  email: "example@gmail.com",
};

describe("test loginUser controller", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
  });
  afterAll(async () => {
    mongoose.disconnect(DB_HOST);
  });

  test("loginUser controller return a response with a status code of 200", async () => {
    const response = await request(app).post(ENDPOINT).send(TEST_LOGIN_USER);

    expect(response.status).toBe(200);
  });
});
