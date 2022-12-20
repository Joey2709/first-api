const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    name: String,
    passwordHash: String,
    notes: [{ type: Schema.Types.ObjectId, ref: "Note" }],
  },
  { versionKey: false }
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject;
    delete returnedObject.passwordHash;
  },
});

userSchema.plugin(uniqueValidator);

const User = model("User", userSchema);

module.exports = User;
