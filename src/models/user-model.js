const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const Resource = require("./resource-model");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    roles: {
        type: Array
    }
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;

module.exports.createUser = (newUser, callback) => {
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newUser.password, salt, (error, hash) => {
            const newUserResource = newUser;
            newUserResource.password = hash;
            newUserResource.save(callback);
        });
    });
};

module.exports.getUserByEmail = (email, callback) => {
    const query = { email };
    UserModel.findOne(query, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcryptjs.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};

module.exports.checkUserRights = (user, checkRes, cb) => {
    Resource.findOne({ "route": checkRes.route, "actions.name": checkRes.action }, "actions", (err, res) => {
        if (err)
            throw (err);
        if (!res) {
            cb(true);
        } else {
            const f = res.actions.filter(x => x.name==checkRes.action)[0];
            cb(!user.roles.filter(x => f.roles.includes(x)).length);
        }
    });

};
