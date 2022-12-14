const mongoose = require("mongoose");
const slugify = require("slugify");

// const User = require("./userModels");


// const tourSchema = new mongoose.Schema({
//     name: String,
//     price: Number,
//     rating: Number

// });
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true, "A Tour must have a name"],
        unique: true,
        trim: true,
        maxlength: [40, "A tour must have less or equal than 40 characters"],
        minlength: [10, "A tour must have more or equal than 10 characters"]
    },
    slug: String,
    duration:{
        type: Number,
        required:[true, "A Tour must have duration"]
    },
    maxGroupSize:{
        type: Number,
        required:[true, "A Tour must have duration"]
    },
    difficulty:{
        type: String,
        required:[true, "A Tour must have duration"],
        enum: {
           values: ["easy", "medium", "difficult"],
           message: "difficulty must be easy, medium or difficult"
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be minimum of 1"],
        max: [5, "Rating must be maximum of 5"],
        set: val => Math.round(val * 10) /10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A Tour must have a price"]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                //this only points to current doc on NEW document creation
                return val < this.price;
            },
            message: "Discount price ({VALUE}) should be below regular price"
        }
        },
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, "A Tour must have a Image Cover"]
    },
    images: [String],
    createdAt :{
        type: Date,
        default: Date.now()
        // select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },

    startLocation: {
        //GeoJSON
        type: {
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                defaullt: "Point",
                enum: ["Point"]
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
    }
    ], 
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }

    ]
},

{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

// tourSchema.index({price: 1});

tourSchema.index({price: 1, ratingsAverage: -1});
tourSchema.index({slug: 1});
tourSchema.index({startLocation: "2dsphere" });

tourSchema.virtual("durationWeek").get(function() {
    return this.duration / 7;
});

//Virtual Populate
tourSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "tour",
    localField: "_id"
    // the localfield is called id here bcus it is in the current location, we called that foreingfield "tour", cus it is defined in the review model
});

// DOCUMENT MIDDLEWARE, this runs before .save() and .create(), and will not run on insartMany()

tourSchema.pre("save", function(next) {
    this.slug = slugify(this.name, { lower: true});
    next();
});

// tourSchema.pre("save", async function(next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
//     next();
// });

// tourSchema.pre("save", function(next) {
//     console.log("will save document ......");
//     next();
//     })
// tourSchema.post("save", function(doc, next) {
//     console.log(doc)
//     next();
// })

// QUERY MIDDLEWARE

tourSchema.pre(/^find/, function(next) {
    this.find({secretTour: {$ne: true}})
    this.start = Date.now();
    next();
});


tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: "guides",
        select: "-__v"
    })
    next();
});

tourSchema.post(/^find/, function(docs, next){
    console.log(`Querry took ${Date.now() - this.start} milliseconds`);
    next();
});

// tourSchema.pre("aggregate", function(next) {
//     this.pipeline().unshift({$match: {secretTour: {$ne: true}}});

//     console.log(this.pipeline());
//     next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;