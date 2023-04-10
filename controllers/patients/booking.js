const db = require('../../connection');
const { ObjectId } = require('mongodb');


/* Create new booking order */

const booking = async (req, res) => {

    // storing req.body
    let {
        start,
        doctorid,
        date,
    } = req.body;

    let user = req.session.user.user;
    let userid = user._id;
    console.log(user);
    // FINDING COUNTS

    console.log(req.body);
    //console.log("storeid\n", storeid);
    let doctor = await db.get().collection('doctors').findOne({ _id: ObjectId(doctorid) })
    //console.log(service);

    // let store = await Store.findOne({ _id: storeid });
    if (doctor.working == "off") {
        //console.log('store is currently not working');
        res.status(201).json({ "success": false, "status": "store closed" });
    } else {

        //console.log("store \n\n\n", store);
        let endtime = addMinutesToTimeString(start, doctor.duration);
        let user = await db.get().collection('users').findOne({ _id: ObjectId(userid) })

        // let employeecount = parseInt(store.employees);

        //console.log("employee count", employeecount);
        //console.log(" endtime", end);

        //Checking count status 

        // let timeslots1 = await TimeSlot.find().select('times').select('date');
        let timeslots1 = await db.get().collection('timeslots').find({ doctorid: doctorid, date: date }).toArray()

        let timeslots = timeslots1[0].times;
        //console.log("firstdate", timeslots1);
        //console.log("firstdateid", timeslots1[0]._id);

        let pass = true;
        let array = [];

        function multipleblocking(start) {
            let nots = doctor.duration / 5
            nots = Math.ceil(nots);
            array.push(start);
            for (let index = 0; index < nots - 1; index++) {
                start = addMinutesToTimeString(start, 5);
                array.push(start);
            }

            console.log(nots);
            console.log(array);

            array.forEach(ele => {
                timeslots.forEach(e => {
                    if (e.time == ele) {
                        if (e.status == "n") {
                            
                        } else {
                            pass = false;
                        }
                    }
                });
            });
        }

        multipleblocking(start);

        if (pass) {
            // employee count blocking 

            for (let i = 0; i < array.length; i++) {
                blocking(array[i]);
            }

            function blocking(start) {
                timeslots.forEach(e => {

                    if (e.time == start) {
                            e.status = "y";
                        // if (employeecount < e.count + 1) {
                        //     //console.log('booking prevention');
                        //     e.status = "b";
                        //     //console.log(e.status);
                        //     e.count = e.count + 1;
                        //     //console.log(e);
                        // } else {
                        //     e.count = e.count + 1;
                        //     if (employeecount < e.count + 1) {
                        //         e.status = "b";
                        //     }
                        // }
                    }
                });
            }

            console.log('successfully booked');

            // res.status(201).json({ "success": true });


            console.log(req.body);
            let newdata = {
                times: timeslots
            }

            let query = { _id: ObjectId(timeslots1[0]._id) }
            var newvalues = { $set: newdata };

            await db.get().collection('timeslots').updateOne(query, newvalues)
                .then(async (data, err) => {
                    if (err) {
                        console.log(err);
                    } else {


                        const newBooking = {
                            start,
                            endtime,
                            doctorid,
                            userid,
                            date,
                            doctorname: doctor.name,
                            clinicname: doctor.cname,
                            username: user.name
                        }

                        await db.get().collection('bookings').insertOne(newBooking)

                    }
                })
                res.redirect('/users/bookings');
            
        } else {
            console.log('successfulkly prevented');
            res.status(201).json({ "success": false });
        }
    }
}


/* View User Booking */

const viewall = async (req, res) => {
    // //console.log('called');
    try {
        const { userid } = req.params;
        let bookings = await db.get().collection('bookings').find({ "userid": userid }).toArray()
        bookings.forEach(element => {
            // // //console.log(element);
            element.bookingid = element._id;
            // element.username = element._id;
        });
        // //console.log(" nbooking ");
        // //console.log(bookings);
        res.status(201).json(bookings);
    } catch (err) {
        // //console.log("err", err);
        res.status(500).json({ error: err.message });
    }
};

