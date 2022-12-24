require("dotenv").config();
require("./mongo");

const express = require("express"); //const express = require("express") //FUNCIONA IGUAL CON COMMONJS
const cors = require("cors");

const Note = require("./models/Note");
const User = require("./models/User");

const notFound = require("./middleware/notFound.js");
const handleErrors = require("./middleware/handleErrors.js");

const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");
const userExtractor = require("./middleware/userExtractor");
const noteRouter = require("./controllers/notes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/notes", async (request, response) => {
  const notes = await Note.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(notes);
});

/* EN LA REQUEST SIEMPRE LLEGA STRINGS */
app.get("/api/notes/:id", (request, response) => {
  const { id } = request.params;

  Note.findById(id)
    .then((Note) => {
      if (Note) {
        response.json(Note);
      } else {
        response.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/notes/:id", userExtractor, async (request, response, next) => {
  const { id } = request.params;

  const res = await Note.findByIdAndDelete(id);
  if (res === null) return response.sendStatus(404);

  response.status(204).end();
});

app.post("/api/notes", userExtractor, async (request, response, next) => {
  const { content, important = false } = request.body;

  const { userId } = request;

  const user = await User.findById(userId);

  if (!content) {
    return response.status(400).json({
      error: "No data",
    });
  }

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id,
  });

  try {
    const savedNote = await newNote.save();

    user.notes = user.notes.concat(savedNote._id);

    await user.save();

    response.json(savedNote);
  } catch (error) {
    next(error);
  }
});

app.put("/api/notes/:id", userExtractor, (request, response, next) => {
  const { id } = request.params;
  const Note = request.body;

  const newNote = {
    content: Note.name,
    date: new Date(),
    important: Note.important,
  };

  Note.findByIdAndUpdate(id, newNote, { new: true }).then((result) => {
    response.json(result);
  });
});

//app.use("/api/notes", noteRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(notFound);

app.use(handleErrors);

//SERVER
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };
