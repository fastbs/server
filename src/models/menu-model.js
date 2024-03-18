const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MenuSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
    },
    route: {
        type: String,
    },
    roles: {
        type: Array,
    },
    icon: {
        type: String,
    }
});

const MenuModel = mongoose.model("menus", MenuSchema);
module.exports = MenuModel;