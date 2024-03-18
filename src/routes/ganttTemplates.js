const express = require("express");
const router = express.Router();
const passport = require("../modules/passport");
const Gantt = require("../models/gantt-model");
const GanttTemplate = require("../models/ganttTemplate-model");
const User = require("../models/user-model");


const Resource = { route: "ganttTemplates" };

router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    Resource.action = "fetch";

    User.checkUserRights(req.user, Resource, (err) => {
        if (err) {
            res.status(403).send({
                status: "Forbidden",
                message: "Доступ запрещен",
            });
        } else {
            GanttTemplate.find({}, "title description", (err, ganttTemplates) => {
                if (err) {
                    res.status(500).send({
                        status: "ERROR",
                        message: "Что-то пошло не так...",
                    });
                } else {
                    res.send({
                        status: "OK",
                        ganttTemplates: ganttTemplates
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
            GanttTemplate.findById(req.params.id, "", (err, ganttTemplate) => {
                if (err) {
                    res.status(500).send({
                        status: "ERROR",
                        message: "Что-то пошло не так...",
                    });
                } else {
                    res.send({
                        status: "OK",
                        ganttTemplate: ganttTemplate
                    });
                }
            });
        }
    });
});

router.post("/", (req, res) => {
    const ganttTemplate = new GanttTemplate({
        title: req.body.title,
        description: req.body.description,
        data: req.body.data,
        startDate: req.body.startDate
    });
    ganttTemplate.save((err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send({
                success: true,
                id: data._id,
                message: `Шаблон диаграммы Ганта сохранен. ID = ${data._id}`
            });
        }
    });
});
/*
router.put("/:id", (req, res) => {
    Post.findById(req.params.id, "title description", (err, post) => {
        if (err) {
            console.log(err);
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
});

router.delete("/:id", (req, res) => {
    Post.remove({
        _id: req.params.id
    }, err => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});
*/

module.exports = router;