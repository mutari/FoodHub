module.exports = (app) => {

    const auth = require('./modules/auth').auth;
    const food = require('./modules/food');

    app.get('/', food.index);
    app.get('/get/:id', food.getFoodById);

    app.get('/create/food', auth, food.renderCreateFood);
    app.post('/create/food', auth, food.createFood);
    
    app.get('/delete/food/:id', food.deleteFood);

    app.get('/rewrite/food/:id', food.renderRewriteFood);
    app.post('/rewrite/food/:id', food.rewriteFood);

}

