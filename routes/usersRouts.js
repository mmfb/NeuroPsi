var express = require('express');
var router = express.Router();
var usersDAO = require('../models/usersDAO');

router.get('/', function(req, res, next){
    console.log(req.query)
    usersDAO.getUser(req.query, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(200).send(result);
    }, next);
});

router.get('/:userId/tests', function(req, res, next){
    usersDAO.getUserTests(req.params.userId, req.query, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(200).send(result);
    }, next);
});

module.exports = router;
