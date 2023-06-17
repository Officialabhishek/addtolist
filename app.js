const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

var items = [];
var checkBox;

app.get("/", (req, res) => {

    var date = new Date();
    var day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var currday = day[date.getDay()];
    var mm = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var currmm = mm[date.getMonth()];
    var dd = date.getDate();

    if(dd < 10) {
        dd = '0' + dd;
    }

    var currDate = currday + ", " + currmm + " " + dd; //current Date

    res.render('list', {
        date: currDate,
        newItem: items
    });
});


app.post("/", (req, res) => {
 var addItem = req.body.item;
 checkbox = req.body.delete;
  
 if(addItem == "") {
     addItem = "Blank item";
 } else {
    if(checkBox) {
        items.pop(addItem);
    }
    items.push(addItem);
 }
   
    res.redirect("/");
});

app.listen(5000, () => {
    console.log("server is listening to port 5000.");
});

