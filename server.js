const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const gamesData = require("./games");

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(express.static("games"));

app.get("/", (req, res) => {
    console.log("gamesData", gamesData);
    res.render("home", {
        games: gamesData,
    });
});

app.listen(process.env.PORT || 8080, console.log("let's play some games 🎇"));
