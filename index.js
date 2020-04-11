const express = require('express');
const dotenv = require('dotenv')
var bodyParser = require('body-parser');

// dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

let allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    next();
}
app.use(allowCrossDomain);

//Import routes
const adminRoute = require('./routes/admin');

// //Middleware
app.use(express.json());

// //Route midddlewares
app.use('/api/admin', adminRoute);


app.listen(4500, () => {
    console.log("Server is up and running");
})