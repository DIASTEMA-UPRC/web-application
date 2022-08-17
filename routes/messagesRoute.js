const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const Graph = require("../models/Graph");
const {ORCHESTRATOR_URL} = require("../config/config");

router.route("/messages")
    .post((req,res) => {
        let data = req.body;

        switch (data.message) {

            case "update":
                req.io.sockets.emit("Modeller", data.update);
                res.sendStatus(200);
                break;

            case "send-to-orchestrator":
                console.log("[INFO] Backend got the data");

                fetch(ORCHESTRATOR_URL, {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data.info)
                }).then(res => {
                    console.log("[INFO] Graph data sent to orchestrator!", res);
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