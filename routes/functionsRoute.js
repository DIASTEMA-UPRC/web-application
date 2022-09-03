const express = require('express');
const router = express.Router();

const CustomFunction = require("../models/CustomFunction");

router.route("/functions")
    .get((req,res) => {

        CustomFunction.find({}, (err, functions) => {
            if (err) {
                console.log(err);
            } else {

                const username = req.session.user;
                const organization = req.session.organization;
                const property = req.session.property;
                const image = req.session.image;

                res.render("functions", {user:username, org:organization, prop:property, img:image, functions:functions});
            }
        });
    });

router.route("/function-modelling")
    .get((req,res) => {
        
        CustomFunction.find({}, (err, functions) => {
            if (err) {
                console.log(err);
            } else {

                const username = req.session.user;
                const image = req.session.image;
                const id = Math.random().toString(16).slice(2);

                res.render("function-modelling", {user:username,img:image, id:id, functions:functions});
            }
        });
    });

router.route("/functions/save")
    .post((req,res)=>{

        console.log("hey got the func");

        let data = req.body;

        const func = new CustomFunction ({
            function_id: data.function_id,
            name: data.name,
            output_type: data.output_type,
            color: data.color,
            args: data.args,
            expressions: data.expressions,
            metadata: data.metadata,
            nodes: data.nodes,
            connections: data.connections
        });

        func.save()

        console.log("[INFO] Function saved to MongoDB");
    })

module.exports = router;