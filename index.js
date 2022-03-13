var express = require("express");
var cors = require("cors");
var app = express();
var db = require("./db");

const port = process.env.PORT || 8000;

app.use(cors());

const Authcontroller = require("./authentication/authcontroller");

app.use('api/authentication', Authcontroller);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});