const express = require("express");

const router = express.Router();

const Comic = require("../models/Comic");
const Note = require("../models/Note");

router.get("/", function (req, res){
    res.render("index");
})

module.exports = router;