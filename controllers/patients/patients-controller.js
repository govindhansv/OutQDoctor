const { ObjectId } = require('mongodb');
const db = require('../../connection');

const getAllProducts = async function(req, res) {
    let data = await db.get().collection('patients').find().toArray()
    console.log(data);
    res.render('patients/pages/allpatients', { data, user: req.session.user });
}

const getProductAddform = async function(req, res) {
    res.render('patients/forms/add-patient');
}

const addProduct = async function(req, res) {
    let data = req.body
    console.log(data);
    await db.get().collection('patients').insertOne(data)
    res.render('pages/product', { data })
}

const getProductEditform = async function(req, res) {
    let id = req.params.id
    let data = await db.get().collection('patients').findOne({ _id: ObjectId(id) })
    console.log(data);
    res.render('forms/editproduct', { data });
}

const editProduct = async function(req, res) {
    console.log(req.body);
    let newdata = req.body
    let query = { _id: ObjectId(req.body.id) }
    var newvalues = { $set: newdata };
    await db.get().collection('patients').updateOne(query, newvalues)
    res.redirect(`/patients/${req.body.id}`)
}

const deleteProduct = async function(req, res) {
    let id = req.params.id
    await db.get().collection('patients').deleteOne({ _id: ObjectId(id) })
    res.redirect('/auths/admin/dashboard')
}

const getProductById = async function(req, res) {
    let id = req.params.id
    let data = await db.get().collection('patients').findOne({ _id: ObjectId(id) })
    res.render('pages/product', { data });
}


exports.getAllProducts = getAllProducts;
exports.getProductAddform = getProductAddform;
exports.addProduct = addProduct;
exports.getProductEditform = getProductEditform;
exports.editProduct = editProduct;
exports.deleteProduct = deleteProduct;
exports.getProductById = getProductById;