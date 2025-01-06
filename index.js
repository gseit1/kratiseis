const express = require('express'); // Import express module
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const categoryRouter = require('./routes/category');
const shopRouter = require('./routes/shop');
const tableRouter = require('./routes/table');
const reservationRouter = require('./routes/reservation')
const availabilityRouter = require('./routes/availability')

const PORT = 300; // Define port number server will listen
const app = express(); // Create an instance of express application
//mongoDB string
const DB = "mongodb+srv://kon21pan:Konpa21%21%40@cluster0.0kwjk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

//middleware to register routes or to mount routes
app.use(express.json());
app.use(authRouter);
app.use(categoryRouter);
app.use(shopRouter);
app.use(tableRouter);
app.use(reservationRouter);
app.use(availabilityRouter);

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});




mongoose.connect(DB).then(()=>{
    console.log('Mongo connected')
});

app.listen(PORT, "0.0.0.0", function () {
    // Log message
    console.log(`Server is running on port ${PORT}`);
});

