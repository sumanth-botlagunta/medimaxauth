var express = require("express");
var router = express.Router();
var User = require("./userschema");
var config = require("../config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/users',(req,res) => {
  User.find({},(err,result) => {
      if(err) throw err;
      res.send(result)
  })
})

router.post('/register',async (req, res) => {
  // var hashpassword = bcrypt.hashSync(req.body.password,8);
  // User.create({
  //     name:req.body.name,
  //     email:req.body.email,
  //     password:hashpassword,
  //     phone:req.body.phone,
  //     role:req.body.role?req.body.role:'User'
  // },(err,data) => {
  //     if(err) return res.status(500).send('Error')
  //     res.status(200).send('Register success')
  // })
  console.log(req.body)
	try {
		const newPassword = await bcrypt.hash(req.body.password, 10)
		await User.create({
			name: req.body.name,
			email: req.body.email,
			password: newPassword,
      phone:req.body.phone,
      role:req.body.role?req.body.role:'User'
		})
		res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email' })
	}
})

router.post('/login', async (req, res) => {
  // User.findOne({email:req.body.email},(err,user) => {
  //     if(err) return res.status(500).send("Error")
  //     if(!user) return res.status(500).send({auth:false,token:'No user Found'})
  //     else{
  //         const passIsValid = bcrypt.compareSync(req.body.password, user.password)
  //         if(!passIsValid) return res.status(500).send({auth:false,token:'Invalid password'})
  //         var token = jwt.sign({id:user._id}, config.secret, {expiresIn:86400})
  //         res.send({auth:true,token:token})
  //     }
  // })


   User.findOne({
		email: req.body.email,
	},(err, user) => {
    if (err) return res.status(109).send('Error on the server.')
    if (!user) {
      return { status: 'error', error: 'Invalid login' }
    }
  
    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password
    )
  
    if (isPasswordValid) {
  var token = jwt.sign(
        {
          email: user.email
          
        },
        config.secret,
        { expiresIn: 86400 }
      )
  
      return res.json({ status: 'ok', user: token })
    } else {
      return res.json({ status: 'error', user: false })
    }
  })

	

})


router.get('/userInfo',(req,res) => {
  var token = req.headers['x-access-token'];
  if(!token) return res.status(500).send({auth:false,token:'No Token Provided'})
  jwt.verify(token, config.secret, (err,user) => {
      if(err) return res.status(500).send({auth:false,token:'Invalid Token'})
      User.findById(user.id,(err,result) => {
          res.send(result)
      })
  })
})

module.exports = router;
