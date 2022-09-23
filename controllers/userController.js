
const multer = require("multer");
const sharp = require("sharp");
const User = require("./../models/userModels");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");


// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/img/users");
//     }, 
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split("/")[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) =>{
    if(file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new AppError("Not an Image!, please upload only Image.", 404), false)
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uplaodUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync( async (req, res, next) => {

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    if(!req.file) return next();

    await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

    next();

});

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        //object.key is one of the easy ways to loop through an object in javascript
        if (allowedFields.includes(el)) newObj [el] = obj[el];
    });

    return newObj;
}


exports.getMe = (req, res, next) =>{
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync( async (req, res, next) =>{

    //1) Create Error if user POSTS password date

    if (req.body.password || req.body.passwordConfirm){
        return next(new AppError("this route is not for password updates, please use /updateMyPassword", 400));
    }
    //2) Filtered out unwanted fields name that are not allowed to be updated
    const filteredBody = filterObj(req.body, "name", "email");
     if (req.file) filteredBody.photo = req.file.filename;
    //3)Update user document
    
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }      
    });
});

exports.deleteMe = catchAsync(async (req, res, next) =>{
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(200).json({
        status: "sucess",
        data: null
    });
});
exports.getUser = factory.getOne(User);

exports.createUser = (req, res) =>{
    
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined!  please use / signUp instead"
    });
};
//Do not update password with this
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);