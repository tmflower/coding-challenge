const express = require("express");
const cors = require("cors");
const { NotFoundError } = require("./expressError");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());

app.use("/", routes);

app.use(function (req, res, next){
    return next(new NotFoundError());
});

app.use(function (req, res, next) {
    let status = err.status || 500;
    let message = err.message;
    return res.status(status).json({error: {message, status}})
});

module.exports = app;
