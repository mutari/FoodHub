const FoodRoute = require('./Routs/FoodRoute');
const MenyRoute = require('./Routs/MenyRoute');
const LoginRoute = require('./Routs/LoginRoute');

module.exports = (app) => {

    FoodRoute(app);
    MenyRoute(app);
    LoginRoute(app);

}
