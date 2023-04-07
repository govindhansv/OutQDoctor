const express = require("express");
const booking = require("../../controllers/patients/booking.js");
const router = express.Router();

router.post("/", booking.booking);
// router.get("/viewall/:userid", booking.viewall);
// router.get("/view/store/:storeid/", booking.storebooking);
// router.get("/view/single/:id", booking.viewsingle);
// router.get("/cancel/:id", booking.cancelbooking);
// router.get("/timeslots/:storeid/:date", booking.getTimeSlots);

module.exports = router;
