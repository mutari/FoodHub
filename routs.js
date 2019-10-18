const objectID = require('mongodb').ObjectID;

module.exports = (app) => {

    app.get('/', async (req, res) => {

        const mat = await app.dbFood.find().toArray();
        console.log(mat);

        res.render('index', {items: mat});

    });

    app.get('/create/food', (req, res) => {
        res.render('addFood');
    });

    app.post('/create/food', async (req, res) => {
        await app.dbFood.insertOne(req.body);
        res.redirect('/');
    });

}

