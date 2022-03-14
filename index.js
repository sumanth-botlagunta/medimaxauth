var express = require("express");
var app = express();
var db = require("./db");

const port = process.env.PORT || 8000;
var cors = require("cors");
app.use(cors());

const Authcontroller = require("./authentication/authcontroller");

app.get("/", (req, res) => {
    res.send("<h1>Hello welcome to authapi</h1>");
  });

app.use('/api/authentication', Authcontroller);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});