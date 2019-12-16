var express = require('express');
var router = express.Router();
var neroDAO = require('../models/neroDAO');

router.post('/:patientId/tests', function(req, res, next){
    neroDAO.postTest(req.body.patientId, req.body.neroId, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.send({status: "ok"});
    }, next);
});

module.exports = router;