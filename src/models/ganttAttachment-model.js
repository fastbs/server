const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const GanttAttachmentSchema = new Schema({
    ganttId: {
        type: String
    },
    taskId: {
        type: Number
    },
    counter: {
        type: Number
    },
    list: [
        {
            fileName: String,
            fileSize: String,
            description: String,
            dateCreate: String,
            dateUpdate: String,
            userCreate: String,
            userUpdate: String,
            version: Number
        }
    ],
});

const GanttAttachmentModel = mongoose.model("gantt-attachments", GanttAttachmentSchema);
module.exports = GanttAttachmentModel;