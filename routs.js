const FoodRoute = require('./Routs/FoodRoute');
const MenyRoute = require('./Routs/MenyRoute');

module.exports = (app) => {

    FoodRoute(app);
    MenyRoute(app);

}
