const express = require("express");
const router = express.Router();
const passport = require("../modules/passport");
const Post = require("../models/post-model");
const User = require("../models/user-model");


const Resource = { route: "posts" };

router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    Resource.action = "fetch";

    User.checkUserRights(req.user, Resource, (err) => {
        if (err) {
            res.status(403).send({
                status: "Forbidden",
                message: "Доступ запрещен",
            });
        } else {
            Post.find({}, "title description", (err, posts) => {
                if (err) {
                    res.status(500).send({
                        status: "ERROR",
                        message: "Что-то пошло не так...",
                    });
                } else {
                    res.send({
                        status: "OK",
                        posts: posts
                    });
                }
            }).sort({
                _id: -1
            });
        }
    });
});

router.get("/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    Resource.action = "get";

    User.checkUserRights(req.user, Resource, (err) => {
        if (err) {
            res.status(403).send({
                status: "Forbidden",
                message: "Доступ запрещен",
            });
        } else {
            Post.findById(req.params.id, "title description", (err, post) => {
                if (err) {
                    res.status(500).send({
                        status: "ERROR",
                        message: "Что-то пошло не так...",
                    });
                } else {
                    res.send({
                        status: "OK",
                        post: post
                    });
                }
            });
        }
    });
});

router.post("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    Resource.action = "post";

    User.checkUserRights(req.user, Resource, (err) => {
        if (err) {
            res.status(403).send({
                status: "Forbidden",
                message: "Доступ запрещен",
            });
        } else {
            const post = new Post({
                title: req.body.title,
                description: req.body.description
            });
            post.save((err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send({
                        success: true,
                        message: `Пост сохранен. ID = ${data._id}`
                    });
                }
            });
        }
    });
});

router.put("/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    Resource.action = "put";

    User.checkUserRights(req.user, Resource, (err) => {
        if (err) {
            res.status(403).send({
                status: "Forbidden",
                message: "Доступ запрещен",
            });
        } else {
            Post.findById(req.params.id, "title description", (err, post) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    if (req.body.title) {
                        post.title = req.body.title;
                    }
                    if (req.body.description) {
                        post.description = req.body.description;
                    }
                    post.save(err => {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(200);
                        }
                    });
                }
            });
        }
    });
});

router.delete("/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    Resource.action = "delete";

    User.checkUserRights(req.user, Resource, (err) => {
        if (err) {
            res.status(403).send({
                status: "Forbidden",
                message: "Доступ запрещен",
            });
        } else {
            Post.remove({
                _id: req.params.id
            }, err => {
                if (err) {
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

module.exports = router;