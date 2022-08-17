const express = require('express');
const router = express.Router();

router.route("/modelling")
    .get((req,res) => {

        //req.session.analysisid = Math.random().toString(16).slice(2);

        const username = req.session.user;
        const image = req.session.image;
        const id = Math.random().toString(16).slice(2);

        res.render("modelling", {user:username,img:image, id:id});
    });

module.exports = router;