const { ObjectId } = require('mongodb');
const db = require('../connection');

const getAllCarts = async function(req, res) {
    let user = req.session.user.user;
    let data = await db.get().collection('carts').find({ user: user._id }).toArray()
    console.log(data);
    let empty;
    let total;
    let total1;
    if (data.length == 0) {
        empty = true;
    } else {
        total1 = 0;
        total1 + data[0].product.price;
        console.log(total1);

        total = 0;
        data.forEach(element => {
            // console.log(Number element.product.price);
            total += Number(element.product.price);
        });
    }


    res.render('pages/allcarts', { data, total, empty, user: req.session.user });
}

const addToCart = async function(req, res) {
    let id = req.params.id
    let user = req.session.user.user._id;
    let product = await db.get().collection('products').findOne({ _id: ObjectId(id) })
    let cart = { product: product, user: user };
    await db.get().collection('carts').insertOne(cart)
    res.json({ status: true })
        // res.redirect('back')
}

const deleteCart = async function(req, res) {
    let user = req.session.user.user;
    let id = req.params.id
    await db.get().collection('carts').deleteOne({ _id: ObjectId(id), user: user._id })
    res.redirect('back')
}

const getCartById = async function(req, res) {
    let id = req.params.id
    let data = await db.get().collection('products').findOne({ _id: ObjectId(id) })
    res.render('pages/product', { data, user: req.session.user });
}


exports.getAllCarts = getAllCarts;
exports.deleteCart = deleteCart;
exports.getCartById = getCartById;
exports.addToCart = addToCart;