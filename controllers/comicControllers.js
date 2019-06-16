const express = require("express");

const router = express.Router();

const cheerio = require("cheerio");
const axios = require("axios");
const db = require("../models");

function todaysDate() {
    const today = new Date();

    let month = today.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    };

    let day = today.getDate();
    if (day < 10) {
        day = "0" + day;
    };

    let date = today.getFullYear() + '/' + month + '/' + day;
    return date;
}

router.get("/", function (req, res) {
    let date = todaysDate();
    db.Comic.find({ date: date })
        .then(function (data) {
            if (!data) {
                let hbsObject = {
                    text: "Go get some comics first!"
                }
                res.render("comic", hbsObject);
            } else {
                let hbsObject = {
                    comic: data
                };
                res.render("comic", hbsObject);
            };
        });
});

router.get("/scrape", function (req, res) {

    let date = todaysDate();

    const comics = ["calvinandhobbes", "wallace-the-brave", "the-awkward-yeti", "pearlsbeforeswine", "how-to-cat", "closetohome", "culdesac", "deflocked", "dilbert-classics", "fminus", "lio", "herman", "poochcafe", "sweet-and-sour-pork", "sarahs-scribbles"];

    for (let i = 0; i < comics.length; i++) {
        let comic = comics[i];

        let url = `https://www.gocomics.com/${comic}/${date}`


        axios.get(url).then(function (res) {
            let $ = cheerio.load(res.data);


            $("a.js-item-comic-link").each(function (i, element) {
                let comic = $(element).attr("title");

                let img = $(element).children().children().attr("src");

                let result = {
                    comic: comic,
                    img: img,
                    date: date
                };
                db.Comic.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle)
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });

        });
    };

    res.send("Scrape Complete");
});

router.get("/comic/:id", function (req, res) {
    const id = req.params.id;

    db.Comic.findById(id)
        .populate("Note")
        .then(function (data) {
            console.log("TCL: data", data);
            res.render("comment", data)
        })
});


module.exports = router;