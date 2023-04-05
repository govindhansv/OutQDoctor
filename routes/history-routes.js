    
    const express = require("express");
    const router = express.Router();
    const historysController = require("../controllers/historys-controller");

    router.get("/", historysController.getAllHistorys);
    router.get('/add', historysController.getHistoryAddform);
    router.post("/add", historysController.addHistory);
    router.get('/edit/:id',historysController.getHistoryEditform);
    router.post("/edit", historysController.editHistory);
    router.get('/:id', historysController.getHistoryById);
    router.get("/delete/:id", historysController.deleteHistory);

    module.exports = router;