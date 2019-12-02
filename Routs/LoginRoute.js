const bcrypt = require('bcryptjs');
const joi = require('@hapi/joi');
const login = require("./modules/login");
const auth = require("./modules/auth");
const jwt = require("jsonwebtoken");
const ObjectID = require("mongodb").ObjectID;

//För att testa olika test cases 
const schema = joi.object().keys({
    username: joi.string().alphanum().min(3).max(30),
    password: joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
    password_rep: joi.ref('password'),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "se"]}}).required()
}).with("email", "password");

module.exports = (app) => {

    app.get('/login', (req, res) => {
        res.render("login")
    });

    app.post('/login', addData, login, (req, res) => {

        let token  = req.token;
        res.cookie("token",token,{httpOnly:true,sameSite:"Strict"});
        res.redirect("/profile")

    });



    //create a new acount
    app.get('/createacc', (req, res) => {
        res.render("createAcc")
    });

    app.post('/createacc', async (req, res) => {

        //Om jag vill kan jag testa att validera en email

        try {
            //måste validera alla inputs inan jag tillåter en att skapa ett konto
            await schema.validateAsync({email: req.body.email, password: req.body.password})
            bcrypt.hash(req.body.password, 12, async (err, hash) => {
                delete req.body.password;
                delete req.body.password_rep;
                req.body.hash = hash;
                await app.dbUser.insertOne(req.body);
            });
            res.redirect('/');
        }
        catch(err) {
            console.log("bad password or username :::: " + err);
        }

    });


    //routes för inlogade
    app.get('/profile', auth, async (req, res) => {
        //måste hämta alla respt skrivna av den inlågade profilen
        const food = await app.dbFood.find({"user.username": req.token.username}).toArray();

        //ska man spara allt i databasen eller sparra all användare infomtation i jwt token
        console.log(food);
        req.token.foods = food;

        res.render('profile', req.token);
    }); 

    app.get('/profile/:id', async (req, res) => {
        
        var user = await app.dbUser.findOne({"_id": ObjectID(req.params.id)});
        var foods = await app.dbFood.find({"user.id": req.params.id}).toArray();
        delete user.hash;
        user.foods = foods;

        res.send(user);

    });









    async function addData(req, res, next) {
        req.dbData = await app.dbUser.findOne({"email": req.body.email});

        next();
    }


}
