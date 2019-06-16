const express = require("express");

const router = express.Router();

const cheerio = require("cheerio");
const axios = require("axios");
const db = require("../models");

router.get("/", function (req, res) {
    res.render("comic");
});

router.get("/scrape", function (req, res) {

    const results = [];
    const comics = ["calvinandhobbes", "wallace-the-brave", "the-awkward-yeti", "pearlsbeforeswine", "how-to-cat", "closetohome", "culdesac", "deflocked", "dilbert-classics", "fminus", "lio", "herman", "poochcafe", "sweet-and-sour-pork", "sarahs-scribbles"];

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

    for (let i = 0; i < comics.length; i++) {
        let comic = comics[i];

        let url = `https://www.gocomics.com/${comic}/${date}`

        console.log("TCL: url", url);

        axios.get(url).then(function (res) {
            let $ = cheerio.load(res.data);


            $("a.js-item-comic-link").each(function (i, element) {
                let comic = $(element).attr("title");

                let img = $(element).children().children().attr("src");

                results.push({
                    comic: comic,
                    img: img,
                    date: date
                });
            })

            console.log("TCL: results", results);
            setTimeout(() => {
                db.Comic.create(results)
                .then(function(dbArticle) {
                    console.log(dbArticle)
                })
                .catch(function(err){
                    console.log(err);
                });
            }, 5000);


        });
        res.send("Scrape Complete");

    }


})

module.exports = router;