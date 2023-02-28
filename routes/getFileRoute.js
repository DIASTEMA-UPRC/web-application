const express = require('express');
const router = express.Router();
const path = require('path');
const minioClient = require('../middleware/minio-connect');

router.route("/file/:id/:name/:bucket/:jobid")
    .get(async (req,res) => {

        const id = req.params.id;
        const name = req.params.name;
        const bucket = req.params.bucket;
        const jobid = req.params.jobid;
        const url = jobid+"/"+name

        const dowloadPath = 'public/downloads/vis/'+id+'/'+name

        minioClient.fGetObject(bucket, url, dowloadPath, function(err) {
            if (err) {
              return console.log(err)
            }
            console.log('[INFO] - File from MinIO downloaded successfully')
            res.sendFile(name, { root: path.join(__dirname, '../public/downloads/vis/'+id) });
        })
        
    });

module.exports = router;