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
    .get(async (req,res) => {
        
        // Get all functions from database
        try {
            var functions = await CustomFunction.find();
        } catch (err) {
            console.log(err);
        }

        const username = req.session.user;
        const image = req.session.image;
        const id = Math.random().toString(16).slice(2);

        res.render("function-modelling", {user:username,img:image, id:id, functions:functions});
    });

router.route("/functions/save")
    .post((req,res)=>{

        let data = req.body;

        console.log(data);

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
        res.sendStatus(200);
    })

router.route("/functions/delete")
.post((req,res)=>{

    console.log(req.body);

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