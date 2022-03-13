var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  phone: Number,
  role: String,
  qualification: String,
});

mongoose.model("users", userSchema);
module.exports = mongoose.model("users");
