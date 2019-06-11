const express = require("express");
const exphbs = require("express-handlebars");
const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const routes = require("./controllers/comicControllers.js");

app.use(routes);

app.listen(PORT, function (){
    console.log(`App now listing on localhost:${PORT}`);
})