const mongoose = require("mongoose");

const connectionString = process.env.MONGO_DB_URI;

//conexion a mongoDB
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

/*const user = new User({
  name: "te",
  date: new Date(),
  important: true,
});

user
  .save()
  .then((result) => {
    console.log(result);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
  });*/
