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
        
        // Get visualization info from the database
        try {
            const resp = await Pipeline.find({'metadata.user':username, analysisid:id});
            var nodes = resp[0]['_doc']['visualization']
        } catch (err) {
            console.log(err);
        }

        // Loop through each visualization node
        // 1. Get the node's urls
        // 2. Add the urls to the urls array
        let urls = []
        try {
            Object.keys(nodes).forEach(node => {
                urls.push(node)
                urls = [...urls, ...nodes[node]]
            });    
        } catch (error) {
            req.io.sockets.emit("VisResultsError", 'No visualization data found');
            return
        }

        // Loop through each url and get a signed url
        // 1. Get the organization name from the url
        // 2. Get the file name from the url
        // 3. Get a signed url for the file
        // 4. Add the signed url to the signedUrls array
        let signedUrls = []
        let visid;
        for (let i = 0; i < urls.length; i++) {
            const path = urls[i];
            
            if (!path.includes('/')) {
                visid = randomUUID().replace(/-/g, '').replace(/[0-9]/g, '');
                signedUrls.push(path + ' ' + visid)
                continue
            }

            // Get the organization, filename and path from the url
            const org = path.slice(0, path.indexOf('/'))
            const name = (path.split('/')[3]).slice(14, path.split('/')[3].length-5)
            const url = path.slice(path.indexOf('/') + 1);

            // Get a signed url for the file
            try {
                const signedUrl = await minioClient.presignedUrl('GET', org, url, 30*60)
                signedUrls.push({signedUrl, name, visid})
            
            } catch (error) {
                console.log(error);
            }
        }
        
        req.io.sockets.emit("VisResults", {signedUrls});
    })

module.exports = router;