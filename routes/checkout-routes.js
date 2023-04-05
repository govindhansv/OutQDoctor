const express = require("express");
const router = express.Router();
const checkoutsController = require("../controllers/checkouts-controller");

router.get("/", checkoutsController.getAllCheckouts);
// router.get('/add', checkoutsController.getCheckoutAddform);
// router.post("/add", checkoutsController.addCheckout);
// router.get('/edit/:id', checkoutsController.getCheckoutEditform);
// router.put("/edit", checkoutsController.editCheckout);
// router.get('/:id', checkoutsController.getCheckoutById);
// router.delete("/:id", checkoutsController.deleteCheckout);

module.exports = router;