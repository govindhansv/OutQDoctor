const { ObjectId } = require('mongodb');
const db = require('../connection');
const fun = require('../functions')


const getAllCheckouts = async function(req, res) {
    let user = req.session.user.user;
    let data = await db.get().collection('carts').find({ user: user._id }).toArray()

    let orderid;
    let total = 0;
    data.forEach(element => {
        total += Number(element.product.price);
    });
    //create order and pass orderId to function
    fun.createOrder(data, total, user._id).then((res) => {
        orderid = res.toString()
        fun.generateRazorpay(orderid, total).then((orderid) => {

            console.log(orderid);
        })
    })
    res.render('checkouts', { amount: total, orderid, user: user });
}

const getCheckoutAddform = async function(req, res) {
    res.render('forms/addcheckout');
}

const addCheckout = async function(req, res) {
    let data = req.body
    await db.get().collection('data').insertOne(data)
    res.render('pages/checkout', { data })
}

const getCheckoutEditform = async function(req, res) {
    let id = req.params.id
    let data = await db.get().collection('data').findOne({ _id: ObjectId(id) })
    res.render('forms/editcheckout', { data });
}

const editCheckout = async function(req, res) {
    let newdata = req.body
    let query = { _id: ObjectId(req.body.id) }
    var newvalues = { $set: { name: newdata.name, desc: newdata.desc } };
    await db.get().collection('data').updateOne(query, newvalues)
    res.redirect(`/checkout/${req.body.id}`)
}

const deleteCheckout = async function(req, res) {
    let id = req.params.id
    await db.get().collection('data').deleteOne({ _id: ObjectId(id) })
    res.redirect('back')
}

const getCheckoutById = async function(req, res) {
    let id = req.params.id
    let data = await db.get().collection('data').findOne({ _id: ObjectId(id) })
    res.render('pages/checkout', { data });
}

exports.getAllCheckouts = getAllCheckouts;
exports.getCheckoutAddform = getCheckoutAddform;
exports.addCheckout = addCheckout;
exports.getCheckoutEditform = getCheckoutEditform;
exports.editCheckout = editCheckout;
exports.deleteCheckout = deleteCheckout;
exports.getCheckoutById = getCheckoutById;