const fun = require('../functions');
const db = require('../connection');

const getDashboard = async function(req, res) {

    let admin = req.session.user
    let data = await db.get().collection('products').find().toArray()

    res.render('pages/admin/dashboard', { data, user: admin, admlg: true })

}

const getSignup = async function(req, res) {
    if (req.session.loggedIN == false) {
        res.render('forms/admin/signup', { err: true, admin: true })
    } else if (req.session.admin) {
        res.redirect('/auths/admin/dashboard/')
    } else
        res.render('forms/admin/signup', { admin: true })
}

const postSignup = async function(req, res) {
    console.log(req.body);
    req.body.admin = true;
    fun.doSignup(req.body).then((response) => {
        console.log('post');
        if (response.signupstatus) {
            response.loggedIN = true
            req.session.user = response
            req.session.admin = true
            console.log(response);
            res.redirect('/auths/admin/')
        } else {
            req.session.loggedIN = false;
            res.redirect('/auths/admin/signup')
        }
    })
}

const getSignin = async function(req, res) {
    console.log(req.session);
    if (req.session.loggedIN) {
        res.redirect('/admin/')
    } else if (req.session.loggedIN == false) {

        res.render('forms/admin/signin', { err: true, admin: true });
    } else {
        res.render('forms/admin/signin', { admin: true });

    }

}

const postSignin = async function(req, res) {
    fun.doLogin(req.body).then((response) => {
        if (response.loginstatus) {
            response.loggedIN = true
            req.session.user = response
            req.session.admin = true
            res.redirect('/auths/admin/')
        } else {
            req.session.loggedIN = false;
            res.redirect('/auths/admin/signin/')
        }
    })
}

const logOut = async function(req, res) {
    req.session.destroy();
    res.redirect('/')
}


exports.getDashboard = getDashboard;
exports.getSignup = getSignup;
exports.postSignup = postSignup;
exports.getSignin = getSignin;
exports.postSignin = postSignin;
exports.logOut = logOut;