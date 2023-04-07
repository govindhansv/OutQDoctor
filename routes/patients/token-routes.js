const express = require("express");
const router = express.Router();
const productsController = require("../../controllers/patients/tokens-controller");

router.get("/", productsController.getAllProducts);
router.get("/alldoctors", productsController.getAllDoctors);
router.get("/booking", productsController.getBookingPage);
router.post("/booking", productsController.postBooking);
router.get('/new-patient', productsController.getProductAddform);
router.post("/add", productsController.addProduct);
router.get('/edit/:id', productsController.getProductEditform);
router.post("/edit", productsController.editProduct);
router.get("/delete/:id", productsController.deleteProduct);
router.get('/:id', productsController.getProductById);

module.exports = router;