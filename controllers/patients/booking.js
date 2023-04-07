// const { ObjectId } = require('mongodb');
const db = require('../../connection');
/* Create new booking order */

const booking = async (req, res) => {
    // storing req.body
    let {
        start,
        doctorid,
        userid,
        date,
    } = req.body;
    let doctor = await db.get().collection('doctors').findOne({ _id: req.body.doctorid }).toArray()
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
/* View User Booking */

// export const viewall = async (req, res) => {
//     // //console.log('called');
//     try {
//         const { userid } = req.params;
//         const bookings = await Booking.find({ "userid": userid }).select('-createdAt').select('-__v').select('-updatedAt');
//         bookings.forEach(element => {
//             // // //console.log(element);
//             element.bookingid = element._id;
//             // element.username = element._id;
//         });
//         // //console.log(" nbooking ");
//         // //console.log(bookings);
//         res.status(201).json(bookings);
//     } catch (err) {
//         // //console.log("err", err);
//         res.status(500).json({ error: err.message });
//     }
// };


// export const viewsingle = async (req, res) => {
//     // //console.log('called');
//     try {
//         const { id } = req.params;
//         const booking = await Booking.find({ id }).select('-createdAt').select('-__v').select('-updatedAt');
//         res.status(201).json(booking);
//     } catch (err) {
//         // //console.log("err", err);
//         res.status(500).json({ error: err.message });
//     }
// };
