const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const Dataset = require('../models/Dataset');
const {ORCHESTRATOR_INGESTION_URL} = require("../config/config");

router.route("/datasets")
    .get((req,res) => {

        const username = req.session.user;
        const organization = req.session.organization;
        const property = req.session.property;
        const image = req.session.image;

        res.render("datasets", {user:username, org:organization, prop:property, img:image});
        
    })
    .post((req,res) => {

        let ingestion = req.body;

        // Create datetime
        const d = new Date();
        const date = ('0'+d.getDate()).slice(-2) + "-" + ('0'+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear();
        const time = ('0'+d.getHours()).slice(-2) + ":" + ('0'+d.getMinutes()).slice(-2) + ":" + ('0'+d.getSeconds()).slice(-2) + ":" + d.getMilliseconds()

        const datetime = date + " " + time;

        // Data structure 
        let data = {
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
        console.log("[INFO] Dataset metadata saved to MongoDB!");

        //Send data to Orchestrator
        fetch(ORCHESTRATOR_INGESTION_URL, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(res => {
            console.log("[INFO] Ingestion data sent to orchestrator!", res);
        });

        res.redirect("/datasets");
    });

// Get response to display in UI
router.route("/datasets/test")
    .post((req,res) => {

        const data = req.body.data

        const method = data.method
        const url = data.url
        const body = data.body_val
        const headers = data.headers

        console.log(data);

        // Switch between HTTP methods
        switch(method) {

            case "GET":
                fetch(url, {
                    method: method,
                    headers: headers
                })
                .then(res => res.json())
                .then(json => {

                    console.log("[INFO] - Got data from url:", url);
                    jsonview = JSON.stringify(json);

                    req.io.sockets.emit("JsonViewer", jsonview);
                })
                .catch(err => {
                    console.log(err)
                    req.io.sockets.emit("BadURL", "There was an error with your request! Please try again later");
                });

                break;

            case "POST":
                fetch(url, {
                    method: method,
                    headers: headers,
                    body: body
                })
                .then(res => res.json())
                .then(json => {
                    console.log("[INFO] - Got data from url:", url);
                    jsonview = JSON.stringify(json);

                    req.io.sockets.emit("JsonViewer", jsonview);
                })
                .catch(err => {
                    console.log(err)
                    req.io.sockets.emit("BadURL", "There was an error with your request! Please try again later");
                });

                break;

            default:
                req.io.sockets.emit("BadURL", "Method not supported yet!");
                console.log("[ERROR] Method not supported!");
                break;
        }
    });

module.exports = router;