const express = require("express");
const exphbs = require("express-handlebars");
const PORT = process.env.PORT || 8000;
const app = express();
const mongoose = require("mongoose");


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// if(window.localStorage){
//   console.log("use it");
// } else {
//   console.log("local don't exist");
// }

const routes = require("./controllers/comicControllers.js");

app.use(routes);


// mongoose.connect("mongodb://localhost/scrapeThis", { useNewUrlParser: true });
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapeThis";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.listen(PORT, function () {
  console.log("App running at localhost:" + PORT)
})
