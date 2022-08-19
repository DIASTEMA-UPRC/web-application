const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} = require("../config/config");

router.route("/api/auth/github")
    .get((req,res) => {

        //Get the temp code from the request
        const code = req.query.code;
        if (!code) {
            res.redirect("/");
        }

        console.log("[INFO] - Got the temp code: " + code);

        const url = "https://github.com/login/oauth/access_token?client_id="+GITHUB_CLIENT_ID+"&client_secret="+GITHUB_CLIENT_SECRET+"&code="+code;

        //Get the access token from github
        fetch(url, {
            method: 'POST',
            headers: { 'Accept': 'application/json' }
        }).then(res => res.json())
          .then(json => {
            const token = json.access_token;
            console.log("[INFO] - Got the access token: " + token);

            //Get the user data from github
            fetch("https://api.github.com/user", {headers: { 'Authorization': 'token ' + token }})
                .then(res => res.json())
                .then(json => {
                    console.log("[INFO] - Got github data for user: " + json.login);

                    req.session.user = json.login;
                    req.session.organization = json.company;
                    req.session.property = "";
                    req.session.email = json.email;
                    req.session.image = json.avatar_url;

                    res.redirect("/dashboard");
                });
        });

    });

module.exports = router;