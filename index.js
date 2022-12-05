require("dotenv").config();
require("./mongo");

const express = require("express"); //const express = require("express") //FUNCIONA IGUAL CON COMMONJS
const cors = require("cors");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/notes", (request, response) => {
  User.find({}).then((user) => {
    response.json(user);
  });
});

/* EN LA REQUEST SIEMPRE LLEGA STRINGS */
app.get("/api/notes/:id", (request, response) => {
  const { id } = request.params;

  User.findById(id)
    .then((user) => {
      if (user) {
        response.json(user);
      } else {
        response.status(404).end();
      }
    })
    .catch((err) => {
      console.log(err);
      response.status(400).end();
    });
});

app.delete("/api/notes/:id", (request, response) => {
  const { id } = request.params;

  notes = notes.filter((e) => e.id !== id);
  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const user = request.body;

  if (!user || !user.name) {
    return response.status(400).json({
      error: "No data",
    });
  }

  const newUser = new User({
    name: user.name,
    date: new Date(),
    important: user.important || false,
  });

  newUser.save().then((savedUser) => {
    response.json(savedUser);
  });
});

app.use((request, response) => {
  response.status(404).json({
    error: "Not found",
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
