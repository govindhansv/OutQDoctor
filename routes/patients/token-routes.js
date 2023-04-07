const express = require("express");
const router = express.Router();
const productsController = require("../../controllers/patients/tokens-controller");

router.get("/", productsController.allTokens);
router.get("/create", productsController.createToken);
router.get("/next", productsController.nextToken);
router.get('/new-patient', productsController.getProductAddform);
router.post("/add", productsController.addProduct);
router.get('/edit/:id', productsController.getProductEditform);
router.post("/edit", productsController.editProduct);
router.get("/delete/:id", productsController.deleteProduct);
router.get('/:id', productsController.getProductById);

module.exports = router;