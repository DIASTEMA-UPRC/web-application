const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const SavedModel = require("../models/SavedModel");

router.route("/savedmodels")
    .get(async(req,res) => {

        const username = req.session.user;

        // Get all pipelines from database
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

        let data = req.body;

        res.send("http://localhost:5400/savedmodel/" + data.id);

    })

router.route("/savedmodels/delete")
    .post((req,res)=>{
    
        let id = req.body.id;
    
        Pipeline.findOneAndRemove({ analysisid: id })
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

module.exports = router;