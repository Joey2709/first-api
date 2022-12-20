const noteRouters = require("express").Router();
const Note = require("../models/Note");
const User = require("../models/User");

noteRouters.post("/", async (request, response) => {
  const { body } = request;
  const { content, important, userId } = body;

  const user = await User.findById(userId);

  if (!content) {
    return response.status(400).json({
      error: "No data",
    });
  }

  const note = new Note({
    content,
    date: new Date(),
    important: important || false,
    user: user._id,
  });

  try {
    const noteSaved = await note.save();

    user.notes = user.notes.concat(noteSaved._id);

    await user.save();

    response.json(noteSaved);
  } catch (error) {
    response.status(400).json({
      error: "No data",
    });
  }
});

module.exports = noteRouters;
