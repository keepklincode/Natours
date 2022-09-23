const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../models/tourModels");
const Booking = require("../models/bookingModels");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");



exports.getCheckoutSession = catchAsync(async (req, res) => {
    
//1) Get the current book toour
 const tour = await Tour.findById(req.params.tourId);

//2) Create checkout session

  const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${req.protocol}://${req.get("host")}/?tour=${
        req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
      cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
      mode: "payment",
      line_items: [
              {
                     // name: `${tour.name} Tour`,
                  // description: tour.summary,
                  // images: [`http://127.0.0.1:3000/img/tours/${tour.imageCover}`],              
                  // amount: tour.price * 100,
                  // currency: "usd",
                  price_data: {
                    unit_amount: tour.price * 100,
                    currency: "usd",
                    product_data: {
                      name: `${tour.name} Tour`,
                      description: tour.summary
                      // images: [`http://127.0.0.1:3000/img/tours/${tour.imageCover}`], 
                    },
                  },
                  quantity: 1
              }
          ]

      });
    //   
  
  //3) create session for response

  res.status(200).json({
      status: "success",
      session
  })

});


exports.createBookingCheckout = catchAsync( async (req, res, next) =>{
  const {tour, user, price} = req.query;
  if (!tour && !user && !price) return next();

  await Booking.create({tour, user, price});

  res.redirect(req.originalUrl.split("?")[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

