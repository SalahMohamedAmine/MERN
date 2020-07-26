const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config =require('config');
const User =  require('../../models/User')

// @route Post api/users
// @desc register user
// @access Public

router.post('/',[
    check('name', "Name is required").not().isEmpty(),
    check('email','Email not valid').isEmail(),
    check('password','enter a password with 4 or more characters').isLength({min:4})
],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors : errors.array()
        })
    }

    const { name, email , password} = req.body;

    try {
          //see if user exists
            let user = await User.findOne({email : email})
            if(user ){
                return res.status(400).json({
                    errors : [{msg: 'USER already exists'}]
                })
            }
          //Get Users gravatar
          const avatar = gravatar.url(email, {
              s:'200',
              r:'pg',
              d:'mm'
          })
          user = new User({
              name,
              email,
              avatar,
              password
          })
          //Encrypt password
                //create the salt 
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password , salt);

            await user.save();

            //data
            const payload = {
                user: {
                    //id will come from user.save() //_id
                    id : user.id
                }
            };

            jwt.sign(
                payload, 
                config.get('jwtSecret'),
                {expiresIn:360000},
                (err, token) =>  {
                    if(err) {throw err;}
                    else
                    return res.json({token})
                }
            );

            //res.send('User Registered');
          //Return jsonwebtoken
        }catch(error){
            console.log(error);
            return res.status(500).send('Server Error');
    }
   
})

module.exports = router;