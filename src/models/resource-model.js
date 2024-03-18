const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    route: {
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    actions: [{
        name: {
            type: String,
            required: true
        },
        roles: {
            type: Array,
            required: true
        }
    }]
});

const ResourceModel = mongoose.model("resources", ResourceSchema);
module.exports = ResourceModel;