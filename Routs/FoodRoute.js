const ObjectID = require('mongodb').ObjectID;
const auth = require('./modules/auth').auth;
const isLogedIn = require('./modules/auth').isLogedIn;

module.exports = (app) => {

    app.get('/', async (req, res) => {

        const mat = await app.dbFood.find().toArray();
        res.render('index', {items: mat, logedIn: req.token.username});

    });

    app.get('/get/:id', async (req, res) => {

        let obj = await app.dbFood.findOne({"_id": ObjectID(req.params.id)});
        res.render('FoodInfo', {...obj, logedIn: req.token.username});

    });

    app.get('/create/food', auth, (req, res) => {

        res.render('addFood', {logedIn: req.token.username});
    
    });

    app.post('/create/food', auth, async (req, res) => {

        req.body.image = "https://source.unsplash.com/298x223/?food&sig=" + parseInt(Math.random()*100000000);
        req.body.user = req.token;
        let d = new Date();
        req.body.time = d.toUTCString();
        var test = e => e != ''
        
        if(Array.isArray(req.body.howto)) req.body.howto = req.body.howto.filter(test);
        if(Array.isArray(req.body.tag)) req.body.tag = req.body.tag.filter(test);
        if(Array.isArray(req.body.ingridient)) req.body.ingridient = req.body.ingridient.filter(test);
        
        await app.dbFood.insertOne(req.body);

        res.redirect('/');

    });

    app.get('/delete/food/:id', async (req, res) => {

        await app.dbFood.remove({"_id": ObjectID(req.params.id)});
        res.redirect('/profile');
    
    });

    app.get('/rewrite/food/:id', async (req, res) => {

        let data = await app.dbFood.findOne({"_id": ObjectID(req.params.id)});
        console.log(data);
        res.render('rewriteFood', {...data, logedIn: req.token.username});

    });

    app.post('/rewrite/food/:id', async (req, res) => {

        await app.dbFood.updateOne({"_id": ObjectID(req.params.id)}, {$set: req.body});
        res.redirect('/');

    });

    app.get('/saved/food', (req, res) => {

        res.render('index', {logedIn: req.token.username});

    });

}

