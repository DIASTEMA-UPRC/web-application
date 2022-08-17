const express = require('express');
const router = express.Router();
const crypto = require('node:crypto');
const multer = require('multer');
const path = require('path');

// Upload files info ---------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage:storage});

// Database model ---------------------
const User = require('../models/User');

router.route("/register")
    .get((req,res) => {
        res.render("register", {flag:false});
    })
    .post(upload.single("inpFile"), (req,res) => {

        req.body.password = crypto.createHash('sha256').update(req.body.password).digest('hex');

        // Search for existing users with given username and email ------------------
        User.find({username:req.body.username, email:req.body.email}, (err,data) => {
            if (err) {
                console.log(err);
            } else {
                
                if (data.length === 0) {
                    console.log('[INFO] Register success: No user found');

                    let image = 'default.png';
                    if (req.file) {
                       image = req.file.filename;
                    }

                    const user = new User ({
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password,
                        organization: req.body.organization,
                        property: req.body.property,
                        image:image
                    });
            
                    user.save();

                    res.redirect("/");
                } else {

                    console.log('[ERROR] Register failed: User exists');
                    res.render("register", {flag:true});
                }
            }
        });
    });

module.exports = router;