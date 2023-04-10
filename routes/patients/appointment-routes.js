const express = require("express");
const { requiredadmin } = require("../../authentication");
const router = express.Router();
const productsController = require("../../controllers/patients/appointments-controller");

router.get("/",requiredadmin, productsController.getAllProducts);
router.get("/booking", productsController.getBookingPage);
router.post("/booking", productsController.postBooking);
router.get('/new-patient', productsController.getProductAddform);
router.post("/add", productsController.addProduct);
router.get('/edit/:id', productsController.getProductEditform);
router.post("/edit", productsController.editProduct);
router.get("/delete/:id", productsController.deleteProduct);
router.get('/:id', productsController.getProductById);
router.post("/", productsController.booking);


module.exports = router;