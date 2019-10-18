require('dotenv').config();
const mongodb = require('mongodb').MongoClient;
const conString = process.env.CONSTRING;
const express = require('express');

const port = 80;

(async () => {

    //start and connerct to mongodb
    const con = await mongodb.connect(conString, {useNewUrlParser: true, useUnifiedTopology: true});
    //create a new db in mongodb atlas
    const db = await con.db("menu")
    //create a new collection
    const foodCol = await db.collection("food");
    const weekCol = await db.collection("week");

    /*
    //test pupulate
    await foodCol.deleteMany();

    await foodCol.insertOne({
        name: "Korv Stroganoff", 
        about: "Korv Stroganoff på falukorv är en klassiker i det svenska vardagsköket - smakar lika bra i matlådan dagen efter. Här är ett recept från Vår kokbok.", 
        source: "https://www.koket.se/sara_begner/soppor_och_grytor/korv_och_chark/korv_stroganoff/", 
        image: "https://source.unsplash.com/298x223/?food"
    });

    await foodCol.insertOne({
        name: "Lax i ugn med Philadelphiatäcke", 
        about: "Det här receptet är löjligt enkelt och gott! Duka upp en liten buffé med olika toppings så får var och en välja vad den vill ha.", 
        source: "https://www.koket.se/lax-i-ugn-med-philadelphiatacke", 
        image: "https://source.unsplash.com/298x223/?food"
    });

    console.log(await foodCol.find().toArray());
    */

    let app = express();

    app.set('view engine', 'pug');
    app.use(express.urlencoded({extended: false}));
    app.use(express.static(__dirname + '/public'));
    app.listen(port, (err) => {
        if(err) console.log(err)
        else console.log(`Server started and listening on port: ${port}`);
    })

    app.dbFood = foodCol;
    app.dbWeek = weekCol;

    require('./routs.js')(app);

})();

