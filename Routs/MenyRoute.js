module.exports = (app) => {

    app.get('/week/meny', async (req, res) => {
        res.render('Meny');
    });

    app.get('/week/create', async (req, res) => {
        res.render('addMeny');
    });

}