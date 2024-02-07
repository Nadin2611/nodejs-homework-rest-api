import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { app } from "../app.js";

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
    await mongoose.disconnect(DB_HOST);
  });

  test("loginUser controller return a response with a status code of 200", async () => {
    const response = await request(app).post(ENDPOINT).send(TEST_LOGIN_USER);

    expect(response.status).toBe(200);
  });

  test("loginUser controller return a token", async () => {
    const response = await request(app).post(ENDPOINT).send(TEST_LOGIN_USER);
    // console.log(response.body.token);
    expect(response.body.token).toBeDefined();
  });

  test("loginUser controller return a user object with email and subscription fields of type String", async () => {
    const response = await request(app).post(ENDPOINT).send(TEST_LOGIN_USER);
    expect(response.body.user).toBeDefined();

    // варіант 1     перевірка об'єктів на рівність, чи має об'єкт властивості
    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: expect.any(String),
        subscription: expect.any(String),
      })
    );

    // варіант 2  перевірка чи має об'єкт властивості
    // expect(response.body.user).toHaveProperty("email", expect.any(String));
    // expect(response.body.user).toHaveProperty(
    //   "subscription",
    //   expect.any(String)
    // );
  });
});
