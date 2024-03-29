const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const Dataset = require('../models/Dataset');
const {ORCHESTRATOR_INGESTION_URL} = require("../config/config");

router.route("/ingestion")
    .get(async(req,res) => {

        const username = req.session.user;
        
        // Get all datasets from database
        try {
            var datasets = await Dataset.find({user: username});
        } catch (err) {
            console.log(err);
        }
        
        const organization = req.session.organization;
        const property = req.session.property;
        const image = req.session.image;

        res.render("ingestion", {user:username, org:organization, prop:property, img:image, datasets:datasets});
        
    })

router.route("/collected")
    .get(async(req,res) => {

        const username = req.session.user;
        
        // Get all datasets from database
        try {
            var datasets = await Dataset.find({user: username});
        } catch (err) {
            console.log(err);
        }

        const organization = req.session.organization;
        const property = req.session.property;
        const image = req.session.image;

        res.render("collected", {user:username, org:organization, prop:property, img:image, datasets:datasets});

    })

router.route("/datasets/collect")
    .post((req,res) => {

        let ingestion = req.body;

        // Create datetime
        const d = new Date();
        const date = ('0'+d.getDate()).slice(-2) + "-" + ('0'+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear();
        const time = ('0'+d.getHours()).slice(-2) + ":" + ('0'+d.getMinutes()).slice(-2) + ":" + ('0'+d.getSeconds()).slice(-2) + ":" + d.getMilliseconds()

        const datetime = date + " " + time;

        // Data structure 
        let data = {
            "testing":false,
            "ingestion-datetime": datetime,
            "diastema-token": "diastema-key",
            "ingestion-id": ingestion.generated_id,
            "database-id": req.session.organization.toLowerCase(),
            "user": req.session.user,
            "dataset-label": ingestion.label
        }
        delete ingestion.generated_id;
        delete ingestion.label;
        data["ingestion_json"] = ingestion;

        // Save data to MongoDB
        const dataset = new Dataset ({
            label: data["dataset-label"],
            ingestationId: data["ingestion-id"],
            ingestionDateTime: data["ingestion-datetime"],
            organization: data["database-id"],
            user: data.user,
            requestData: data["ingestion_json"]
        });
        dataset.save()
        console.log("[INFO] Dataset saved to MongoDB");

        // Send data to Orchestrator
        fetch(ORCHESTRATOR_INGESTION_URL, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(res => {
            console.log("[INFO] Ingestion data sent to orchestrator");
            console.log("[INFO] Response status from orchestrator:", res.status);
        });

        res.sendStatus(200);
    })

// Get response to display in UI
router.route("/datasets/test")
    .post((req,res) => {

        // Create datetime
        const d = new Date();
        const date = ('0'+d.getDate()).slice(-2) + "-" + ('0'+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear();
        const time = ('0'+d.getHours()).slice(-2) + ":" + ('0'+d.getMinutes()).slice(-2) + ":" + ('0'+d.getSeconds()).slice(-2) + ":" + d.getMilliseconds()

        const datetime = date + " " + time;

        let ingestion = JSON.parse(req.body.body)

        let data = {
            "testing":true,
            "ingestion-datetime": datetime,
            "diastema-token": "diastema-key",
            "ingestion-id": ingestion.generated_id,
            "database-id": req.session.organization.toLowerCase(),
            "user": req.session.user,
            "dataset-label": ingestion.label
        }
        delete ingestion.generated_id;
        delete ingestion.label;
        data["ingestion_json"] = ingestion;

        fetch(ORCHESTRATOR_INGESTION_URL, {
            method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(data)
        })
        // Get response from Orchestrator
        .then(res => {

            // Get type of data
            //const respType = res.headers.get("content-type");
            
            if (res.status === 200) {
                return {status:200, ans:res.text()}
            } else if (res.status === 400) {
                return {status:400, ans:res.text()}
            }
        })
        // Send data to interface
        .then(async data => {
            const ans = await data.ans;

            if (data.status === 200) {
                req.io.sockets.emit("JsonViewer", {type:"text", data:ans});
            } else if (data.status === 400) {
                req.io.sockets.emit("BadURL", ans);
            }
        })
        .catch(err => {
            console.log(err)
            req.io.sockets.emit("BadURL", "There was an error with your request! Please try again");
        });
    });

// Get datasets that have features added to them
router.route("/datasets/ready")
    .get(async (req,res) => {
            
            let readySets = [];

            try {
                // Get all datasets from database
                var datasets = await Dataset.find({user: req.session.user});

                // Check if dataset has features
                datasets.forEach(set => {
                    if (set['_doc'].features) {
                        readySets.push(set);
                    }
                })
            } catch (err) {
                console.log(err);
            }
    
            res.send(readySets);
    })

// Get the features of the requested dataset
router.route("/datasets/features")
    .post(async (req,res) => {
            
            let dataset = req.body.dataset;

            try {
                var resp = await Dataset.find({label: dataset}, {features: 1})
                var features = resp[0]['_doc'].features;
            } catch (err) {
                console.log(err);
            }
    
            res.send(features);
    })

module.exports = router;