const jwt = require("jsonwebtoken");

module.exports = {
    auth: (req, res, next) => {

            if(req.cookies.token) {
                try {

                    let token = jwt.verify(req.cookies.token, process.env.SECRET)
                    delete token.iat;
                    delete token.exp;
                    req.token = token;

                    if(token)
                        next()
                    else
                        res.redirect('/')

                }
                catch(err) {
                    res.redirect('/login')
                }
            }
            else
                res.redirect('/')

        },
    isLogedIn: (req, res, next) => {
        if(req.cookies.token) {
            try {
                let token = jwt.verify(req.cookies.token, process.env.SECRET);
                delete token.iat;
                delete token.exp;
                req.token = token;

                next();
            }
            catch(err) {
                req.token = {username: "no-token"};
                next();
            }
        }
        else {
            req.token = {username: "no-token"};
            next();
        }
    }
}