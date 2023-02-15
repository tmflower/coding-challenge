const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(function (req, res, next) {
    let status = err.status || 500;
    let message = err.message;
    return res.status(status).json({error: {message, status}})
})
app.listen(3001, () => {
    console.log('Listening on port 3001');
});
