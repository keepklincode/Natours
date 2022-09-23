const fs = require("fs");
const express = require("express");

const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./../routes/reviewRoutes");


const router = express.Router();

// router.param("id", tourController.checkId);

    //POST /tour/234fad4d4/reviews
     //GET /tour/234ftdd/reviews
router.use("/:tourId/reviews", reviewRouter);

router
.route("/top-5-cheap")
.get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStat);
router
.route("/monthly-plan/:year")
.get(
    authController.protect, 
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan);

router.route("/tours-within/:distance/center/:latlng/unit/:unit")
.get(tourController.getToursWithin);
//tours-withing?distance=233&center=-40,45&unit=mi


router.route("/distances/:latlng/unit/:unit")
.get(tourController.getDistances);

router
.route("/")
.get(tourController.getAllTours)
.post(
    authController.protect,
    authController.restrictTo ("admin", "lead-guide"), 
    tourController.createTour);

router
.route("/:id")
.get(tourController.getTour)
.patch(
    authController.protect, 
    authController.restrictTo("admin", "lead-guide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour)
.delete(
    authController.protect, 
    authController.restrictTo("admin", "lead-guide"),
     tourController.deleteTour);


 

module.exports = router;


