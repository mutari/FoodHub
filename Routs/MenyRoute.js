module.exports = (app) => {

    app.get('/week/meny', async (req, res) => {
        res.render('Meny', {logedIn: req.token.username});
    });

    app.get('/week/create', async (req, res) => {
        res.render('addMeny', {logedIn: req.token.username});
    });

}