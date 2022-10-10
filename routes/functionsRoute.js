const express = require('express');
const router = express.Router();

const CustomFunction = require("../models/CustomFunction");

router.route("/functions")
    .get(async (req,res) => {

        const username = req.session.user;

        // Get all functions from database
        try {
            var functions = await CustomFunction.find({"metadata.user": username});
        } catch (err) {
            console.log(err);
        }

        const organization = req.session.organization;
        const property = req.session.property;
        const image = req.session.image;

        res.render("functions", {user:username, org:organization, prop:property, img:image, functions:functions});
    });

router.route("/function-modelling")
    .get(async (req,res) => {
        
        const username = req.session.user;
        
        // Get all functions from database
        try {
            var functions = await CustomFunction.find({"metadata.user": username});
        } catch (err) {
            console.log(err);
        }

        const image = req.session.image;
        const id = Math.random().toString(16).slice(2);

        res.render("function-modelling", {user:username,img:image, id:id, functions:functions});
    });

router.route("/functions/save")
    .post(async (req,res)=>{

        let data = req.body;

        // Check if function with same name exists
        let name = data.name;
        try {
            var dup = await CustomFunction.find({name: name});
        } catch (err) {
            console.log(err);
        }

        // If there is a duplicate, return error
        if (dup.length > 0) {
            res.status(400).send('DUP');
        
        // If there is no duplicate, save pipeline
        } else {
            const func = new CustomFunction ({
                function_id: data.function_id,
                name: data.name,
                output_type: data.output_type,
                color: data.color,
                args: data.args,
                expression: data.expression,
                metadata: data.metadata,
                nodes: data.nodes,
                connections: data.connections
            });
    
            func.save()
    
            console.log("[INFO] Function saved to MongoDB");
            res.status(200).send('OK');
        }
    })

router.route("/functions/delete")
    .post((req,res)=> {

        let id = req.body.id;

        CustomFunction.findOneAndRemove({ function_id: id })
        .then((func) => {
            if (!func) {
                res.status(400).send(id + ' was not found');
            } else {
                console.log("[INFO] Function deleted from MongoDB");
                res.sendStatus(200);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    })

router.route("/functions/get/:name")
    .get(async (req,res)=>{
        
        let name = req.params.name;

        // Get desired function from database
        try {
            var func = await CustomFunction.find({name:name});
        } catch (err) {
            console.log(err);
        }

        res.send(func[0]);
    })

module.exports = router;