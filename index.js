const express = require("express"); //const express = require("express") //FUNCIONA IGUAL CON COMMONJS
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let notes = [
  {
    id: 1,
    name: "te amo",
  },
  {
    id: 2,
    name: "diana",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});
/* EN LA REQUEST SIEMPRE LLEGA STRINGS */
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const result = notes.filter((e) => e.id === id);

  if (result.length > 0) {
    response.json(result);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, reponse) => {
  const id = Number(request.params.id);
  notes = notes.filter((e) => e.id !== id);
  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const note = request.body;

  if (!note || !note.name) {
    return response.status(400).json({
      error: "No data",
    });
  }

  const newId = notes.length + 1;

  const newNote = {
    id: newId,
    name: note.name,
    created: new Date().toISOString(),
  };
  notes.push(newNote);
  response.status(201).json(note);
});

app.use((request, response) => {
  response.status(404).json({
    error: "Not found",
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
