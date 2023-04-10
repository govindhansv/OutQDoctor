var express = require('express');
var router = express.Router();
const db = require('../../connection');
const {
    requiredlogin
} = require("../../authentication");

/* GET home page. */
router.get('/', requiredlogin, async function (req, res, next) {
    res.redirect('/doctors/alldoctors/');
});

router.get('/token/generate', async function (req, res, next) {
    let token = req.cookies.token || {};
    let timeslots1 = await db.get().collection('timeslots').find({}).toArray()

    let timeslots = timeslots1[0].times;
    timeslots.some((e, index) => {
            if (e.status == "n") {
                token = { "token": index + 1 }
                return true;
            } 
    });
    
    res.cookie('token', token, { maxAge: 31536000000  }); // set cookie with 1 year expiry
    // let data = await db.get().collection('bookings').find({ "userid": req.session.user.user._id }).toArray()
    // console.log(data);
    res.redirect('/users/token/view-token');
});
router.get('/token/view-token', async function (req, res, next) {
    const token = req.cookies.token || {"test":123};
    res.send(token);
});

router.get('/bookings', requiredlogin, async function (req, res, next) {
    let data = await db.get().collection('bookings').find({ "userid": req.session.user.user._id }).toArray()
    console.log(data);
    res.render('appointments/pages/userappointments', { data: data, error: true });
});



module.exports = router;