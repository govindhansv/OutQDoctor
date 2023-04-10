const { ObjectId } = require('mongodb');
const db = require('../../connection');

const getAllProducts = async function (req, res) {
    let data = await db.get().collection('bookings').find({"doctorid":req.session.user.user._id}).toArray()
    // console.log(data);
    res.render('appointments/pages/allappointments',{data});
}

const getBookingPage = async function (req, res) {
    res.render('appointments/pages/bookappointment', {error:true,  user: req.session.user });
}

const postBooking = async function (req, res) {
    let data = req.body;
    console.log(data);
    await db.get().collection('bookings').insertOne(data)
    res.render('checkouts', { error:true,data:data })
}

const getProductAddform = async function (req, res) {
    res.render('doctors/forms/add-doctor');
}

const addProduct = async function (req, res) {
    let data = req.body
    console.log(data);
    await db.get().collection('doctors').insertOne(data)
    res.render('pages/product', { data:data })
}

const getProductEditform = async function (req, res) {
    let id = req.params.id
    let data = await db.get().collection('doctors').findOne({ _id: ObjectId(id) })
    // console.log(data);
    res.render('doctors/forms/editdoctor', { data });
}

const editProduct = async function (req, res) {
    console.log(req.body);
    let newdata = req.body
    let query = { _id: ObjectId(req.body.id) }
    var newvalues = { $set: newdata };
    await db.get().collection('doctors').updateOne(query, newvalues).then((data, err) => {
        console.log("data", data);
        console.log("err", err);
    })
    res.redirect(`/doctors/${req.body.id}`)
}

const deleteProduct = async function (req, res) {
    let id = req.params.id
    await db.get().collection('doctors').deleteOne({ _id: ObjectId(id) })
    res.redirect('/doctors/')
}

const getProductById = async function (req, res) {
    let id = req.params.id
    let data = await db.get().collection('doctors').findOne({ _id: ObjectId(id) })
    res.render('pages/product', { data });
}


const booking = async (req, res) => {
    // storing req.body
    let {
        start,
        doctorid,
        userid,
        date,
    } = req.body;

    let doctor = await db.get().collection('doctors').findOne({ _id: req.body.doctorid });

    let obj = {
        start,
        doctorid,
        userid,
        date,
        doctor:doctor.name
    };
    // let user = await db.get().collection('users').findOne({ _id: userid }).toArray()
    await db.get().collection('bookings').insertOne(obj)
}

exports.booking = booking;
exports.getAllProducts = getAllProducts;
exports.postBooking = postBooking;
exports.getBookingPage = getBookingPage;
exports.getProductAddform = getProductAddform;
exports.addProduct = addProduct;
exports.getProductEditform = getProductEditform;
exports.editProduct = editProduct;
exports.deleteProduct = deleteProduct;
exports.getProductById = getProductById;