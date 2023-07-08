const express = require("express");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

mongoose.connect('mongodb+srv://admin-abhishek:Test-0110@cluster0.0ioim2r.mongodb.net/todoListDB');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

const mySchema = new mongoose.Schema({
    item: String
});

const mySchema2 = new mongoose.Schema({
    email: String,
    password: String
});

const Mymodel = mongoose.model('Item', mySchema);

const Mymodel2 = mongoose.model('user', mySchema2);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/list", async (req, res) => {

    var date = new Date();
    var day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var currday = day[date.getDay()];
    var mm = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var currmm = mm[date.getMonth()];
    var dd = date.getDate();

    if (dd < 10) {
        dd = '0' + dd;
    }

    var currDate = currday + ", " + currmm + " " + dd;

    let foundItem = await Mymodel.find({});
    res.render('list', {
        date: currDate,
        newItem: foundItem
    });
});

app.get("/signin", (req, res) => {
    res.render("signin");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
        let newUser = new Mymodel2({
            email: req.body.email,
            password: hash
        });
    
        await newUser.save();
    
        res.redirect("/list");

    });
    
});

app.post("/signin", async (req, res) => {
    const checkEmail = req.body.email;
    const checkPassword = req.body.password;

    try {
        const foundNewUser = await Mymodel2.findOne({email: checkEmail});
    
        bcrypt.compare(checkPassword, foundNewUser.password, function(err, result) {
            if(result === true) {
                res.redirect("/list");
            } 
        });

    } catch (error) {
        console.log("error is :" + error);
    }  
});

app.post("/list", async (req, res) => {

    let itemData = new Mymodel({
        item: req.body.item
    });

    await itemData.save();

    res.redirect("/list");
});

app.post("/delete", async (req, res) => {

    const checkedItem = req.body.delete;

    await Mymodel.findByIdAndRemove(checkedItem);

    console.log("successfully deleted the item");

    res.redirect("/list");

});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("server is listening to port 5000.");
});