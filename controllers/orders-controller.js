const { ObjectId } = require('mongodb');
const db = require('../connection');

const getAllOrders = async function(req, res) {
    let data = await db.get().collection('orders').find().toArray()
    res.render('pages/admin/changeorders', { data, user: req.session.user, admlg: true });
}

const getUserOrders = async function(req, res) {
    let id = req.session.user.user._id
    let data = await db.get().collection('orders').find({ user: id }).toArray()
    console.log(data);
    res.render('pages/allorders', { data, user: req.session.user });
}

const getOrderStatusform = async function(req, res) {
    let id = req.params.id
    let data = await db.get().collection('orders').findOne({ _id: ObjectId(id) })
    console.log(data);
    res.render('forms/admin/changestatus', { data, user: req.session.user });
}

const ChangeOrderStatus = async function(req, res) {
    let data = req.body
    console.log(data);
    let newdata = req.body
    let query = { _id: ObjectId(req.body.id) }
    var newvalues = {
        $set: { status: newdata.status }
    };

    await db.get().collection('orders').updateOne(query, newvalues)
    res.redirect(`/orders/${req.body.id}`)

    //  await db.get().collection('orders').insertOne(data)
    //  res.render('pages/order', { data })
}

const trackOrder = async function(req, res) {
    let id = req.params.id
    let data = await db.get().collection('orders').findOne({ _id: ObjectId(id) })
    if (data.status == 'delivered') {
        res.render('forms/trackorder', { data, three: true, user: req.session.user });
    } else if (data.status == 'dispatched') {
        res.render('forms/trackorder', { data, two: true, user: req.session.user });
    } else if (data.status == 'confirmed') {
        res.render('forms/trackorder', { data, one: true, user: req.session.user });
    } else {
        res.render('forms/trackorder', { data, user: req.session.user });
    }
}

const editOrder = async function(req, res) {
    let newdata = req.body
    let query = { _id: ObjectId(req.body.id) }
    var newvalues = { $set: { name: newdata.name, } };
    await db.get().collection('orders').updateOne(query, newvalues)
    res.redirect(`/orders/${req.body.id}`)
}

const deleteOrder = async function(req, res) {
    let id = req.params.id
    await db.get().collection('orders').deleteOne({ _id: ObjectId(id) })
    res.redirect('back')
}

const getOrderById = async function(req, res) {
    let id = req.params.id
    let data = await db.get().collection('orders').findOne({ _id: ObjectId(id) })
    console.log(data);
    res.render('pages/order', { data, user: req.session.user });
}

exports.getAllOrders = getAllOrders;
exports.getUserOrders = getUserOrders;
exports.getOrderStatusform = getOrderStatusform;
exports.ChangeOrderStatus = ChangeOrderStatus;
exports.trackOrder = trackOrder;
exports.editOrder = editOrder;
exports.deleteOrder = deleteOrder;
exports.getOrderById = getOrderById;