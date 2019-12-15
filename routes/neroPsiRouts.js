var express = require("express");
var router = express.Router();
var patientsDAO = require("../models/patientsDAO");

router.get('/', function(req, res, next){
    patientsDAO.getPatients(function(result){
        res.send(result);
    })
});

router.post('/', function(req, res, next){
    var register = req.body;
    patientsDAO.register(register, function(result){
        res.writeHead(200, {'Content-Type':'application/json'});
        res.send(result);
    }, next);
});

module.exports = router;