/* eslint-disable prettier/prettier */
const express = require("express");
const viewController = require("../controllers/viewController");

const router = express.Router();

router.get("/overview", viewController.getOverview);
router.get("/tours/:slug", viewController.getTourView);

module.exports = router;
