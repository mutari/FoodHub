const ObjectID = require('mongodb').ObjectID;

module.exports = {

    //index route
    index: async (req, res) => {
        try {
            const mat = await req.dbFood.find().toArray(); //hemtar alla maträtter i från databas
            const profile = await req.dbUser.findOne({"email": req.token.email}); //hämtar profil i från data bas
            //om ingen profil hittas kommer 'profile' objektet att vara null
            console.log(profile);
            res.render('index', {items: mat, logedIn: req.token.username, profile: profile});
        } catch (error) {console.log("somthing whent wrong: " + error)}
    }, 

    getFoodById: async (req, res) => {

        try {
            let obj = await req.dbFood.findOne({"_id": ObjectID(req.params.id)});
            res.render('FoodInfo', {...obj, logedIn: req.token.username});
        } catch(error) {console.log("somthing whent wrong: " + error)}
        

    },

    renderCreateFood: (req, res) => {

        res.render('addFood', {logedIn: req.token.username});
    
    },

    createFood: async (req, res) => {
        //sparar all info man behöver i body för att sedan skicka body objektet till servern
        req.body.image = "https://source.unsplash.com/298x223/?food&sig=" + parseInt(Math.random()*100000000);
        req.body.user = req.token;
        //get time and date
        let d = new Date(); 
        req.body.time = d.toUTCString();
        var test = e => e != '' || e != ' ' //funktion för att filterar ut inputs som är tomma
        if(Array.isArray(req.body.howto)) req.body.howto = req.body.howto.filter(test);
        if(Array.isArray(req.body.tag)) req.body.tag = req.body.tag.filter(test);
        if(Array.isArray(req.body.ingridient)) req.body.ingridient = req.body.ingridient.filter(test);
        //sparar allt i databasen
        await req.dbFood.insertOne(req.body);
        res.redirect('/');
    },

    deleteFood: async (req, res) => {
        await req.dbFood.remove({"_id": ObjectID(req.params.id)});
        res.redirect('/profile');
    },

    renderRewriteFood: async (req, res) => {
        let data = await req.dbFood.findOne({"_id": ObjectID(req.params.id)});
        res.render('rewriteFood', {...data, logedIn: req.token.username});
    },

    rewriteFood: async (req, res) => {

        await req.dbFood.updateOne({"_id": ObjectID(req.params.id)}, {$set: req.body});
        res.redirect('/');

    }

}