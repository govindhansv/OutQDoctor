 const { ObjectId } = require('mongodb');
 const db = require('../connection');

 const generateRazorpay = async function(req, res) {
     let data = await db.get().collection('payments').find().toArray()
     res.render('pages/allpayments', { data });
 }

 //  exports.getAllPayments = getAllPayments;