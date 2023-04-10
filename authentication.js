module.exports = {

    requiredlogin: (req, res, next) => {
        if (req.session.user) {
            req.session.userstatus = true
            next()
        } else {
            req.session.userstatus = false
            // res.json({ status: false })
            res.redirect('/auths/signin/')
        }
    },

    requiredadmin: (req, res, next) => {
        if (req.session.admin) {
            next()
        } else {
            res.redirect('/auths/admin/signin/')
        }
    }
}