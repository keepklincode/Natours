const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Tour = require("./../../models/tourModels");
const Review = require("./../../models/reviewModels");
const User = require("./../../models/userModels");


dotenv.config( { path: "./config.env" });


const DB = process.env.DATABASE.replace(
    "<PASSWORD>", process.env.DATABASE_PASSWORD);

    mongoose.connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log("DB is connected successfully"));

    //READ JSON FILE///
    const tours =JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));    
    const users =JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
    const reviews =JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"));

    //IMPORT DATA TO DB///

    const importData = async () =>{
        try{
            await Tour.create(tours);
            await User.create(users);    
            await Review.create(reviews);       
            console.log("Data successfully loaded!");
        }catch(err) {
            console.log(err);
        }
        process.exit();
    };

    //DELETE ALL DATA FROM DB//

    const deleteData = async () => {
        try {
            await Tour.deleteMany();
            await User.deleteMany();
            await Review.deleteMany();
            console.log("data deleeted succesfully");

        } catch (err) {
            console.log(err);
        }
        process.exit();
    };

    if (process.argv[2] === "--import") {
        importData();
    } else if (process.argv[2] === "--delete") {
        deleteData();
    };

    


