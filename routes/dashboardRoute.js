const express = require('express');
const router = express.Router();

const CustomFunction = require("../models/CustomFunction");

router.route("/dashboard")
    .get(async (req,res) => {
        
        // Get all functions from database
        try {
            var functions = await CustomFunction.find();
            var functions_length = functions.length;
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
            functions:functions,
            functions_length:functions_length
        });
    })

module.exports = router;