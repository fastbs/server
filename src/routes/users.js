const express = require("express");
const router = express.Router();
const passport = require("../modules/passport");
const User = require("../models/user-model");
const Resource = require("../models/resource-model");
const Menu = require("../models/menu-model");


router.post("/register", (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        roles: [2]
    });
    User.createUser(newUser, (error, user) => {
        if (error) {
            console.log(error);
            //res.status(400);
            res.status(400).send({ message: "Ошибка - логин или e-mail уже зарегистрирован" });
        } else {
            res.send({ user });
        }
    });
});

router.post('/login', (req, res) => {
    if (req.body.email && req.body.password) {
        const email = req.body.email;
        const password = req.body.password;
        User.getUserByEmail(email, (err, user) => {
            if (!user) {
                res.status(404).json({ message: "Пользователь не существует!" });
            } else {
                User.comparePassword(password, user.password, (error, isMatch) => {
                    if (error) throw error;
                    if (isMatch) {
                        const payload = { id: user._id };
                        const token = passport.jwt.sign(payload, passport.jwtOptions.secretOrKey);
                        res.json({ message: 'ok', token });
                    } else {
                        res.status(401).json({ message: "Неверный пароль!" });
                    }
                });
            }
        });
    }
});

router.post('/permissions', passport.authenticate('jwt', { session: false }), (req, res) => {
    Resource.findOne({ "route": req.body.resource }, "actions", (err, resource) => {
        if (err)
            throw (err);
        if (!resource) {
            res.json({});
        } else {
            let p = [];
            for (let action of resource.actions) {
                p.push({ "action": action.name, "allow": req.user.roles.filter(x => action.roles.includes(x)).length > 0 ? true : false });
            }
            res.json({ permissions: p });
        }
    });
});

router.get('/menu', passport.authenticate('jwt', { session: false }), (req, res) => {
    Menu.find({}).sort('id').exec((err, menu) => {
        if (err)
            throw (err);
        if (!menu) {
            res.json({});
        } else {
            let p = [];
            for (let item of menu) {
                if (req.user.roles.filter(x => item.roles.includes(x)).length > 0) {
                    p.push(item);
                }
            }
            res.json({ menu: p });
        }
    });
});

router.get("/", (req, res) => {
    res.send("Users");
});


module.exports = router;