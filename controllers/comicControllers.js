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

router.get("/selection", function (req, res) {



    db.Type.find().sort([['title', 'ascending']])
        .then(function (data) {


            let types = {
                types: data
            }
            res.render("selection", types)
        })
        .catch(function (err) {
            console.log(err);
        })
})

router.get("/scrape", function (req, res) {

    let date = todaysDate();

    let selection = req.body

    if (req.body === null) {
        selection = ["calvinandhobbes", "wallace-the-brave", "the-awkward-yeti", "pearlsbeforeswine", "how-to-cat", "closetohome", "culdesac", "deflocked", "dilbert-classics", "fminus", "lio", "herman", "poochcafe", "sweet-and-sour-pork", "sarahs-scribbles", "getfuzzy"];
    }

    for (let i = 0; i < selection.length; i++) {
        let comic = selection[i];

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

router.get("/scrape/types", function (req, res) {

    let url = `https://www.gocomics.com/comics/a-to-z`


    axios.get(url).then(function (res) {
        let $ = cheerio.load(res.data);


        $("a.gc-blended-link").each(function (i, element) {
            let link = $(element).attr("href");

            let splitLink = link.split("/");

            let trueLink = splitLink[1];

            let title = $(element).children().children().children().children().attr("alt");

            let result = {
                title: title,
                link: trueLink
            };
            db.Type.create(result)
                .then(function (dbComic) {
                    console.log(dbComic)
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

    });

    res.send("Scrape Complete");
});

router.get("/comic/:id", function (req, res) {
    const id = req.params.id;

    db.Comic.findById(id)
        .populate("notes")
        .then(function (data) {
            res.render("comment", data)
        })
});

router.post("/comic/:id/note", function (req, res) {

    let id = req.params.id;

    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Comic.findOneAndUpdate({ _id: id }, { $push: { body: dbNote._id } }, { new: true })
        })
        .then(function (dbComic) {
            res.json(dbComic);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Retrieve User and create new user

// router.post("user/:id", function (req,res){
//     let id = req.params.id

//     db.User.create(req.body)

//         })
// })

// router.get("user/:id", function (req,res){
//     let id = req.params.id

// })


module.exports = router;