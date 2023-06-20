const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/todoListDB');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

const mySchema = new mongoose.Schema({
    item: String
})

const Mymodel = mongoose.model('Item', mySchema);


app.get("/", async (req, res) => {

    var date = new Date();
    var day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var currday = day[date.getDay()];
    var mm = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var currmm = mm[date.getMonth()];
    var dd = date.getDate();

    if (dd < 10) {
        dd = '0' + dd;
    }

    var currDate = currday + ", " + currmm + " " + dd; //current Date

     let foundItem = await Mymodel.find({});
            res.render('list', {
                date: currDate,
                newItem: foundItem
            });


});


app.post("/", async (req, res) => {
    let itemData = new Mymodel({
        item: req.body.item
    });
    console.log(itemData);

    await itemData.save();
    res.redirect("/");
});

app.listen(5000, () => {
    console.log("server is listening to port 5000.");
});

