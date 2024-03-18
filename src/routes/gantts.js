const express = require("express");
const router = express.Router();
const passport = require("../modules/passport");
const Gantt = require("../models/gantt-model");
const User = require("../models/user-model");


const Resource = { route: "gantts" };

router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    Resource.action = "fetch";

    User.checkUserRights(req.user, Resource, (err) => {
        if (err) {
            res.status(403).send({
                status: "Forbidden",
                message: "Доступ запрещен",
            });
        } else {
            Gantt.find({}, "title description", (err, gantts) => {
                if (err) {
                    res.status(500).send({
                        status: "ERROR",
                        message: "Что-то пошло не так...",
                    });
                } else {
                    res.send({
                        status: "OK",
                        gantts: gantts
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
            Gantt.findById(req.params.id, "", (err, gantt) => {
                if (err) {
                    res.status(500).send({
                        status: "ERROR",
                        message: "Что-то пошло не так...",
                    });
                } else {
                    res.send({
                        status: "OK",
                        gantt: gantt
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
            const gantt = new Gantt({
                title: req.body.title,
                description: req.body.description,
                data: req.body.data,
                startDate: req.body.startDate
            });
            gantt.save((err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send({
                        success: true,
                        id: data._id,
                        message: `Диаграмма Ганта сохранена. ID = ${data._id}`
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
            Gantt.findById(req.params.id, "", (err, gantt) => {
                if (err) {
                    console.log(err);
                } else {
                    if (req.body.title) {
                        gantt.title = req.body.title;
                    }
                    if (req.body.description) {
                        gantt.description = req.body.description;
                    }
                    if (req.body.data) {
                        gantt.data = req.body.data;
                    }
                    if (req.body.startDate) {
                        gantt.startDate = req.body.startDate;
                    }
                    gantt.save(err => {
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
            Gantt.remove({
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