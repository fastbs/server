const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const fs = require("fs");
const config = require("./config/config");
const passport = require("./modules/passport");
var fileUpload = require("express-fileupload");

mongoose.Promise = global.Promise;

const app = express();

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

app.use(fileUpload({
    defCharset: 'utf8',
    defParamCharset: 'utf8'
}));

app.use((req, res, next) => {
    var now = new Date();
    console.log("\033[1;37;44mNow: ", now.toString(), " \033[0m", "\n");
    next();
});

app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));
app.use("/gantts", require("./routes/gantts"));
app.use("/ganttTemplates", require("./routes/ganttTemplates"));
app.use("/ganttAttachments", require("./routes/ganttAttachments"));
app.use("/stuffs", require("./routes/stuffs"));

mongoose.connect(config.dbURL, config.dbOptions);
mongoose.connection
    .once("open", () => {
        var now = new Date();
        console.log("Date: ", now.toString());
        console.log("Mongoose - successful connection ...");
        app.listen(process.env.PORT || config.port,
            () => console.log(`Server start on port ${config.port} ...`));
    })
    .on("error", error => console.warn(error));