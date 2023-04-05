const { ObjectId } = require('mongodb');
const db = require('../connection');

const getAllFavourites = async function(req, res) {
    let user = req.session.user.user;
    let data = await db.get().collection('favourites').find({ user: user._id }).toArray()
    res.render('pages/allfavourites', { data, user: req.session.user });
}

const addFavourite = async function(req, res) {
    let id = req.params.id
    let user = req.session.user.user;
    let product = await db.get().collection('products').findOne({ _id: ObjectId(id) })
    let fav = { product: product, user: user._id };
    await db.get().collection('favourites').insertOne(fav)
    res.json({ status: true })
        // res.redirect('back')
}

const deleteFavourite = async function(req, res) {
    let id = req.params.id
    let user = req.session.user.user;
    await db.get().collection('favourites').deleteOne({ _id: ObjectId(id), user: user._id })
    res.redirect('back')
}

const getFavouriteById = async function(req, res) {
    let id = req.params.id
    let data = await db.get().collection('favourites').findOne({ _id: ObjectId(id) })
    res.render('pages/favourite', { data, user: req.session.user });
}

exports.getAllFavourites = getAllFavourites;
exports.addFavourite = addFavourite;
exports.deleteFavourite = deleteFavourite;
exports.getFavouriteById = getFavouriteById;