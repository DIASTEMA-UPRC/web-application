//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const socketio = require('socket.io');
const MongoStore = require('connect-mongo');
const mongoose = require("mongoose");
const http = require("http");
const session = require('express-session');
const path = require('path');

const { MONGO_URL, PORT} = require("./config/config");

// Database connection -----------------------------------------------------------------------------
mongoose.set('strictQuery', false);
try {
    mongoose.connect(MONGO_URL + "UIDB");
} catch (error) {
    console.log(error);
}

// Routes imports ----------------------------------------------------------------------------------
const homeRoute = require('./routes/homeRoute');
const registerRoute = require('./routes/registerRoute');
const logoutRoute = require('./routes/logoutRoute');
const dashboardRoute = require('./routes/dashboardRoute');
const datasetsRoute = require('./routes/datasetsRoute');
const pipelinesRoute = require('./routes/pipelinesRoute');
const functionsRoute = require('./routes/functionsRoute');
const modelsRoute = require('./routes/modelsRoute');
const visualizationRoute = require('./routes/visualizationRoute');
const messagesRoute = require('./routes/messagesRoute');
const route404 = require('./routes/404Route');
const githubAuth = require('./routes/githubAuth');
const getFileRoute = require('./routes/getFileRoute');
// -------------------------------------------------------------------------------------------------

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware ----------------------------------
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); 
app.use(express.static("public"));
app.use('/vis',express.static(path.join(__dirname, 'public/downloads/vis')));
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

// Models route ---------
app.use(modelsRoute)

// Visualization route --
app.use(visualizationRoute);

// Get file route -------
app.use(getFileRoute);

// Messaging route ------
app.use(messagesRoute);

// 404 route ------------
app.use(route404);

// Github OAuth route ---
app.use(githubAuth);

server.listen(PORT, function () {
    console.log('[INFO] Started on port 5400');
});