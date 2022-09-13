const express = require('express');
const router = express.Router();

const Pipeline = require("../models/Graph");
const CustomFunction = require("../models/CustomFunction");

router.route("/pipelines")
    .get(async(req,res) => {

        // Get all pipelines from database
        try {
            var pipelines = await Pipeline.find();
        } catch (err) {
            console.log(err);
        }

        const username = req.session.user;
        const organization = req.session.organization;
        const property = req.session.property;
        const image = req.session.image;

        res.render("pipelines", {user:username, org:organization, prop:property, img:image, pipelines:pipelines});
    });

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

        res.render("modelling", {user:username,img:image, id:id, functions:functions});
    });


module.exports = router;