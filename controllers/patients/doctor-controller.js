const { ObjectId } = require('mongodb');
const db = require('../../connection');

const getAllProducts = async function (req, res) {
    let data = await db.get().collection('users').find().toArray()
    // console.log(data);
    res.json(data);
    // res.render('doctors/pages/alldoctors', { data, user: req.session.user });
}
const getAllDoctors = async function (req, res) {
    let data = await db.get().collection('doctors').find({}).toArray()
    console.log(data);
    res.render('alldoctors/alldoctors', { data: data, error: true });
}

const getBookDoctor = async function (req, res) {
    try {

        const { doctorid, date } = req.params;
        let data = await db.get().collection('doctors').findOne({ _id: ObjectId(doctorid) })

        console.log(doctorid);
        console.log(date);
        // find time slots 
        let timeslots = await db.get().collection('timeslots').find({ doctorid: doctorid, date: date }).toArray()
        // //console.log(" before",timeslots);

        if (timeslots.length == 0) {
            console.log("if");
            let times = await firstbooking(doctorid, date);
            console.log('timeslots', times);
            let timeslots = await db.get().collection('timeslots').find({ _id: times.insertedId }).toArray()
            console.log('timeslots', timeslots);
            res.render('alldoctors/bookdoctor', { data, error: true, times: timeslots });
        } else {
            console.log("else");
            console.log(timeslots[0].times);
            res.render('alldoctors/bookdoctor', { data, error: true, times: timeslots[0].times,date:date });
        }

    } catch (error) {
        console.log(error);
    }

}

const getProductAddform = async function (req, res) {
    res.render('doctors/forms/add-doctor');
}

const addProduct = async function (req, res) {
    let data = req.body
    console.log(data);
    await db.get().collection('doctors').insertOne(data)
    res.render('pages/product', { data })
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

async function firstbooking(storeid, date) {
    try {
        //console.log(' storeid ', storeid);
        let store = await db.get().collection('doctors').findOne({ _id: ObjectId(storeid) });

        // console.log(' store ', store);

        let time = convertToTime(store.start);
        // console.log("time old", store.start);
        // console.log("time1",time);

        const startTime = new Date(`2023-02-25T${convertToTime(store.start)}`);
        const endTime = new Date(`2023-02-25T${convertToTime(store.end)}`);
        const diffHours = Math.floor((endTime.getTime() - startTime.getTime()) / 3600000);

        // console.log("start", startTime);
        // console.log("end", endTime);
        // console.log("diff", diffHours);

        let times = [];

        for (let hour = 0; hour < 12 * diffHours; hour = hour + 1) {

            let obj = {
                time: time,
                count: 0,
                status: "n"
            }
            time = addMinutesToTimeString(time, 5)
            times.push(obj);
            console.log(" obj", obj);
        }

        //console.log("times", times);

        const newTimeSlot = {
            date,
            doctorid: storeid,
            times
        };

        let savedTimeSlot = await db.get().collection('timeslots').insertOne(newTimeSlot);
        //console.log("savedtimes", savedTimeSlot);
        return savedTimeSlot;
    } catch (err) {
        console.log("err", err);
        res.status(500).json({ error: err.message });
    }

}

function convertToTime(timeString) {

    const convertTime12to24 = (time12h) => {
        //console.log('time12h', time12h);
        const [time, modifier] = time12h.split(' ');

        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }

        if (modifier === 'pm') {
            hours = parseInt(hours, 10) + 12;
        }

        return `${hours}:${minutes}`;
    }

    // //console.log(convertTime12to24(timeString));
    let time = convertTime12to24(timeString);

    return time;
}

function addMinutesToTimeString(timeString, minutesToAdd) {

    let startTime = new Date("2023-02-21 " + timeString);

    // add 60 minutes to the starting time
    let endTime = new Date(startTime.getTime() + minutesToAdd * 60000);

    // get the hours and minutes of the end time
    let endHours = endTime.getHours();
    let endMinutes = endTime.getMinutes();

    // format the end time as a string in 12-hour format
    let formattedEndTime = `${(endHours % 12 || 12)}:${endMinutes.toString().padStart(2, '0')} ${endHours < 12 || endHours === 24 ? 'AM' : 'PM'}`;

    // format the starting time as a string in 12-hour format
    let formattedStartTime = startTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return formattedEndTime;
}

exports.getAllDoctors = getAllDoctors;
exports.getAllProducts = getAllProducts;
exports.getBookDoctor = getBookDoctor;
exports.getProductAddform = getProductAddform;
exports.addProduct = addProduct;
exports.getProductEditform = getProductEditform;
exports.editProduct = editProduct;
exports.deleteProduct = deleteProduct;
exports.getProductById = getProductById;