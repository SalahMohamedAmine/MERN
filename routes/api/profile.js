const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { remove } = require('../../models/Profile');
// @route GET api/profile/me
// @desc Get User users profile
// @access Private

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user : req.user.id}).populate('user',['name','avatar']);
    if(!profile) {
      return res.status(400).json({msg : 'There is no profile for this user'});
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route POST api/profile
// @desc Create or update user profile
// @access Private

router.post('/', [auth , [
  check('status','status is required').not().isEmpty(),
  check('skills','skills is required').not().isEmpty(),
]],async (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors : errors.array()})
  }

  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;

  //Build profile Object
  const profileFeilds= {};
  profileFeilds.user = req.user.id;
    if (company) profileFeilds.company = company;
    if (website) profileFeilds.website = website;
    if (location) profileFeilds.location = location;
    if (bio) profileFeilds.bio = bio;
    if (status) profileFeilds.status = status;
    if (githubusername) profileFeilds.githubusername = githubusername;
    if (skills) {
      profileFeilds.skills = skills.split(',').map(skill => skill.trim())
    }
    
    //Build social object
    profileFeilds.social= {}
    if(youtube) profileFeilds.social.youtube = youtube;
    if (facebook) profileFeilds.social.facebook = facebook;
    if (twitter) profileFeilds.social.twitter = twitter;
    if (instagram) profileFeilds.social.instagram = instagram;
    if (linkedin) profileFeilds.social.linkedin = linkedin;

    try {
        let profile = await Profile.findOne({user : req.user.id})
        if(profile) {
          //update
          profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFeilds }, { new: true, useFindAndModify: false});
          return res.json(profile);
        }

        //create 
        profile = new Profile(profileFeilds);
        await profile.save();
        res.json(profile);


    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
})

// @route Get api/profile
// @desc  Get all profiles
// @access Public


router.get('/',async(req,res) => {
  try {
      const profiles =await Profile.find().populate('user',['name','avatar']);
       res.json(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
})

// @route Get api/profile/user/:user_id
// @desc  Get profile by user id
// @access Public


router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({user : req.params.user_id}).populate('user', ['name', 'avatar']);
    if(!profile) {
      return res.status(400).json({msg : 'There is no profile for this user'})
    }
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    if (error.kind=='ObjectId'){
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }
    res.status(500).send('Server Error');
  }
})



// @route Delet api/profile
// @desc  Delete profile ,user & posts
// @access Private


router.delete('/',auth , async (req, res) => {
  try {

    //@toDo - remove users posts

    //remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //remove user
    await User.findOneAndRemove({ _id : req.user.id})
    res.send('User deleted')
  } catch (error) {
    console.log(error.message);
    
    res.status(500).send('Server Error');
  }
})


// @route Put api/profile/experience
// @desc  add profile experience
// @access Private


router.put('/experience', [auth, [
  check('title', 'title is required').not().isEmpty(),
  check('company', 'company is required').not().isEmpty(),
  check('from', 'from date is required').not().isEmpty(),
]], async (req, res) => {

  const errors = validationResult(req);
  if(! errors.isEmpty()){
    return res.status(400).json({error : errors.array()})
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  const newExp ={
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  //deal with mongodb
  try {
    //fetch the profile which we gonna add to him the experience
    const profile = await Profile.findOne({user : req.user.id});

    profile.experience.unshift(newExp);

    await profile.save();

    res.json(profile);

  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
})

// @route Delete api/profile/experience/:exp_id
// @desc  Delete experience from profile
// @access Private


router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {

    const profile =await Profile.findOne({user : req.user.id});

    //Get remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex,1);

    await profile.save();

    res.json(profile)

    //res.send('experience deleted')
  } catch (error) {
    console.log(error.message);

    res.status(500).send('Server Error');
  }
})










module.exports = router;
