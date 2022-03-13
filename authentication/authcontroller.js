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
  User.find({},(err,result) => {
    if(err) throw err;
    res.send(result)
})
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

router.post('/login',(req,res) => {
  User.findOne({username: req.body.username},(err,user) => {
      if(err) return res.status(500).send("Error")
      if(!user) return res.status(500).send({auth:false,token:'No user Found'})
      else{
          const passIsValid = bcrypt.compareSync(req.body.password, user.password)
          if(!passIsValid) return res.status(500).send({auth:false,token:'Invalid password'})
          var token = jwt.sign({id:user._id}, config.secret, {expiresIn:86400})
          res.send({auth:true,token:token})
      }
  })
})

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
