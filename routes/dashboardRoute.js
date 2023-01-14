const express = require('express');
const router = express.Router();

const CustomFunction = require("../models/CustomFunction");
const Pipeline = require("../models/Graph");
const Dataset = require('../models/Dataset');

router.route("/dashboard")
    .get(async (req,res) => {

        const username = req.session.user;
        
        // Get all functions from database
        try {
            var functions = await CustomFunction.find({"metadata.user": username});
        } catch (err) {
            console.log(err);
        }

        // Get all pipelines from database
        try {
            var pipelines = await Pipeline.find({"metadata.user": username});
        } catch (err) {
            console.log(err);
        }

        // Get all datasets from database
        try {
            var datasets = await Dataset.find({user: username});
        } catch (err) {
            console.log(err);
        }

        // Get all completed pipelines (results) from database
        try {
            var results = await Pipeline.find({"metadata.user": username, status: "completed"});
        } catch (err) {
            console.log(err);
        }

        const organization = req.session.organization;
        const property = req.session.property;
        const image = req.session.image;

        res.render("dashboard", {
            user:username, 
            org:organization, 
            prop:property, 
            img:image,
            pipelines:pipelines,
            functions:functions,
            datasets:datasets,
            results:results
        });
    })

module.exports = router;