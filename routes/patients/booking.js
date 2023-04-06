import express from "express";
import {booking,viewall,storebooking,viewsingle,cancelbooking, getTimeSlots,book } from "../controllers/booking.js";

const router = express.Router();

router.post("/", book);
router.post("/book", booking);
router.get("/viewall/:userid", viewall);
router.get("/view/store/:storeid/", storebooking);
router.get("/view/single/:id", viewsingle);
router.get("/cancel/:id", cancelbooking);
router.get("/timeslots/:storeid/:date", getTimeSlots);


export default router;
