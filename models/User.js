const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dob : {
        type: String ,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    followersUserID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    followingUserID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    }
}, {timestamps:true})

userSchema.index({"location": "2dsphere"})

module.exports = new mongoose.model("User",userSchema)