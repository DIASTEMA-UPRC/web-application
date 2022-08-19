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

        // Generate ingestion id
        const id = Math.random().toString(16).slice(2);

        // Create datetime
        const d = new Date();
        const date = ('0'+d.getDate()).slice(-2) + "-" + ('0'+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear();
        const time = ('0'+d.getHours()).slice(-2) + ":" + ('0'+d.getMinutes()).slice(-2) + ":" + ('0'+d.getSeconds()).slice(-2) + ":" + d.getMilliseconds()

        const datetime = date + " " + time;

        // Data structure 
        const data = {
            "ingestion-datetime": datetime,
            "diastema-token": "diastema-key",
            "ingestion-id": id.toLowerCase(),
            "database-id": req.session.organization.toLowerCase(),
            "method": req.body.method,
            "link": req.body.link,
            "token": req.body.token,
            "dataset-label": req.body.label.toLowerCase(),
            "user": req.session.user
        }

        // Save data to MongoDB
        const dataset = new Dataset ({
            label: data["dataset-label"],
            ingestationId: data["ingestion-id"],
            ingestionDateTime: data["ingestion-datetime"],
            organization: data["database-id"],
            user: data.user,
            method: data.method,
            link: data.link,
            token: data.token
        });
        dataset.save()
        console.log("[INFO] Dataset information saved to MongoDB!");

        // Send data to Orchestrator
        fetch(ORCHESTRATOR_INGESTION_URL, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(res => {
            console.log("[INFO] Ingestion data sent to orchestrator!", res);
        });

        res.redirect("/datasets");
    });

module.exports = router;