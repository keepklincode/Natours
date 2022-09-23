
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const AppError = require("./utils/appError");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");


const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const errorControllerHandler = require("./controllers/errorController");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"))



//1)////GLOBALL MIDDLEWARE/////////

//Serving static files
app.use(express.static(path.join(__dirname, "public")));
//Set security HTTP header
app.use(helmet());

//Development Logging

console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

//limiting request from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP, please try again in an Hour",
});

app.use("/api", limiter);

//Body parser, reading data from body into req.body
app.use(express.json({limit: "10kb"}));
app.use(express.urlencoded({ extended: true, limt: "10kb"}));
app.use(cookieParser());

//Data sanitization against NOSQL query injection
app.use(mongoSanitize());

//Data sanitization against Cross-Site-Scripting (XSS) Attack
app.use(xss());

//Prevent parameter polution
app.use(hpp({
    whitelist: [
        "duration",
        "ratingsQuantity",
        "ratingsAverage",
        "maxGroupSize",
        "difficulty",
        "price"
    ]
}));



// Testing middleware
app.use((req, res, next) =>{
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies)
    next();
});


app.use(
    helmet({
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: {
            allowOrigins: ['*']
        },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ['*'],
                scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"]
            }
        }
    })
);


//3)ROUTES

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 400));
});

// Start express app

app.use (errorControllerHandler);

module.exports = app;
