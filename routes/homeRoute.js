const express = require('express');
const router = express.Router();
const crypto = require('node:crypto');

const User = require('../models/User');

router.route("/")
    .get((req,res) => {

        if (req.session.user) {
            res.redirect("/dashboard");
        } else {
            res.render("login", {flag:false});
        }
    })
    .post((req,res) => {
        req.body.password = crypto.createHash('sha256').update(req.body.password).digest('hex');
        
        // Search for existing user with given username and password ----------------------
        User.find({username:req.body.username, password:req.body.password}, (err,data) => {
            if (err) {
                console.log(err);
            } else {
                
                if (data.length === 0) {
                    console.log('[ERROR] Login failed: No user found');
                    res.render("login", {flag:true});
                } else {

                    req.session.user = req.body.username;
                    req.session.organization = data[0].organization;
                    req.session.property = data[0].property;
                    req.session.email = data[0].email;
                    // req.session.image = data[0].image;
                    req.session.image = "/uploads/default.png";

                    res.redirect("/dashboard");
                }
            }
        });
    });

module.exports = router;