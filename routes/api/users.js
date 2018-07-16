const express = require('express'),
      router = express.Router(),
      gravatar = require('gravatar'),
      bcrypt = require('bcryptjs'),
      jwt = require('jsonwebtoken'),
      keys = require('../../config/keys'),
      passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register'),
      validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');

// @route  GET api/users/test
// @desc   Tests post route
// @access Public
router.get('/test', (req, res) => res.json({msg: 'Users Works'}));

// @route  GET api/users/register
// @desc   Register user
// @access Public
router.post('/register', async (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body); 

    if (!isValid) {
        return res.status(400).json(errors);
    }

    try {
        const user = await User.findOne({email: req.body.email}).exec();
        if (user) {
            errors.email = 'Email already exists'
            return res.status(400).json({errors});
        } 
        const avatar = gravatar.url(req.body.email, {
            s: '200', // size
            r: 'pg', // rating,
            d: 'mm' // default
        });
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            avatar,
            password: req.body.password
        });
        try {
            const salt = await bcrypt.genSalt(10);
            newUser.password = await bcrypt.hash(newUser.password, salt);
            newUser.save();
            res.json(newUser);
        } catch (err) {
            res.status(400).json({err});
        }
    } catch (err) {
        throw err;
    }

    // User.findOne({email: req.body.email})
    //     .exec()
    //     .then(async (user) => {
    //         if (user) {
    //             errors.email = 'Email already exists'
    //             return res.status(400).json({errors});
    //         } else {
    //             const avatar = gravatar.url(req.body.email, {
    //                 s: '200', // size
    //                 r: 'pg', // rating,
    //                 d: 'mm' // default
    //             });
    //             const newUser = new User({
    //                 name: req.body.name,
    //                 email: req.body.email,
    //                 avatar,
    //                 password: req.body.password
    //             });
    //             try {
    //                 const salt = await bcrypt.genSalt(10);
    //                 newUser.password = await bcrypt.hash(newUser.password, salt);
    //                 await newUser.save();
    //                 res.json(newUser);
    //             } catch (err) {
    //                 res.status(400).json({err});
    //             }
    //         }
    //     })
});

// @route  GET api/users/login
// @desc   Login user / Returning JWT Token
// @access Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body); 

    if (!isValid) {
        return res.status(400).json(errors);
    }
    const {email, password} = req.body;

    // Find user by email
    User.findOne({email})
        .exec()
        .then(async user => {
            // Check for user
            if (!user) {
                errors.email = 'User not found';
                return res.status(404).json(errors);
            }
            // Check Password
            const isMatch = await bcrypt.compare(password, user.password); // return true or false
            if (isMatch) {
                const payload = {id: user.id, name: user.name, avatar: user.avatar}; // Create JWT payload
                // Sign Token
                jwt.sign(payload, keys.secrectOrKey, {expiresIn: 3600}, (err, token) => {
                    res.json({success: true, token: 'Bearer ' + token});
                });
            } else {
                errors.password = 'Password incorrect'
                return res.status(400).json(errors);
            }
        })
});

// @route  GET api/users/current
// @desc   Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;