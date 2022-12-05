const mongoose = require("mongoose");

const connectionString = `${process.env.MONGO_DB_URI}`;

//conexion a mongoDB
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });
