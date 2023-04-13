const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const SavedModel = require("../models/SavedModel");

const downLimit = 10;

const {RUNTIME_MANAGER_URL,MODELS_API_HOST, MODELS_API_PORT} = require("../config/config");

router.route("/savedmodels")
    .get(async(req,res) => {

        const username = req.session.user;

        // Get all models from database
        try {
            var models = await SavedModel.find({"metadata.user": username});
        } catch (err) {
            console.log(err);
        }

        const organization = req.session.organization;
        const property = req.session.property;
        const image = req.session.image;

        res.render("savedmodels", {user:username, org:organization, prop:property, img:image, models:models});
    });

router.route("/savedmodels/start")
    .post(async (req,res) => {

        let id = req.body.id;

        try {
            let request = await fetch(`${RUNTIME_MANAGER_URL}/start/${id}`);
            let response = await request

            // If Runtime Manager is available, check MongoDB for model status
            if (response.status === 200) {

                let seconds = 0;
                
                let interval = setInterval( async () => {

                    seconds += 2;
                                        
                    // Check mongodb for status
                    try {
                        var model = await SavedModel.find({"job-id": id});
                        var state = model[0].state;
    
                        console.log(`Model ${id} state: ${state}`);
                    } catch (err) {
                        console.log(err);
                    }
    
                    // If model is running, stop the interval
                    if (state === 'Running') {
                    
                        console.log(`[INFO] Model ${id} is running`);
                        clearInterval(interval);
    
                        res.status(200).send("OK");
                    }

                    // If model is still down after 10 seconds, stop the interval
                    if (state === 'Down' && seconds > downLimit) {
                        console.log(`[INFO] Model ${id} took too long to start, cancelling.`);
                        clearInterval(interval);

                        res.status(500).send(`Model ${id} took too long to start, please try again.`);
                    }

                }, 2000);

            } else {
                res.status(500).send(`Model ${id} is not available, please try again later.`);
            }


        } catch (error) {
            console.log("[ERROR] Runtime Manager is not available");
            console.log(error);

            res.status(500).send('Service is temporarily unavailable, please try again later.');
        }
    })

router.route("/savedmodels/kill")
    .post(async (req,res) => {
    
        let id = req.body.id;
    
        try {
            let request = await fetch(`${RUNTIME_MANAGER_URL}/stop/${id}`);
            let response = await request

            // If Runtime Manager is available, check MongoDB for model status
            if (response.status === 200) {

                let seconds = 0;
                
                const interval = setInterval( async () => {

                    seconds += 2;
                                        
                    // Check mongodb for status
                    try {
                        var model = await SavedModel.find({"job-id": id});
                        var state = model[0].state;
    
                        console.log(`Model ${id} state: ${state}`);
                    } catch (err) {
                        console.log(err);
                    }
    
                    // If model is down, stop the interval
                    if (state === 'Down') {
                        console.log(`[INFO] Model ${id} is down`);
                        clearInterval(interval);
    
                        res.status(200).send("OK");
                    }

                    // If model is still down after 10 seconds, stop the interval
                    if (state === 'Down' && seconds > downLimit) {
                        console.log(`[INFO] Model ${id} took too long to stop, cancelling.`);
                        clearInterval(interval);

                        res.status(500).send(`Model ${id} took too long to stop, please try again.`);
                    }
                    
                }, 2000);

            } else {
                res.status(500).send(`Model ${id} is not available, please try again later.`);
            }
           

        } catch (error) {
            console.log("[ERROR] Runtime Manager is not available");
            console.log(error);

            res.status(500).send('Error: ' + error);
        }
    })

router.route("/savedmodels/dummy")
    .get(async (req,res) => {
        res.status(200).send("OK")
    });

module.exports = router;