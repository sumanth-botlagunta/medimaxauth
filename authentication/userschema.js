var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: Number,
  role: String
},{
  collection: 'userdata'
});

const model = mongoose.model("users", userSchema);
module.exports = model;
