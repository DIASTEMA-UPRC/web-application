//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const socketio = require('socket.io');
const MongoStore = require('connect-mongo');
const mongoose = require("mongoose");
const http = require("http");
const session = require('express-session');

const { MONGO_URL, PORT, ORCHESTRATOR_URL, ORCHESTRATOR_INGESTION_URL } = require("./config/config");

// Database connection -----------------------------------------------------------------------------
mongoose.connect(MONGO_URL + "UIDB");

// Routes imports ----------------------------------------------------------------------------------
const homeRoute = require('./routes/homeRoute');
const registerRoute = require('./routes/registerRoute');
const logoutRoute = require('./routes/logoutRoute');
const dashboardRoute = require('./routes/dashboardRoute');
const datasetsRoute = require('./routes/datasetsRoute');
const pipelinesRoute = require('./routes/pipelinesRoute');
const modellingRoute = require('./routes/modellingRoute');
const functionsRoute = require('./routes/functionsRoute');
const monitoringRoute = require('./routes/monitoringRoute');
const visualizationRoute = require('./routes/visualizationRoute');
const messagesRoute = require('./routes/messagesRoute');
const route404 = require('./routes/404Route');
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

// Modelling route ------
app.use(modellingRoute);

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

server.listen(PORT, function () {
    console.log('Started on port 5400');
});