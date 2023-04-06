import Booking from "../models/Booking.js"
import Order from "../models/Order.js";
import Store from "../models/Store.js";
import User from "../models/User.js";
import TimeSlot from "../models/TimeSlot.js"
import Service from "../models/Service.js"
import Owner from "../models/Owner.js"
import Noti from "../models/Noti.js"
import { sendNoty } from "../controllers/notification.js";

/* Create new booking order */

export const booking = async (req, res) => {

    // storing req.body
    let {
        start,
        end,
        storeid,
        serviceid,
        userid,
        price,
        date,
        servicename,
        storename,
        img,
    } = req.body;

    // FINDING COUNTS

    //console.log(req.body);
    //console.log("storeid\n", storeid);
    let service = await Service.findOne({ _id: serviceid });
    //console.log(service);

    let store = await Store.findOne({ _id: storeid });
    if (store.working == "off") {
        //console.log('store is currently not working');
        res.status(201).json({ "success": false, "status": "store closed" });
    } else {


        //console.log("store \n\n\n", store);
        let endtime = addMinutesToTimeString(start, service.duration);
        let user = await User.findOne({ _id: userid });

        end = endtime;

        let employeecount = parseInt(store.employees);

        //console.log("employee count", employeecount);
        //console.log(" endtime", end);

        //Checking count status 

        let timeslots1 = await TimeSlot.find({ storeid: storeid, date: date }).select('times').select('date');
        let timeslots = timeslots1[0].times;
        //console.log("firstdate", timeslots1);
        //console.log("firstdateid", timeslots1[0]._id);

        let pass = true;
        let array = [];

        function multipleblocking(start) {
            let nots = service.duration / 5
            nots = Math.ceil(nots);
            array.push(start);
            for (let index = 0; index < nots - 1; index++) {
                start = addMinutesToTimeString(start, 5);
                array.push(start);
            }

            //console.log(array);
            //console.log('nots cal');
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

            for (let i = 0; i < array.length; i++) {
                blocking(array[i]);
            }

            function blocking(start) {
                timeslots.forEach(e => {

                    if (e.time == start) {
                        if (employeecount < e.count + 1) {
                            //console.log('booking prevention');
                            e.status = "b";
                            //console.log(e.status);
                            e.count = e.count + 1;
                            //console.log(e);
                        } else {
                            e.count = e.count + 1;
                            if (employeecount < e.count + 1) {
                                e.status = "b";
                            }

                        }
                    }
                });
            }

            //console.log('successfully booked');
            res.status(201).json({ "success": true });

            TimeSlot.findByIdAndUpdate(
                { _id: timeslots1[0]._id },
                {
                    $set:
                    {
                        times: timeslots
                    }
                }
            ).then(async (data, err) => {
                if (err) {
                    // //console.log(err);
                } else {
                    const newBooking = new Booking({
                        start,
                        end,
                        storeid,
                        serviceid,
                        userid,
                        price,
                        date,
                        servicename,
                        storename,
                        img,
                        username: user.name
                    });

                    const savedBooking = await newBooking.save();
                    // //console.log(data);

                    const newNoti = new Noti({
                        title: "New Booking Arrived",
                        message: `${user.name} is booked ${servicename} at ${start} on ${date} `,
                        storeid: storeid
                    });
                    const noti = await newNoti.save();
                    let owner = await Owner.findOne({ _id: store.id });
                    //console.log(owner);

                    let data = {
                        token: owner.deviceid,
                        title: `${user.name} is booked ${servicename} at ${start} on ${date} `,
                        body: "New Booking Arrived",
                    }
                    sendNoty(data);

                }
            })
        } else {
            //console.log('successfulkly prevented');
            res.status(201).json({ "success": false });
        }

        // let test = await TimeSlot.findOne(timeslots1._id);
        // //console.log("new date", test);
        // //console.log("firstdateid",timeslots1[0]._id);

    }
}

