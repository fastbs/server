const express = require("express");
const fs = require("fs");
const config = require("../config/config");
const router = express.Router();
const passport = require("../modules/passport");
const Gantt = require("../models/gantt-model");
const ganttAttachment = require("../models/ganttAttachment-model");
const User = require("../models/user-model");


const Resource = { route: "ganttAttachments" };

router.get("/:id/:taskId", passport.authenticate('jwt', { session: false }), (req, res) => {
    Resource.action = "fetch";

    User.checkUserRights(req.user, Resource, (err) => {
        if (err) {
            res.status(403).send({
                status: "Forbidden",
                message: "Доступ запрещен",
            });
        } else {
            ganttAttachment.find({ "ganttId": req.params.id, "taskId": req.params.taskId }, "", (err, ganttAttachments) => {
                if (err) {
                    res.status(500).send({
                        status: "ERROR",
                        message: "Что-то пошло не так...",
                    });
                } else {
                    res.send({
                        status: "OK",
                        ganttAttachments: ganttAttachments[0]
                    });
                }
            }).sort({
                _id: -1
            });
        }
    });
});

router.get("/:ganttId/:taskId/:listId", passport.authenticate('jwt', { session: false }), (req, res) => {
    Resource.action = "get";

    User.checkUserRights(req.user, Resource, (err) => {
        if (err) {
            res.status(403).send({
                status: "Forbidden",
                message: "Доступ запрещен",
            });
        } else {
            ganttAttachment.find({ "ganttId": req.params.ganttId, "taskId": req.params.taskId }, "", (err, ganttAttachments) => {
                if (err) {
                    res.status(500).send({
                        status: "ERROR",
                        message: "Что-то пошло не так...",
                    });
                } else {
                    if (ganttAttachments.length == 1) {
                        let ga = ganttAttachments[0];
                        let listPosition = null;
                        let listItem = ga.list.find((item, index) => {
                            if (item._id == req.params.listId) {
                                listPosition = index;
                                return true;
                            }
                        });

                        if (listPosition != null) {
                            res.download(`${config.attachmentsDir}${req.params.ganttId}/${req.params.taskId}/${listItem.fileName}`, function (err) {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send({
                                        status: "ERROR",
                                        message: err.message,
                                    });
                                }
                            });
                        } else {
                            res.status(500).send({
                                status: "ERROR",
                                message: "Вложение не существует",
                            });
                        }
                    }
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
            ganttAttachment.find({ "ganttId": req.body.id, "taskId": req.body.taskId }, "", (err, ganttAttachments) => {
                if (err) {
                    res.status(500).send({
                        status: "ERROR",
                        message: "Что-то пошло не так...",
                    });
                } else {
                    fs.mkdirSync(`${config.attachmentsDir}${req.body.id}/${req.body.taskId}/`, { recursive: true })
                    req.files.attachment.mv(`${config.attachmentsDir}${req.body.id}/${req.body.taskId}/${req.files.attachment.name}`);

                    let ga = null;
                    let gal = {
                        fileName: req.files.attachment.name,
                        fileSize: req.files.attachment.size,
                        description: "Default",
                        dateCreate: new Date().toISOString(),
                        dateUpdate: "",
                        userCreate: req.user._id.toString(),
                        userUpdate: "",
                        version: 1
                    };

                    if (ganttAttachments.length == 1) {
                        ga = ganttAttachments[0];
                        ga.counter++;
                        ga.list.push(gal);
                    } else {
                        ga = new ganttAttachment({
                            name: "",
                            ganttId: req.body.id,
                            taskId: req.body.taskId,
                            counter: 1,
                            list: gal,
                        });
                    }

                    ga.save((err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send({
                                status: "OK",
                                message: `Вложение сохранено. ID = ${data._id}`,
                                filename: req.files.attachment.name,
                                filesize: req.files.attachment.size
                            });
                        }
                    });
                }
            })
        }
    });
});

router.put("/:ganttId/:taskId/:listId", passport.authenticate('jwt', { session: false }), (req, res) => {
    Resource.action = "put";

    User.checkUserRights(req.user, Resource, (err) => {
        if (err) {
            res.status(403).send({
                status: "Forbidden",
                message: "Доступ запрещен",
            });
        } else {
            ganttAttachment.find({ "ganttId": req.params.ganttId, "taskId": req.params.taskId }, "", (err, ganttAttachments) => {
                if (err) {
                    res.status(500).send({
                        status: "ERROR",
                        message: "Что-то пошло не так...",
                    });
                } else {
                    if (ganttAttachments.length == 1) {
                        let ga = ganttAttachments[0];
                        let listPosition = null;
                        let listItem = ga.list.find((item, index) => {
                            if (item._id == req.params.listId) {
                                listPosition = index;
                                return true;
                            }
                        });

                        if (listPosition != null) {
                            console.log("BODY: ", req.body)
                            ga.list[listPosition].description = req.body.description;
                            ga.list[listPosition].dateUpdate = new Date().toISOString();
                            ga.list[listPosition].userUpdate = req.user._id.toString();
                            ga.list[listPosition].version++;

                            ga.save((err, data) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.send({
                                        status: "OK",
                                        message: `Вложение изменено. ID = ${data._id}`,
                                    });
                                }
                            });
                        } else {
                            res.status(500).send({
                                status: "ERROR",
                                message: "Что-то пошло не так...",
                            });
                        }
                    }
                }
            });
        }
    });
});

router.delete("/:ganttId/:taskId/:listId", passport.authenticate('jwt', { session: false }), (req, res) => {
    Resource.action = "delete";

    User.checkUserRights(req.user, Resource, (err) => {
        if (err) {
            res.status(403).send({
                status: "Forbidden",
                message: "Доступ запрещен",
            });
        } else {
            ganttAttachment.find({ "ganttId": req.params.ganttId, "taskId": req.params.taskId }, "", (err, ganttAttachments) => {
                if (err) {
                    res.status(500).send({
                        status: "ERROR",
                        message: "Что-то пошло не так...",
                    });
                } else {
                    if (ganttAttachments.length == 1) {
                        let ga = ganttAttachments[0];
                        let listPosition = null;
                        let listItem = ga.list.find((item, index) => {
                            if (item._id == req.params.listId) {
                                listPosition = index;
                                return true;
                            }
                        });

                        if (listPosition != null) {
                            let ra = ga.list.splice(listPosition, 1);
                            ga.counter--;
                            fs.rmSync(`${config.attachmentsDir}${req.params.ganttId}/${req.params.taskId}/${ra[0].fileName}`);

                            if (ga.counter > 0) {
                                ga.save((err, data) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.send({
                                            status: "OK",
                                            message: `Вложение удалено. ID = ${listItem._id}`
                                        });
                                    }
                                });
                            } else {
                                ganttAttachment.remove({
                                    _id: ga._id
                                }, err => {
                                    if (err) {
                                        res.status(500).send({
                                            status: "ERROR",
                                            message: "Что-то пошло не так...",
                                        });
                                    } else {

                                        res.send({
                                            status: "OK",
                                            message: `Вложение удалено. ID = ${listItem._id}`
                                        });
                                    }
                                });
                            }
                        } else {
                            res.status(500).send({
                                status: "ERROR",
                                message: "Что-то пошло не так...",
                            });
                        }
                    }
                }
            });
        }
    });
});


module.exports = router;