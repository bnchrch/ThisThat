var express = require('express');
var router = express.Router();
var db = require('../../../models');
var passwordHash = require('password-hash');
var validator = require('validator');
var authController = require('../../../controllers/auth');

router.post('/', function(req, res) {
    var username = req.body.username;
    var phone_number = req.body.phone_number;
    var password = passwordHash.generate(req.body.password);
    console.log(username);
    console.log(phone_number);

    if(!username || !phone_number || !password){
        res.status(400);
        res.json("missing parameters!\n");
    }

    else{
        var user = db.User.build({
            username: username,
            password: password,
            phone_number: phone_number
        });
        user
            .save()
            .complete(function(err) {
                if (!!err) {
                    console.log('The instance has not been saved:', err);
                    res.status(500);
                    res.json("an error occured while creating user: " + err.detail);
                } else {
                    console.log('user created: ', user);
                    res.status(200);
                    res.json('user created');
                }
            });
    }

});

router.delete('/', authController.isAuthenticated, function(req, res) {
    db
        .User
        .find({ where: { id: req.user.id}})
        .complete(function (err, user) {
            if (!!err) {
                console.log('An error occurred while searching thisthat:', err);
                res.status(500);
                res.json('An error occurred while searching thisthat');
            }
            else {
                user
                    .destroy()
                    .complete(function(err){
                        if(!!err) {
                            console.log(err);
                            res.status(500);
                            res.json('thisthat failed to delete from database');
                        }
                        else {
                            res.status(200);
                            res.json('user deleted');
                        }
                    })


            }

        })


});

module.exports = router;
