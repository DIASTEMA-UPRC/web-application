const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const Graph = require("../models/Graph");
const {ORCHESTRATOR_URL, NORMALIZATION_URL} = require("../config/config");

router.route("/messages")
    .post((req,res) => {
        let data = req.body;

        switch (data.message) {

            case "update":
                req.io.sockets.emit("Modeller", data.update);
                res.sendStatus(200);
                break;

            case "save-complex":

                console.log(NORMALIZATION_URL);

                fetch(NORMALIZATION_URL, {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data.info)
                }).then(res => {
                    return res.json();
                }).then((result)=> {
                    res.send(result);
                }).catch(error => console.warn(error));
                break;

            case "send-to-orchestrator":

                fetch(ORCHESTRATOR_URL, {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data.info)
                }).then(res => {
                    console.log("[INFO] Pipeline deployed to orchestrator");
                    console.log("[INFO] Response status from orchestrator:", res.status);
                });

                res.sendStatus(200);
                break;

            case "save-graph":

                const graph = new Graph ({
                    user: data.info.metadata.user,
                    name: data.info["analysis-name"],
                    analysisid: data.info["analysis-id"],
                    datetime: data.info["analysis-datetime"],
                    jobs: data.info.jobs,
                    nodes: data.info.nodes,
                    connections: data.info.connections
                });
        
                graph.save()

                console.log("[INFO] Graph saved to MongoDB");

                break;
            
            case "visualize":
                req.io.sockets.emit("Modeller", "Data ready for visualization, visit the Dashboard");
                res.sendStatus(200); 
                break;

            default:
                console.log("[INFO] No data recieved");
                res.sendStatus(500);
                break;
        }
    });

module.exports = router;