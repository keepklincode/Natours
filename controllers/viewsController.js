const Tour = require("../models/tourModels");
const User = require("../models/userModels");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Booking = require("../models/bookingModels");

exports.getOverview = catchAsync( async (req, res, next) =>{
    const tours = await Tour.find();

    res.status(200).render("overview", {
        title: "All tour",
        tours
    });
});


exports.getTour = catchAsync( async (req, res, next) => {
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: "reviews",
        fields: "review rating user"
    });

    if(!tour) {
        return next (new AppError("There is no tour with that name!", 404));
    };

    res.status(200).render("tour", {
        title: `${tour.name} Tour`,
        tour
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200).render("login", {
        title: "Login into your accoutn"
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render("account", {
        title: "Your account"
    });
};

exports.getMyTours = catchAsync ( async (req, res, next) => {
    // 1) find all bookings
    const bookings = await Booking.find({ user: req.user.id});

    //2) Find tour with reurned IDs
    const tourIDs = bookings.map( el => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs }});

    res.status(200).render("overview", {
        title: "My Tours",
        tours
    });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
 const updatedUser = await User.findByIdAndUpdate(req.user.id, {
     name: req.body.name,
     email: req.body.email
 },
 
 {
     new: true,
     runValidators: true
 });
 res.status(200).render("account", {
    title: "Your account",
    user: updatedUser 
});

});