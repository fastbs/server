const express = require("express");
const router = express.Router();
//const passport = require("../modules/passport");
const Stuff = require("../models/stuff-model");
//const User = require("../models/user-model");


//const Resource = { route: "stuffs" };

router.get("/", (req, res) => {
    Stuff.find({}, "type description", (err, stuffs) => {
        if (err) {
            res.status(500).send({
                status: "ERROR",
                message: "Что-то пошло не так...",
            });
        } else {
            res.send({
                status: "OK",
                stuffs: stuffs
            });
        }
    }).sort({
        _id: -1
    });
}
);

router.get("/:id", (req, res) => {
    Stuff.findById(req.params.id, "type description", (err, stuff) => {
        if (err) {
            res.status(500).send({
                status: "ERROR",
                message: "Что-то пошло не так...",
            });
        } else {
            res.send({
                status: "OK",
                stuff: stuff
            });
        }
    });
}
);

module.exports = router;