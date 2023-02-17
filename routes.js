const express = require("express");
const router = express.Router();

router.get("/", async function (req, res, next) {
    try {
        return res.json({users: "users"})
    }
    catch (err) {
        return next(err);
    }
});

module.exports = router;