var express = require('express');
var router = express.Router();
var neroDAO = require('../models/neroDAO');

router.post('/:patientId/test', function(req, res, next){
    neroDAO.postTest(req.params.patientId, req.params.neroId, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        console.log(req.body);
        res.send({status: "ok"});
    }, next);
});

module.exports = router;