const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validations/userValidations');

router.post('/test', (req, res) => {
    res.send({ msg: 'hola' });
});

router.post('/register', async (req, res) => {

    //Validate data before to create a user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in our DB
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send({ message: "Email already exists" });

    //HASH the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    try {
        const savedUser = await user.save();
        res.status(200).send({ user: savedUser._id });
        console.log("User registered: ", user)
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    //Validate data before to create a user
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        //Checking if the user is already in our DB
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send({ message: "Email  is wrong" });

        //Password is correct
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send({ message: "password is wrong" });

        //Create and assign token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN);
        res.header('auth-token', token).send(token);


    } catch (error) {
        res.status(400).send(error);
    }


});


module.exports = router;