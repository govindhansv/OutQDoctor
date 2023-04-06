const { ObjectId } = require('mongodb');
const db = require('../../connection');

const getAllProducts = async function(req, res) {
    let data = await db.get().collection('prescriptions').find().toArray()
    // console.log(data);
    res.render('prescriptions/pages/allprescriptions', { data, user: req.session.user });
}

const getProductAddform = async function(req, res) {
    res.render('prescriptions/forms/add-prescription');
}

const addProduct = async function(req, res) {
    let data = req.body
    console.log(data);
    await db.get().collection('prescriptions').insertOne(data)
    res.redirect('/prescriptions/')
}

const getProductEditform = async function(req, res) {
    let id = req.params.id
    let data = await db.get().collection('prescriptions').findOne({ _id: ObjectId(id) })
    // console.log(data);
    res.render('prescriptions/forms/editprescription', { data });
}

const editProduct = async function(req, res) {
    console.log(req.body);
    let newdata = req.body
    let query = { _id: ObjectId(req.body.id) }
    var newvalues = { $set: newdata };
    await db.get().collection('prescriptions').updateOne(query, newvalues).then((data, err) => {
        console.log("data",data);
        console.log("err",err);
    })
    res.redirect(`/prescriptions/`)
}

const deleteProduct = async function(req, res) {
    let id = req.params.id
    await db.get().collection('prescriptions').deleteOne({ _id: ObjectId(id) })
    res.redirect('/prescriptions/')
}

const getProductById = async function(req, res) {
    let id = req.params.id
    let data = await db.get().collection('prescriptions').findOne({ _id: ObjectId(id) })
    res.render('pages/product', { data });
}


exports.getAllProducts = getAllProducts;
exports.getProductAddform = getProductAddform;
exports.addProduct = addProduct;
exports.getProductEditform = getProductEditform;
exports.editProduct = editProduct;
exports.deleteProduct = deleteProduct;
exports.getProductById = getProductById;