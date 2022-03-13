var mongoose = require("mongoose");

var userschema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  phone: Number,
  role: String,
  qualification: String,
});

mongooose.model("users", userschema);
module.exports = mongoose.model("users");
