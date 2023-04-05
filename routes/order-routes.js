    const express = require("express");
    const router = express.Router();
    const ordersController = require("../controllers/orders-controller");

    router.get("/", ordersController.getUserOrders);
    router.get("/all", ordersController.getAllOrders);
    router.get('/changestatus/:id/', ordersController.getOrderStatusform);
    router.post("/changestatus", ordersController.ChangeOrderStatus);
    router.get('/track/:id', ordersController.trackOrder);
    router.post("/edit", ordersController.editOrder);
    router.get('/:id', ordersController.getOrderById);
    router.get("/delete/:id", ordersController.deleteOrder);

    module.exports = router;