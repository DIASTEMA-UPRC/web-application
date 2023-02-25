const express = require('express');
const router = express.Router();
const path = require('path');

router.route("/file/:id/:name")
    .get(async (req,res) => {

        const id = req.params.id;
        const name = req.params.name;

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(1700) // waiting 1.7 second.
        
        res.sendFile(name, { root: path.join(__dirname, '../public/downloads/vis/'+id) });
    });

module.exports = router;