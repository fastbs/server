const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const GanttSchema = new Schema({
    data: {
        type: Array
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    startDate: {
        type: String
    }
});

const GanttModel = mongoose.model("gantts", GanttSchema);
module.exports = GanttModel;