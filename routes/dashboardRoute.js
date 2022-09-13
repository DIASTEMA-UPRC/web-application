const express = require('express');
const router = express.Router();

const CustomFunction = require("../models/CustomFunction");
const Pipeline = require("../models/Graph");
const Dataset = require('../models/Dataset');

router.route("/dashboard")
    .get(async (req,res) => {
        
        // Get all functions from database
        try {
            var functions = await CustomFunction.find();
        } catch (err) {
            console.log(err);
        }

        // Get all pipelines from database
        try {
            var pipelines = await Pipeline.find();
        } catch (err) {
            console.log(err);
        }

        // Get all datasets from database
        try {
            var datasets = await Dataset.find();
        } catch (err) {
            console.log(err);
        }

        const username = req.session.user;
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
            datasets:datasets
        });
    })

module.exports = router;