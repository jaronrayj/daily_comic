const cheerio = require("cheerio");
const axios = require("axios");

let results = [];
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

const date = today.getFullYear() + '/' + month + '/' + day;

for (let i = 0; i < comics.length; i++) {
    let comic = comics[i];

    let url = `https://www.gocomics.com/${comic}/${date}`

    console.log("TCL: url", url);

    axios.get(url).then(function (res) {
        let $ = cheerio.load(res.data);


        $("a.js-item-comic-link").each(function (i, element) {
            let title = $(element).attr("title");

            let img = $(element).children().children().attr("src");

            results.push({
                title: title,
                img: img
            });
        })

        setTimeout(() => {
            console.log(results);
            
        }, 500);

        
    });
}
