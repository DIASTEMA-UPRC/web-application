//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const socketio = require('socket.io');
const MongoStore = require('connect-mongo');
const mongoose = require("mongoose");
let crypto = require('node:crypto');
const http = require("http");
const session = require('express-session');
const fetch = require('node-fetch');
const { MONGO_URL, PORT, ORCHESTRATOR_URL, ORCHESTRATOR_INGESTION_URL } = require("./config/config");

// Database connection -------------------------------------------------------------------------------------
mongoose.main = mongoose.createConnection(MONGO_URL + "UIDB");

const userSchema = require('./models/User');
const User = mongoose.main.model("User", userSchema);

const graphSchema = require('./models/Graph');
const Graph = mongoose.main.model("Graph", graphSchema, "graphs");

const datasetSchema = require('./models/Dataset');
const Dataset = mongoose.main.model("Dataset", datasetSchema, "datasets");
// -----------------------------------------------------------------------------------------------------------

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware ----------------
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

// Home route -----------------------------------------------------------------------------------------------------------
app.route("/")
    .get((req,res) => {

        if (req.session.user) {
            res.redirect("/dashboard");
        } else {
            res.render("login");
        }
    })
    .post((req,res) => {
        req.body.password = crypto.createHash('sha256').update(req.body.password).digest('hex');
        
        User.find({username:req.body.username, password:req.body.password}, (err,data) => {
            if (err) {
                console.log(err);
            } else {
                if (data.length === 0) {
                    console.log('[INFO] No user found');
                    res.redirect("/");
                } else {

                    req.session.user = req.body.username;
                    req.session.organization = data[0].organization;

                    res.redirect("/dashboard");
                }
            }
        });
    });

// Register route -----------------------------------------------------------------------------------------------------------
app.route("/register")
    .get((req,res) => {
        res.render("register");
    })
    .post((req,res) => {
        req.body.password = crypto.createHash('sha256').update(req.body.password).digest('hex');

        const user = new User ({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            organization: req.body.organization,
            property: req.body.property
        });

        user.save();

        res.redirect("/")
    });

// Logout route -------------------------------------------------------------------------------------------------------------
app.route("/logout")
    .get((req,res) => {
        req.session.destroy((err) => {
            if (err) throw err;
            res.redirect("/")
        });
    });

app.route("/dashboard")
    .get((req,res) => {
        res.render("dashboard");
    })

app.route("/pipelines")
.get((req,res) => {
    res.render("pipelines");
})

server.listen(PORT, function () {
    console.log('Started on port 5400');
});