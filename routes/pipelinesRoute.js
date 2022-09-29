const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const Pipeline = require("../models/Graph");
const Graph = require("../models/Graph");
const CustomFunction = require("../models/CustomFunction");

const {VALIDATION_URL} = require("../config/config");

router.route("/pipelines")
    .get(async(req,res) => {

        const username = req.session.user;

        // Get all pipelines from database
        try {
            var pipelines = await Pipeline.find({"metadata.user": username});
        } catch (err) {
            console.log(err);
        }

        const organization = req.session.organization;
        const property = req.session.property;
        const image = req.session.image;

        res.render("pipelines", {user:username, org:organization, prop:property, img:image, pipelines:pipelines});
    });

router.route("/pipelines/save")
    .post(async (req,res) => {

        let data = req.body;

        // Check if pipeline with same name exists
        let name = data["analysis-name"];
        try {
            var dup = await Pipeline.find({name: name});
        } catch (err) {
            console.log(err);
        }

        // If there is a duplicate, return error
        if (dup.length > 0) {
            res.status(400).send('DUP');
            
        // If there is no duplicate, save pipeline
        } else {
            const graph = new Graph ({
                analysisid: data["analysis-id"],
                name: data["analysis-name"],
                databaseid: data["database-id"],
                jobs: data.jobs,
                metadata: data.metadata,
                nodes: data.nodes,
                connections: data.connections
            });
    
            graph.save()
    
            console.log("[INFO] Pipeline saved to MongoDB");
            res.status(200).send('OK');
        }
    })

router.route("/pipelines/delete")
    .post((req,res)=>{
    
        let id = req.body.id;
    
        Graph.findOneAndRemove({ analysisid: id })
        .then((func) => {
            if (!func) {
                console.log("[ERROR] Pipeline not found");
                res.status(400).send(id + ' was not found');
            } else {
                console.log("[INFO] Pipeline deleted from MongoDB");
                res.sendStatus(200);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    })

router.route("/pipelines/validate")
    .post(async (req,res) => {

        let data = req.body;

        try {
            let resp = await fetch(VALIDATION_URL, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            let result = await resp;
            let text = await result.text();

            res.status(result.status).send(text);

        } catch (error) {
            console.log("[ERROR] Validation failed");
            console.log(error);
        }
    
    })

router.route("/modelling")
    .get(async(req,res) => {

        // Get all functions from database
        try {
            var functions = await CustomFunction.find();
        } catch (err) {
            console.log(err);
        }

        const username = req.session.user;
        const image = req.session.image;
        const id = Math.random().toString(16).slice(2);
        const organization = req.session.organization;

        res.render("modelling", {user:username,img:image, id:id, functions:functions, org:organization});
    });


module.exports = router;