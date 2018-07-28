const express = require('express'),
      router = express.Router(),
      mongoose = require('mongoose'),
      passport = require('passport');

const validateProfileInput = require('../../validation/profile'),
      validateExperienceInput = require('../../validation/experience');
      validateEducationInput = require('../../validation/education');
      
const Profile = require('../../models/Profile');
const User = require('../../models/User');


// @route  GET api/profile/test
// @desc   Tests post route
// @access Public

// @route  GET api/profile
// @desc   Get current users profile
// @access Private
router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    const errors = {};
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']).exec();
        if (!profile) {
            errors.noprofile = 'There is no profile for this user';
            return res.status(404).json(errors);
        }
        res.json(profile);
    } catch (err) {
        res.status(404).json(err);
    }
  });

// @route  GET api/profile/all
// @desc   Get all profiles
// @access Public
router.get('/all', async (req, res) => {
    const errors = {};
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']).exec();
        if (!profiles || profiles.length === 0) {
            errors.noprofile = 'There is no profile for this user';
            return res.status(404).json(errors)
        }
        res.json(profiles);
    } catch (err) {
        res.status(404).json(err);
    }
});

// @route  GET api/profile/handle/:handle
// @desc   Get profile by handle
// @access Public
router.get('/handle/:handle', async (req, res) => {
    const errors = {};
    try{
        const profile = await Profile.findOne({handle: req.params.handle})
            .populate('user', ['name', 'avatar']).exec();
        if (!profile) {
            errors.noprofile = 'There is no profile for this user';
            res.status(404).json(errors);
        }
        res.json(profile);
    } catch (err) {
        res.status(404).json({profile: 'There are no profile for this user'});
    }
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user ID
// @access Public
router.get('/user/:user_id', async (req, res) => {
    const errors = {};

    try{
        const profile = await Profile.findOne({user: req.params.user_id})
            .populate('user', ['name', 'avatar']).exec();
        if (!profile) {
            errors.noprofile = 'There is no profile for this user';
            res.status(404).json(errors);
        }
        res.json(profile);
    } catch (err) {
        res.status(404).json({profile: 'There is no profile for this user'});
    }
});


// @route  GET api/profile
// @desc   Create or edit user profile
// @access Private
router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    const {errors, isValid} = validateProfileInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Get fields
    const socialMedias = {youtube, twitter, facebook, linkedin, instagram} = req.body;
    const social = {};
    for (let media in socialMedias) {
        if (socialMedias[media]) {
            social[media] = socialMedias[media];
        }
    }

    const profileFields = {
        ...req.body,
        user: req.user.id,
        skills: req.body.skills.split(','),
        social: social
    };
    
    const profile = await Profile.findOne({user: req.user.id}).exec();
    if (profile) {
        // Update
        const profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true});
        res.json(profile);
    } else {
        // Create
        // Check if handle exists
        let profile = await Profile.findOne({handle: profileFields.handle});
        if (profile) {
            errors.handle = 'That handle already exists';
            return res.status(400).json(errors);
        }
        profile = await new Profile(profileFields).save();
        res.json(profile);
    }
});

// @route  GET api/profile/experience
// @desc   Add experience to profile
// @access Private
router.post('/experience', passport.authenticate('jwt', {session: false}),  async (req, res) => {
    const {errors, isValid} = validateExperienceInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    try{
        const profile = await Profile.findOne({user: req.user.id});
        const newExp = {...req.body};
        profile.experience.unshift(newExp);
        const newProfile = await profile.save();
        return res.status(201).json(newProfile);
    } catch (err) {
        res.status(400).json(errors);
    }
});

// @route  GET api/profile/education
// @desc   Add education to profile
// @access Private
router.post('/education', passport.authenticate('jwt', {session: false}),  async (req, res) => {
    const {errors, isValid} = validateEducationInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    try{
        const profile = await Profile.findOne({user: req.user.id});
        const newEduc = {...req.body};
        profile.education.unshift(newEduc);
        const newEducation = await profile.save();
        return res.status(201).json(newEducation);
    } catch (err) {
        res.status(400).json(errors);
    }
});

// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete experience from profile
// @access Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}),  async (req, res) => {
    try{
        const profile = await Profile.findOneAndUpdate
        (
            {user: req.user.id},
            {$pull: {experience: {_id: req.params.exp_id}}},
            {new: true}
        );
        res.json(profile);
        // const profile = await Profile.findOne({user: req.user.id}).exec();
        // const removeIndex = profile.experience.map(item => item.id).includes(req.params.exp_id);
        // profile.experience.splice(removeIndex, 1);
        // await profile.save();
    } catch (err) {
        res.status(404).json(err);
    }
});

// @route  DELETE api/profile/education/:edu_i
// @desc   Delete education from profile
// @access Private
router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}),  async (req, res) => {
    try{
        const profile = await Profile.findOneAndUpdate
        (
            {user: req.user.id},
            {$pull: {education: {_id: req.params.edu_id}}},
            {new: true}
        );
        res.json(profile);
    } catch (err) {
        res.status(404).json(err);
    }
});

// @route  DELETE api/profile
// @desc   Delete user and profile 
// @access Private
router.delete('/', passport.authenticate('jwt', {session: false}),  async (req, res) => {
    try{
        await Profile.findOneAndRemove({user: req.user.id});
        await User.findOneAndRemove({_id: req.user.id});
        res.json({success: true});
    } catch (err) {
        res.status(404).json(err);
    }
});

module.exports = router;