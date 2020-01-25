require('dotenv').config();
const mongodb = require('mongodb').MongoClient;
const conString = process.env.CONSTRING;
const express = require('express');
const coockieParser = require("cookie-parser");
const isLogedIn = require('./Routs/modules/auth').isLogedIn;

const port = 80;

(async () => {

    //start and connect to mongodb
    const con = await mongodb.connect(conString, {useNewUrlParser: true, useUnifiedTopology: true});
    //create a new db in mongodb atlas
    const db = await con.db("menu")
    //connect to the collections
    const foodCol = await db.collection("food");
    const weekCol = await db.collection("week");
    const userCol = await db.collection("user");
    

    let app = express();

    app.set('view engine', 'pug');
    app.use(express.urlencoded({extended: false}));
    app.use(express.static(__dirname + '/public'));
    app.use(coockieParser());
    app.use(isLogedIn);
    app.use((req, res, next) => {
        req.dbFood = foodCol;
        req.dbUser = userCol;
        next();
    })

    app.listen(port, (err) => {
        if(err) console.log(err)
        else console.log(`Server started and listening on port: ${port}`);
    })

    app.dbFood = foodCol;
    app.dbWeek = weekCol;
    app.dbUser = userCol;

    require('./Routs/FoodRoute')(app);
    require('./Routs/MenyRoute')(app);
    require('./Routs/LoginRoute')(app);

})();

