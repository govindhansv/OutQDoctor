const express = require("express");
const router = express.Router();
const authsController = require("../controllers/auths-controller");
const adminControllers = require("../controllers/admins-controller");
const {
    requiredadmin
} = require("../authentication");

const hide = (req, res, next) => {
    if (req.session.admin) {
        res.redirect('/auths/admin/dashboard/')
    } else {
        next()
    }
}


// user
router.get('/signup', authsController.getSignup);
router.post("/signup", authsController.postSignup);
router.get('/signin', authsController.getSignin);
router.post("/signin", authsController.postSignin);
router.get("/logout", authsController.logOut);

// admin 
router.get('/admin/dashboard/', requiredadmin, adminControllers.getDashboard);
router.get('/admin/', hide, adminControllers.getSignup);
router.post("/admin/signup", adminControllers.postSignup);
router.get('/admin/signin', hide, adminControllers.getSignin);
router.post("/admin/signin", adminControllers.postSignin);
router.get("/admin/logout", adminControllers.logOut);

module.exports = router;