export const book = async (req, res) => {
    // //console.log('called');
    try {
        let {
            start,
            end,
            storeid,
            serviceid,
            userid,
            price,
            date,
            servicename,
            storename,
            img,
        } = req.body;

        let service = await Service.findOne({ serviceid });
        let store = await Store.findOne({ storeid });
        let endtime = addMinutesToTimeString(start, service.duration);
        let user = await User.findOne({ userid });

        end = endtime;


        let employeecount = parseInt(store.employees);
        // //console.log("employee count", employeecount);
        // //console.log(" endtime", end);

        const timeslots = await TimeSlot.find({ storeid: storeid }).select('start').select('end').select('date');
        var err = false;

        var count = 0;

        // //console.log("Started counting", count);

        timeslots.forEach(element => {

            if (element.date == date) {
                if (convertToTime(element.start) < convertToTime(start) && convertToTime(element.end) > convertToTime(start)) {
                    count = count + 1;
                    // err = true;
                }
            }
        });

        // // //console.log(" count is equal to ", count);


        if (employeecount < count + 1) {
            err = true;
        }


        if (err) {
            // //console.log(' Already booked');
            res.status(500).json({ "success": false });
        } else {

            const newBooking = new Booking({
                start,
                end,
                storeid,
                serviceid,
                userid,
                price,
                date,
                servicename,
                storename,
                img,
                username: user.name
            });

            const savedBooking = await newBooking.save();

            const newTimeSlot = new TimeSlot({
                start,
                end,
                storeid,
                serviceid,
                date
            });
            const savedTimeSlot = await newTimeSlot.save();
            res.status(201).json({ "success": true });

        }

    } catch (err) {
        // //console.log("err", err);
        res.status(500).json({ error: true });
    }
};

/* Create new booking order */
export const bookingdemo = async (req, res) => {
    // //console.log('called');
    try {
        let {
            start,
            end,
            storeid,
            serviceid,
            userid,
            price,
            date,
            servicename,
            storename,
            img,
        } = req.body;
        // //console.log(req.body);
        let service = await Service.findOne({ serviceid });
        // //console.log(service);
        end = start;

        let user = await User.findOne({ userid });
        // // //console.log(" user \n\n\n\n" ,user.name);

        // //console.log(req.body);

        const timeslots = await TimeSlot.find({ serviceid: serviceid }).select('start').select('date');

        const store = await Store.find({ _id: storeid });
        // //console.log(" store", store);

        const time = await TimeSlot.find({ serviceid: serviceid, start: start });

        // //console.log("d", time.length);
        var err;
        // //console.log("emp", store[0].employees);
        let employeecount = parseInt(store[0].employees);
        // //console.log("fgd", employeecount);


        timeslots.forEach(element => {

            if (element.start == start && element.date == date) {
                if (employeecount < time.length + 1) {
                    err = true;
                }
            }
        });

        if (err) {
            res.status(500).json({ "success": false });

        } else {
            // //console.log(" hell ");

            const newBooking = new Booking({
                start,
                end,
                storeid,
                serviceid,
                userid,
                price,
                date,
                servicename,
                storename,
                img,
                username: user.name
            });

            const savedBooking = await newBooking.save();
            if (employeecount == time.length) {

                const newTimeSlot = new TimeSlot({
                    start,
                    end,
                    storeid,
                    serviceid,
                    date
                });

                const savedTimeSlot = await newTimeSlot.save();
            }

            res.status(201).json({ "success": true });
        }


    } catch (err) {
        // //console.log("err", err);
        res.status(201).json({ "success": false });

    }
};

/* View User Booking */

