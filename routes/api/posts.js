const express = require('express'),
      router = express.Router(),
      mongoose = require('mongoose'),
      passport = require('passport');

const Post = require('../../models/Post'),
      Profile = require('../../models/Profile');

const validatePostInput = require('../../validation/post');

// @route  GET api/posts
// @desc   Get posts 
// @access Public
router.get('/', (req, res) => {
    Post.find()
        .sort({date: -1}) // -1 sort by date added DESC
        .exec()
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({nopostsfound: 'No posts found'}));
});

// @route  GET api/posts/:id
// @desc   Get post by id 
// @access Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .exec()
        .then(post => res.json(post))
        .catch(err => res.status(404).json({nopostfound: 'No post found with that ID'}));
});

// @route  POST api/posts
// @desc   Create post 
// @access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validatePostInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const newPost = new Post({
        ...req.body,
        user: req.user.id
    });
    
    newPost.save()
        .then(post => res.json(post))
        .catch(err => res.status(400).json(err));
});


// @route  DELETE api/posts/:id
// @desc   Delete post 
// @access Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
        const response = await Post.findOneAndRemove({user: req.user.id, _id: req.params.id});
        return response 
        ? res.json({success: true, response})
        : res.status(404).json({postnotfound: 'No post found'});

        // // await Profile.findOne({user: req.user.id});
        // const post = await Post.findById(req.params.id);
        // // Check for post owner
        // if (post.user.toString() !== req.user.id) { 
        //     return res.status(401).json({notauthorized: 'User not authorized'}); // 401 is a not authorized
        // }
        // await post.remove();
        // res.json({success: true});
    } catch (err) {
        res.status(404).json({postnotfound: 'No post found'});
    }
});

// @route  POST api/posts/like/:id
// @desc   Like post 
// @access Private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        const isLiked = post.likes.filter(like => like.user.toString() === req.user.id).length > 0;
        if (isLiked) {
            return res.status(400).json({alreadylike: 'User already liked this post'});
        }
        post.likes.unshift({user: req.user.id});
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(404).json({postnotfound: 'No post found'});
    }
});

// @route  POST api/posts/unlike/:id
// @desc   Unlike post 
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        let removeIndex = false;
        // map trhoug post.likes and verify if the current user already liked the post
        // removeIndex gets the index if alredy liked or false if not 
        post.likes.map((like, index) => {
            if (like.user.toString() === req.user.id) {
                removeIndex = index;
            }
        });
        if (removeIndex === false) {
            return res.status(400).json({notliked: 'You have not yet liked this post'});
        }
        post.likes.splice(removeIndex, 1);
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(404).json({postnotfound: 'No post found'});
    }
});

// @route  POST api/posts/comment/:id
// @desc   Add comment to post
// @access Private
router.post('/comment/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    const {errors, isValid} = validatePostInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    try{
        const post = await Post.findById(req.params.id).exec();
        const newComment = {...req.body};
        post.comments.unshift(newComment);
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(404).json({postnotfound: 'No post found'});
    }
});

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Remove comment from post
// @access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
        const post = await Post.findOne({_id: req.params.id});
        let removeCommentIndex = false;
        post.comments.map((comment, index) => {
            if (comment.id.toString() === req.params.comment_id) {
                removeCommentIndex = index;
            }
        });
        if (removeCommentIndex === false) {
            return res.status(404).json({nocommentfount: 'Comment does not exist'});
        }
        post.comments.splice(removeCommentIndex, 1);
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(404).json({postnotfound: 'No post found'});
    }
});


module.exports = router;