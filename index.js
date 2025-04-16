const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const rateLimit = require('express-rate-limit');
const authRouter = require('./routes/auth');
const shopRouter = require('./routes/shop');
const tableRouter = require('./routes/table');
const reservationRouter = require('./routes/reservation');
const availabilityRouter = require('./routes/availability');
const categoryRouter = require('./routes/category');
const attributeRouter = require('./routes/attribute');
const reviewRouter = require('./routes/review');
const searchShopsRouter = require('./routes/searchShops');
const cityRouter = require('./routes/city');
const regionRouter = require('./routes/region');
const applicationRouter = require('./routes/applications');
const uploadRouter = require('./routes/upload');
const cookieParser = require('cookie-parser');

const PORT = 300; // Define port number server will listen
const app = express(); // Create an instance of express application
//mongoDB string
const DB = "mongodb+srv://kon21pan:Konpa21%21%40@cluster0.0kwjk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
/**
 * // Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 2 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use(limiter);
 */


//middleware to register routes or to mount routes
app.use(express.json());
app.use(cookieParser());


app.use(authRouter);
app.use(shopRouter);
app.use(tableRouter);
app.use(reservationRouter);
app.use(availabilityRouter);
app.use(categoryRouter);
app.use(attributeRouter);
app.use(reviewRouter);
app.use(searchShopsRouter);
app.use(cityRouter);
app.use(regionRouter);
app.use(applicationRouter);
app.use(uploadRouter);





// Εξυπηρέτηση του φακέλου public
app.use(express.static(path.join(__dirname, 'public')));




app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});


mongoose.connect(DB).then(() => {
    console.log('Mongo connected');
});

app.listen(PORT, "0.0.0.0", function () {
    // Log message
    console.log(`Server is running on port ${PORT}`);
});