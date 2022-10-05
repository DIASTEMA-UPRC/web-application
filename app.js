//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const socketio = require('socket.io');
const MongoStore = require('connect-mongo');
const mongoose = require("mongoose");
const http = require("http");
const session = require('express-session');
const chalk = require('chalk');
const time = require('./public/js/modules/getTime.js');

// chalk colors
const diastema = chalk.hex('#3990b2');
const error = chalk.white.bold.bgRed
const success = chalk.white.bold.bgGreen

const { MONGO_URL, PORT} = require("./config/config");

// Database connection -----------------------------------------------------------------------------
mongoose.connect(MONGO_URL + "UIDB");

// Routes imports ----------------------------------------------------------------------------------
const homeRoute = require('./routes/homeRoute');
const registerRoute = require('./routes/registerRoute');
const logoutRoute = require('./routes/logoutRoute');
const dashboardRoute = require('./routes/dashboardRoute');
const datasetsRoute = require('./routes/datasetsRoute');
const pipelinesRoute = require('./routes/pipelinesRoute');
const functionsRoute = require('./routes/functionsRoute');
const monitoringRoute = require('./routes/monitoringRoute');
const visualizationRoute = require('./routes/visualizationRoute');
const messagesRoute = require('./routes/messagesRoute');
const route404 = require('./routes/404Route');
const githubAuth = require('./routes/githubAuth');
// -------------------------------------------------------------------------------------------------

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware ----------------------------------
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); 
app.use(express.static("public"));
app.use(session({
    secret:'diastema',
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({
        mongoUrl: MONGO_URL+"UIDB",
        collection:'sessions'
    })
}));

// Make io accessible to our routers
app.use(function(req,res,next){
    req.io = io;
    next();
});

// Home route -----------
app.use(homeRoute);

// Register route -------
app.use(registerRoute);

// Logout route ---------
app.use(logoutRoute);

// Dashboard route ------
app.use(dashboardRoute);

// Datasets route -------
app.use(datasetsRoute);

// Pipelines route ------
app.use(pipelinesRoute);

// Functions route ------
app.use(functionsRoute);

// Monitoring route -----
app.use(monitoringRoute);

// Visualization route --
app.use(visualizationRoute);

// Messaging route ------
app.use(messagesRoute);

// 404 route ------------
app.use(route404);

// Github OAuth route ---
app.use(githubAuth);

server.listen(PORT, function () {
    //console.log('[INFO] Started on port 5400');
    console.log(success(time() + "[INFO]") + " Started on port 5400");
});