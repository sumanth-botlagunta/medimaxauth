var express = require("express");
var router = express.Router();
var User = require("./userschema");
var config = require("../config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/users", function (req, res) {
  User.find({}, function (err, users) {
    if (err) {
      res.send(err);
    }
    res.json(users);
  });
});

router.post("/register", (req, res) => {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  User.create(
    {
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      role: req.body.role,
      qualification: req.body.qualification,
    },
    function (err, user) {
      if (err) {
        res.status(500).send(err);
      }
      res.json(user);
    }
  );
});

router.post("/login", (req, res) => {
  User.findOne(
    {
      username: req.body.username,
    },
    function (err, user) {
      if (err) {
        res.status(500).send(err);
      }
      if (!user) {
        res.status(401).send("Authentication failed. User not found.");
      } else if (user) {
        if (!bcrypt.compareSync(req.body.password, user.password)) {
          res.status(401).send("Authentication failed. Wrong password.");
        } else {
          var token = jwt.sign(
            {
              id: user._id,
            },
            config.secret,
            {
              expiresIn: 86400,
            }
          );
          res.json({
            success: true,
            message: "Enjoy your token!",
            token: token,
          });
        }
      }
    }
  );
});

router.get("/userinfo", function (req, res) {
  var token = req.headers["x-access-token"];
  if (!token) {
    res.status(401).send({
      auth: false,
      message: "No token provided.",
    });
  } else {
    jwt.verify(token, config.secret, function (err, user) {
      if (err) {
        res.status(500).send({
          auth: false,
          message: "Token authentication failed.",
        });
      } else {
        res.status(200).send(user);
      }
    });
  }
});

module.exports = router;