const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const GanttTemplateSchema = new Schema({
    title: {
        type: String,
/*         required: true,
        unique: true */
    },
    description: {
        type: String
    },
    data: {
        type: Array
    },
    startDate: {
        type: String
    }
});

const GanttTemplateModel = mongoose.model("gantt-templates", GanttTemplateSchema);
module.exports = GanttTemplateModel;