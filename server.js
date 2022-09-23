//4)///////SERVER////////
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config( { path: "./config.env" });
const app = require("./app");

process.on("uuncaughtException", err =>{
    console.log(err.name, err.message);
    console.log("UNCAUGHT EXCEPTION , shouting down");
        process.exit(1);
    
});

const DB = process.env.DATABASE.replace(
    "<PASSWORD>", process.env.DATABASE_PASSWORD);

    mongoose.connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log("DB is connected successfully"));



const port = process.env.PORT || 3000;
const server = app.listen(port, () =>{
    console.log(`app is running on port ${port}........`)
});

process.on("unhandledRejection", err =>{
    console.log(err.name, err.message)

    console.log("UNHANDLED REJECTION, shouting down")
    server.close(() =>{
        process.exit(1);
    })
    
});
