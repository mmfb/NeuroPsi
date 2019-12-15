var express = require("express");
var router = express.Router();
var neroDAO = require("../models/neroDAO");

router.get('/:neroId/patients', function(req, res, next){
    neroDAO.getNeroPatients(req.params.neroId, function(err, result){
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
    neroDAO.register(register, function(result){
        res.writeHead(200, {'Content-Type':'application/json'});
        res.send(result);
    }, next);
});

module.exports = router;