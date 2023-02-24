const express = require('express');
const router = express.Router();
const minioClient = require('../middleware/minio-connect');
const { randomUUID } = require('crypto');

const Pipeline = require("../models/Graph");

router.route("/visualization")
    .get(async (req,res) => {

        const username = req.session.user;
        
        // Get all completed pipelines from database
        try {
            var analytics = await Pipeline.find({'metadata.user':username, status:'completed'});
        } catch (err) {
            console.log(err);
        }

        const organization = req.session.organization;
        const property = req.session.property;
        const image = req.session.image;

        res.render("visualization", {user:username, org:organization, prop:property, img:image, analytics:analytics});
    });

router.route("/visualization/results/:id")
    .post(async (req,res) => {
        
        const username = req.session.user;
        const id = req.params.id;
        
        // Get visualization nodes from the database
        // Example node object
        // {
        //     'vis-1': [
        //         'diastemaviz/1677234216151/visualization_038df58adc484ccca7dfe64c9b73805c_timeseries_plots.html',
        //         'diastemaviz/1677234216151/visualization_038df58adc484ccca7dfe64c9b73805c_distplots_nums.html'
        //     ]
        // }

        try {
            const resp = await Pipeline.find({'metadata.user':username, analysisid:id});
            var nodes = resp[0]['_doc']['visualization']
        } catch (err) {
            console.log(err);
        }

        // Loop through each visualization node
        // 1. Get the node's urls
        // 2. Add the urls to the urls array
        // Example urls array
        // [
        //     'vis-1',
        //     'diastemaviz/1677234216151/visualization_038df58adc484ccca7dfe64c9b73805c_timeseries_plots.html',
        //     'diastemaviz/1677234216151/visualization_038df58adc484ccca7dfe64c9b73805c_distplots_nums.html',
        //     'vis-2',
        //     'diastemaviz/3474234556151/visualization_038df58adc484ccca7dfe64c9b73805c_timeseries_plots.html'
        // ]

        let urls = []
        try {
            const vis_nodes = Object.keys(nodes)
            vis_nodes.forEach(node => {
                urls.push(node)
                urls = [...urls, ...nodes[node]]
            });    
        } catch (error) {
            console.log("[ERROR] - No visualization data found");
            req.io.sockets.emit("VisResultsError", 'No visualization data found');
            return
        }

        // Loop through each url and get a signed url
        // 1. Check if the url is a visualization node or a file
        // 2. If the url is a visualization node, generate a random visid
        // 3. If the url is a file, get the bucket, filename and path from the url
        // 4. Get a signed url for the file
        // 5. Add the signed url, filename and visid to the signedUrls array
        // Example signedUrls array
        // [
        //     'vis-1 <visid>',
        //     {
        //        signedUrl: 'url',
        //        name: 'filename',
        //        visid: 'visid'
        //     },
        //    'vis-2 <visid-2>',
        //     {
        //        signedUrl: 'url',
        //        name: 'filename',
        //        visid: 'visid-2'
        //     }
        // ]

        let signedUrls = []
        let visid;
        for (let i = 0; i < urls.length; i++) {
            const path = urls[i];
            
            // If the url is a visualization node, generate a random visid
            if (!path.includes('/')) {
                visid = randomUUID().replace(/-/g, '').replace(/[0-9]/g, '');
                signedUrls.push(path + ' ' + visid)
                continue
            }

            // Get the bucket, filename and path from the url
            const bucket = path.slice(0, path.indexOf('/'))
            const name = (path.split('/')[2]).split('_').splice(-2, 2).join('_').split('.')[0]
            const url = path.slice(path.indexOf('/') + 1);

            // Get a signed url for the file
            try {
                const signedUrl = await minioClient.presignedUrl('GET', bucket, url, 30*60)
                signedUrls.push({signedUrl, name, visid})
            
            } catch (error) {
                console.log(error);
            }
        }
        
        // Send the signedUrls array to the client
        req.io.sockets.emit("VisResults", {signedUrls});
    })

router.route("/visualization/performance/:id")
    .post(async (req,res) => {

        const username = req.session.user;
        const id = req.params.id;

        // Get performance and jobs info from the database
        try {
            const resp = await Pipeline.find({'metadata.user':username, analysisid:id});
            var nodes = resp[0]['_doc']['performance'];
            var jobs = resp[0]['_doc']['jobs'];
        } catch (err) {
            console.log(err);
        }

        // Loop through each performance node
        // 1. Get the node's title
        // 2. Add the service information to the services array
        // Example services array
        // [
        //     {
        //         "id":"1677236799757",
        //         "title":"Clustering",
        //         "ram-usage":45,
        //         "ram-existing":3456,
        //         "disk-usage":34,
        //         "execution-speed":2
        //     },
        //     {
        //         "id":"1573438712734",
        //         "title":"Classification",
        //         "ram-usage":21,
        //         "ram-existing":7854,
        //         "disk-usage":21,
        //         "execution-speed":3
        //     }
        // ]
        let services = []
        try {
            const perf_nodes = Object.keys(nodes)
            perf_nodes.forEach(node => {
              
                let title =""
                jobs.forEach(job => {
                    if (node == job.id) {
                        title = job.title;
                    }
                })

                services.push({
                        "id":node,
                        "title":title,
                        "ram-usage":nodes[node]["ram-usage"], 
                        "ram-existing":nodes[node]["ram-existing"], 
                        "disk-usage":nodes[node]["disk-usage"],
                        "execution-speed":nodes[node]["execution-speed"],
                    })

            });
        } catch (error) {
            console.log("[ERROR] - No performance data found");
            req.io.sockets.emit("PerfResultsError", 'No performance data found');
            return
        }

        // Send the services array to the client
        req.io.sockets.emit("PerfResults", {services});

    })

module.exports = router;