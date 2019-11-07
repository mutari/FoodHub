const ObjectID = require('mongodb').ObjectID;

module.exports = (app) => {

    app.get('/', async (req, res) => {

        const mat = await app.dbFood.find().toArray();

        res.render('index', {items: mat});

    });

    app.get('/:id', async (req, res) => {
        let obj = await app.dbFood.findOne({"_id": ObjectID(req.params.id)});
        res.render('FoodInfo', obj);
    });

    app.get('/create/food', (req, res) => {
        res.render('addFood');
    });

    app.post('/create/food', async (req, res) => {
        req.body.image = "https://source.unsplash.com/298x223/?food";
        await app.dbFood.insertOne(req.body);
        res.redirect('/');
    });

    app.get('/delete/food/:id', async (req, res) => {
        await app.dbFood.remove({"_id": ObjectID(req.params.id)});
        res.redirect('/');
    });

    app.get('/rewrite/food/:id', async (req, res) => {
        let data = await app.dbFood.findOne({"_id": ObjectID(req.params.id)});
        console.log(data);
        res.render('rewriteFood', data);
    });

    app.post('/rewrite/food/:id', async (req, res) => {

        await app.dbFood.updateOne({"_id": ObjectID(req.params.id)}, {$set: req.body});
        res.redirect('/');

    });

    app.get('/saved/food', (req, res) => {
        res.render('index')
    });

}

