const bcrypt = require('bcryptjs');
const joi = require('@hapi/joi');
const login = require("./modules/login");
const auth = require("./modules/auth").auth;
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
        res.render("createAcc", {logedIn: req.token.username});
    });

    //skapa ett konto
    app.post('/createacc', async (req, res) => {

        //Om jag vill kan jag testa att validera en email i genom att skicka ett email med en kod som man måste skriva in

        try {
            //måste validera alla inputs inan jag tillåter en att skapa ett konto
            await schema.validateAsync({email: req.body.email, password: req.body.password})
            bcrypt.hash(req.body.password, 12, async (err, hash) => {
                delete req.body.password;
                delete req.body.password_rep;
                req.body.hash = hash;
                req.body.save = [];
                await app.dbUser.insertOne(req.body);
            });
            res.redirect('/');
        }
        catch(err) {
            console.log("bad password or username :::: " + err);
        }

    });

    //loggar ut kontot
    app.get('/logout', (req, res) => {
        res.cookie("token", "loged out", {httpOnly: true, sameSite:"Strict"});
        res.redirect('/')
    })


    //routes för inlogade
    app.get('/profile', auth, async (req, res) => {
        //måste hämta alla respt skrivna av den inlågade profilen
        const food = await app.dbFood.find({"user.username": req.token.username}).toArray();
        const user = await app.dbUser.findOne({"email": req.token.email});
        //hämtar alla rätter sparade av användaren
        
        let save = user.save.map(async e => {
            return await app.dbFood.findOne({"_id": ObjectID(e)});
        })
        //console.log(await app.dbFood.findOne({"_id": ObjectID(user.save[0])}))

        save = await Promise.all(save);

        //ska man spara allt i databasen eller sparra all användare infomtation i jwt token
        user.foods = food;
        user.save = save;

        console.log(user);
        res.render('profile', {...user, logedIn: req.token.username});
    }); 

    //för andra att gå in och kolla på en annans profil
    app.get('/profile/:id', async (req, res) => {
        
        var user = await app.dbUser.findOne({"_id": ObjectID(req.params.id)});
        var foods = await app.dbFood.find({"user.id": req.params.id}).toArray();
        delete user.hash;

        let save = user.save.map(async e => {
            return await app.dbFood.findOne({"_id": ObjectID(e)});
        })
        //console.log(await app.dbFood.findOne({"_id": ObjectID(user.save[0])}))

        save = await Promise.all(save);

        user.foods = foods;
        user.save = save;

        res.render('viewProfile', {...user, logedIn: req.token.username});

    });

    //spara en maträtt
    app.get('/save/:id', auth, async (req, res) => {

        let user = await app.dbUser.findOne({"email": req.token.email});
        if(!user.save.find((e) => e == req.params.id)) {
            user.save.push(req.params.id);
            await app.dbUser.updateOne({"email": req.token.email}, {$set: user});
            res.redirect('/');
        }
        else 
            console.log("du har redan sparat dena maträtten");

    });

    app.get('/rewrite/profile', auth, async (req, res) => {

        const data = await app.dbUser.findOne({"_id": ObjectID(req.token.id)});
        res.render('rewriteProfile', data);
    
    });

    app.post('/rewrite/profile', auth, async (req, res) => {

        await app.dbUser.updateOne({"_id": ObjectID(req.token.id)}, {"$set": req.body});
        res.redirect('/profile');

    });



    async function addData(req, res, next) {
        req.dbData = await app.dbUser.findOne({"email": req.body.email});

        next();
    }


    

}