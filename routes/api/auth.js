const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const auth =require('../../middleware/auth');
const User = require('../../models/User');

// @route GET api/auth
// @desc Test route
// @access Public

router.get('/', auth,async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
      console.log(error);
      res.status(500).send('Server Error')
  }
});

// @route Post api/auth
// @desc  Authenticate user & get token
// @access Public

router.post('/', [
  check('email', 'Email not valid').isEmail(),
  check('password', 'password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

  const { email, password } = req.body;

  try {
    //see if user exists
    let user = await User.findOne({ email: email })
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: 'Invalid credentials' }]
      })
    }
    
    //check match password
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
      return res.status(400).json({errors : [{msg : 'invalid credentials'}]});
    }

    //data
    const payload = {
      user: {
        //id will come from user.save() //_id
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) { throw err; }
        else
          return res.json({ token })
      }
    );

    //res.send('User Registered');
    //Return jsonwebtoken
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server Error');
  }

})

module.exports = router;
