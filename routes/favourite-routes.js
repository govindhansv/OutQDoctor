const express = require("express");
const router = express.Router();
const favouritesController = require("../controllers/favourites-controller");
const {
    requiredlogin
} = require("../authentication");

router.get("/", requiredlogin, favouritesController.getAllFavourites);
router.get('/add/:id', requiredlogin, favouritesController.addFavourite);
router.get('/:id', favouritesController.getFavouriteById);
router.get("/delete/:id", favouritesController.deleteFavourite);

module.exports = router;