export const viewall = async (req, res) => {
    // //console.log('called');
    try {
        const { userid } = req.params;
        const bookings = await Booking.find({ "userid": userid }).select('-createdAt').select('-__v').select('-updatedAt');
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

export const storebooking = async (req, res) => {
    // //console.log('called');
    try {
        const { storeid } = req.params;
        const bookings = await Booking.find({ "storeid": storeid }).select('-createdAt').select('-__v').select('-updatedAt');
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

export const viewsingle = async (req, res) => {
    // //console.log('called');
    try {
        const { id } = req.params;
        const booking = await Booking.find({ id }).select('-createdAt').select('-__v').select('-updatedAt');
        res.status(201).json(booking);
    } catch (err) {
        // //console.log("err", err);
        res.status(500).json({ error: err.message });
    }
};

export const cancelbooking = async (req, res) => {
    //console.log('called');
    try {
        const { id } = req.params;

        let obj = await Booking.findOne({ _id: id });
        let store = await Store.findOne({ _id: obj.storeid });
        //console.log(obj);
        //console.log(store);
        const newOrder = new Order({
            start: obj.start,
            end: obj.end,
            storeid: obj.storeid,
            serviceid: obj.serviceid,
            userid: obj.userid,
            price: obj.price,
            date: obj.date,
            servicename: obj.servicename,
            storename: obj.storename,
            status: "Cancelled",
            ownerid: store.ownerid
        });

        newOrder.save();

        await Booking.deleteOne({ _id: id });

        let service = await Service.findOne({ _id: obj.serviceid });

        let employeecount = parseInt(store.employees);
        let timeslots1 = await TimeSlot.find({ storeid: obj.storeid, date: obj.date }).select('times').select('date');
        let timeslots = timeslots1[0].times;
        //console.log("firstdate", timeslots1);
        //console.log("firstdateid", timeslots1[0]._id);

        let pass = true;
        let array = [];

        function multipleblocking(start) {
            let nots = service.duration / 5
            nots = Math.ceil(nots);
            array.push(start);
            for (let index = 0; index < nots - 1; index++) {
                start = addMinutesToTimeString(start, 5);
                array.push(start);
            }

            //console.log(array);
            //console.log('nots cal');
            array.forEach(ele => {
                timeslots.forEach(e => {
                    if (e.time == ele) {
                        e.count = e.count - 1;
                        if (e.status = "b") {
                            e.status = "n"
                        }
                    }
                });
            });
        }
        multipleblocking(obj.start);


        TimeSlot.findByIdAndUpdate(
            { _id: timeslots1[0]._id },
            {
                $set:
                {
                    times: timeslots
                }
            }
        ).then(async (data, err) => {
            if (err) {
                //console.log(err);
            } else {
                //console.log(data);
            }
        })


    } catch (err) {
        //console.log("err", err);
        res.status(500).json({ error: err.message });
    }
};


export const getTimeSlots1 = async (req, res) => {
    // //console.log('called');
    try {
        // find time slots based on store id not on service id

        const { storeid, date } = req.params;
        // //console.log(storeid, date);
        const timeslots = await TimeSlot.find({ storeid: storeid, date: date }).select('start').select('end').select('date');
        // //console.log(timeslots);
        let times = [];
        timeslots.forEach(element => {
            times.push({ start: element.start, end: element.end, date: element.date })
        });
        // //console.log(times);
        res.status(201).json(times);
    } catch (err) {
        // //console.log("err", err);
        res.status(500).json({ error: err.message });
    }
};

export const getTimeSlots = async (req, res) => {
    //console.log('called');
    try {
        const { storeid, date } = req.params;
        // find time slots 
        const timeslots = await TimeSlot.find({ storeid: storeid, date: date }).select('times').select('date');
        // //console.log(" before",timeslots);

        if (timeslots.length == 0) {
            //console.log("if");
            let times = await firstbooking(storeid, date);
            // //console.log('timeslots',times.times);
            res.status(201).json(times.times);
        } else {
            //console.log("else");
            // //console.log(timeslots[0].times);
            res.status(201).json(timeslots[0].times);
        }
    } catch (err) {
        //console.log("err", err);
        res.status(500).json({ error: err.message });
    }
};

async function firstbooking(storeid, date) {
    //console.log(' storeid ', storeid);
    let store = await Store.findOne({ _id: storeid }).select('-createdAt').select('-__v').select('-updatedAt');
    //console.log(' store ', store);

    let time = convertToTime(store.start);
    //console.log("time old", time);
    // //console.log("time1",time1);

    const startTime = new Date(`2023-02-25T${convertToTime(store.start)}`);
    const endTime = new Date(`2023-02-25T${convertToTime(store.end)}`);
    const diffHours = Math.floor((endTime.getTime() - startTime.getTime()) / 3600000);

    // //console.log("start", startTime);
    // //console.log("end", endTime);
    //console.log("diff", diffHours);
    let times = [];

    for (let hour = 0; hour < 12 * diffHours; hour = hour + 1) {

        let obj = {
            time: time,
            count: 0,
            status: "n"
        }
        time = addMinutesToTimeString(time, 5)
        //console.log(" time new", time);
        times.push(obj);
        //console.log(" obj", obj);
    }
    //console.log("times", times);
    const newTimeSlot = new TimeSlot({
        date,
        storeid,
        times
    });
    const savedTimeSlot = await newTimeSlot.save();
    //console.log("savedtimes", savedTimeSlot);
    return savedTimeSlot;
}

function convertToTime(timeString) {

    const convertTime12to24 = (time12h) => {
        //console.log('time12h', time12h);
        const [time, modifier] = time12h.split(' ');

        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }

        if (modifier === 'PM') {
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



 // timeslots.forEach(e => {
    //     if (e.time == start) {
    //         if (e.status == "b") {
    //             //console.log('prevention');
    //             res.status(201).json({ "success": false });
    //         } else if (employeecount < e.count + 1) {
    //             //console.log('booking prebvention');
    //             e.status = "b";
    //             //console.log(e.status);
    //             e.count = e.count + 1;
    //             //console.log(e);
    //         } else {
    //             //console.log('booked');
    //             //console.log(e);
    //             e.count = e.count + 1;
    //             //console.log(e);
    //         }
    //     }
    // });