const storebooking = async (req, res) => {
    // //console.log('called');
    try {
        const { doctorid } = req.params;
        let bookings = await db.get().collection('bookings').find({ "doctorid": doctorid }).toArray()
        bookings.forEach(element => {
            // // //console.log(element);
            element.bookingid = element._id;
        });
        // //console.log(bookings);
        res.status(201).json(bookings);
    } catch (err) {
        // //console.log("err", err);
        res.status(500).json({ error: err.message });
    }
};

const viewsingle = async (req, res) => {
    // //console.log('called');
    try {
        const { id } = req.params;
        let booking = await db.get().collection('products').findOne({ _id: id });
        res.status(201).json(booking);
    } catch (err) {
        // //console.log("err", err);
        res.status(500).json({ error: err.message });
    }
};

const cancelbooking = async (req, res) => {
    //console.log('called');
    try {
        const { id } = req.params;

        let obj = await db.get().collection('bookings').findOne({ _id: id });

        let store = await db.get().collection('doctors').findOne({ _id: obj.storeid });
        //console.log(obj);
        //console.log(store);
        const newOrder = {
            start: obj.start,
            end: obj.end,
            doctorid: obj.doctorid,
            userid: obj.userid,
            date: obj.date,
            doctorname: doctor.name,
            cname: doctor.cname,
            status: "Cancelled",
            ownerid: store.ownerid
        };

        await db.get().collection('orders').insertOne(newOrder);
        await db.get().collection('bookings').deleteOne({ _id: ObjectId(id) })


        let data = await db.get().collection('products').find({ doctorid: obj.doctorid, date: obj.date }).toArray()

        // let employeecount = parseInt(store.employees);
        // let timeslots1 = await TimeSlot.find().select('times').select('date');
        // let timeslots = timeslots1[0].times;
        // //console.log("firstdate", timeslots1);
        // //console.log("firstdateid", timeslots1[0]._id);

        // let pass = true;
        // let array = [];

        // function multipleblocking(start) {
        //     let nots = service.duration / 5
        //     nots = Math.ceil(nots);
        //     array.push(start);
        //     for (let index = 0; index < nots - 1; index++) {
        //         start = addMinutesToTimeString(start, 5);
        //         array.push(start);
        //     }

        //     //console.log(array);
        //     //console.log('nots cal');
        //     array.forEach(ele => {
        //         timeslots.forEach(e => {
        //             if (e.time == ele) {
        //                 e.count = e.count - 1;
        //                 if (e.status = "b") {
        //                     e.status = "n"
        //                 }
        //             }
        //         });
        //     });
        // }
        // multipleblocking(obj.start);


        // TimeSlot.findByIdAndUpdate(
        //     { _id: timeslots1[0]._id },
        //     {
        //         $set:
        //         {
        //             times: timeslots
        //         }
        //     }
        // ).then(async (data, err) => {
        //     if (err) {
        //         //console.log(err);
        //     } else {
        //         //console.log(data);
        //     }
        // })


    } catch (err) {
        //console.log("err", err);
        res.status(500).json({ error: err.message });
    }
};

const getTimeSlots = async (req, res) => {
    //console.log('called');
    try {
        const { doctorid, date } = req.params;
        console.log(doctorid);
        console.log(date);
        // find time slots 
        let timeslots = await db.get().collection('timeslots').find({ doctorid: doctorid, date: date }).toArray()
        // //console.log(" before",timeslots);

        if (timeslots.length == 0) {
            console.log("if");
            let times = await firstbooking(doctorid, date);
            console.log('timeslots', times);
            let timeslots = await db.get().collection('timeslots').find({_id:times.insertedId}).toArray()
            console.log('timeslots', timeslots);
            res.status(201).json(timeslots);
        } else {
            console.log("else");
            console.log(timeslots[0].times);
            res.status(201).json(timeslots[0].times);
        }
    } catch (err) {
        console.log("err", err);
        res.status(500).json({ error: err.message });
    }
};

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
            doctorid:storeid,
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


exports.booking = booking;
exports.getTimeSlots = getTimeSlots;
exports.viewall = viewall;
exports.viewsingle = viewsingle;
exports.storebooking = storebooking;

