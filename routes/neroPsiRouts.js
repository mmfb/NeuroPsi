var express = require("express");
var router = express.Router();
var patientsDAO = require("../models/patientsDAO");

router.get('/:neroId/patients', function(req, res, next){
    patientsDAO.getNeroPatients(req.params, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(200).send(result);
    }, next);
});

router.post('/', function(req, res, next){
    var register = req.body;
    patientsDAO.register(register, function(result){
        res.writeHead(200, {'Content-Type':'application/json'});
        res.send(result);
    }, next);
});

module.exports = router;