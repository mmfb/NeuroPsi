var express = require("express");
var router = express.Router();
var patientsDAO = require("../models/patientsDAO");

router.get('/', function(req, res, next){
    patientsDAO.getPatients(function(result){
        res.send(result);
    })
});

module.exports = router;