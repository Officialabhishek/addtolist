const express = require("express");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

mongoose.connect('mongodb+srv://admin-abhishek:Test-0110@cluster0.0ioim2r.mongodb.net/todoListDB');

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

    await itemData.save();

    res.redirect("/");
});

app.post("/delete", async (req, res) => {

    const checkedItem = req.body.delete;

    await Mymodel.findByIdAndRemove(checkedItem);

    console.log("successfully deleted the item");

    res.redirect("/");

});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("server is listening to port 5000.");
});