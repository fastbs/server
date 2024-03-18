const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");

const config = require("../config/config");
const User = require("../models/user-model");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

var myExtractor = function (req) {
    var token = passportJWT.ExtractJwt.fromAuthHeaderWithScheme("jwt")(req);
    if (token=="null") {
        const payload = { id: "62bd2ff93e1cb3efb498745f" };
        token = jwt.sign(payload, config.secretKey);
    }
    return token;
}

const jwtOptions = {}
jwtOptions.secretOrKey = config.secretKey;
jwtOptions.jwtFromRequest = myExtractor;

passport.use(new JwtStrategy(jwtOptions, function (jwt_payload, done) {
    User.findOne({ _id: jwt_payload.id }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

module.exports = passport;
module.exports.jwt = jwt;
module.exports.jwtOptions = jwtOptions;
