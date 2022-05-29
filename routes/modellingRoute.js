const express = require('express');
const router = express.Router();

router.route("/modelling")
    .get((req,res) => {

        //req.session.analysisid = Math.random().toString(16).slice(2);

        const username = req.session.user;
        const id = Math.random().toString(16).slice(2);

        res.render("modelling", {user:username, id:id});
    });

module.exports = router;