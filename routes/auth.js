const router = require('express').Router();
const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/register',  async (req, res) => {

    let error;
    const registerSchema = registerValidation();
  
    try{
        const response = await  registerSchema.validate(req.body)
    }catch(err){
        error = err;
    }

    if (error) return res.status(400).send(error.message);
    
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send("Email already exist");

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    user.save().then((response) => {
        res.send({ user: user._id});
    }).catch((err) => {
        res.status(400).send(err);
    })
});

router.post('/login', async (req, res) => {

    const loginSchema = loginValidation();
    let error;

    try{
        (await loginSchema).validate(req.body)
    }catch(err){
        error = err;
    }


    if (error) return res.status(400).send(error.message);
    
    // check if email exist
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Email not found");
   
    // password correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("Invalid Email or password");
    
    // Create assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token);
})

module.exports = router;

