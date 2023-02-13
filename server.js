const dotenv = require('dotenv');
const express = require('express');
const mongoose = require("mongoose");
const userRoutes = require('./routes/userRoutes')

// express app
const app = express();
dotenv.config();

const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }));

//express middleware
app.use(express.json());
app.use( (req,res,next) => {
    console.log(req.path, req.method)
    next()
})


// express routes
app.use("/api/user", userRoutes);

const port = process.env.PORT

// connect to db
mongoose.set('strictQuery', true);


mongoose.connect(process.env.MONGO_URI)
    .then( () => {
        // listening for requests
        app.listen(port, () => {
            console.log(`Server started on port ${port} !!!`);
        })
    })
    .catch( (error) => {
        console.log(error);
    })