const express = require("express");
const router = express.Router();
const productsController = require("../../controllers/patients/prescription-controller");

router.get("/", productsController.getAllProducts);
router.get('/new', productsController.getProductAddform);
router.post("/new", productsController.addProduct);
router.get('/edit/:id', productsController.getProductEditform);
router.post("/edit", productsController.editProduct);
router.get("/delete/:id", productsController.deleteProduct);
router.get('/:id', productsController.getProductById);

module.exports = router;