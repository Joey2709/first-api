const mongoose = require("mongoose");
const supertest = require("supertest");
const { app, server } = require("../index");

const api = supertest(app);

test("Notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("one note", async () => {
  const response = await api.get("/api/notes");
  expect(response.body).toHaveLength(1);
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
