var express = require('express');
var router = express.Router();
const db = require('../connection');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let user = null;
    if (req.session) {
        user = req.session.user
    }
    let data = await db.get().collection('products').find().toArray()

    res.render('index', { data, user: user });
});

router.get('/clean', async function(req, res) {
    await db.get().collection('orders').remove()

    res.redirect('back');
});

module.exports = router;