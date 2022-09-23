
const AppError = require("./../utils/appError");


const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}. `;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {

    // const value = err.m.match(/(["'])(\\?.)*?\1/);
    console.log(err);

    const message = `Duplicate field value: x. Please use another value!`;
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError(message, 400);
}

const handleJWTError = () => new AppError("invalid token, please login again", 401);

const handleJWTExpiredError = () => new AppError("Your token has expired, please log in again", 401);

const sendErrorDev = (err, req, res) => {
    //A) API
    if (req.originalUrl.startsWith("/api")) {
       return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } 
    //B) RENDER WEBSITE
    console.error("ERROR", err);

      return  res.status(err.statusCode).render("error", {
            title: "Something when wrong!",
            msg: err.message
        });
   
};

const sendErrorProd = (err, req, res) =>{  
    // A) APIS
    if (req.originalUrl.startsWith("/api")) {
    // A) Operational, trusted error: send message to cliant
    if (err.isOperational) {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}  
    // B) //programming or other unknown error: dont leak error to client
    // 1) Log Error 
    console.error("ERROR", err);

    //2) Send Generic message
    res.status(500).json({
        status: err,
        message: 'something went very wrong'
    })
    } 

    // B) RENDERED WEBSITE
    // A) Operational, trusted error: send message to cliant
    if (err.isOperational) {
        return res.status(err.statusCode).render("error", {
            title: "Something when wrong!",
            msg: err.message
        });
     } 

    //B) programming or other unknown error: dont leak error to client
    //1) Log Error
    console.error("ERROR", err);
        
    //2) Send Generic message
     return res.status(err.statusCode).render("error", {
        title: "Something when wrong!",
         msg: "please try again later"
         });
};


module.exports = (err, req, res, next) =>{

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === "production") {
        let error = { ...err} ;
        error.message = err.message

        if (error.name === "CastError") error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === "validationError") error = handleValidationErrorDB(error);

        if (error.name === "JsonWebTokenError") error = handleJWTError();
        if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

        sendErrorProd(error, req, res);
    }
}