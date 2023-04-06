var express = require('express');
var router = express.Router();
const db = require('../connection');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let user = null;
    if (req.session) {
        user = req.session.user
    }
    if (user) {
        res.render('index',{user: user });
    } else {
        res.redirect('auths/admin/');
    }
});

router.get('/clean', async function(req, res) {
    await db.get().collection('orders').remove()

    res.redirect('back');
});

module.exports = router;