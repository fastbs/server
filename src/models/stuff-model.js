const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const StuffSchema = new Schema({
    type: {
        type: String,
        unique: true
    },
    description: {
        type: String
    }
});

const StuffModel = mongoose.model("stuffs", StuffSchema);
module.exports = StuffModel;