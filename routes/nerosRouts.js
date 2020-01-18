
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

router.get('/:neroId/patients/:patientId/tests', function(req, res, next){
    neroDAO.getPatientTests(req.params.neroId, req.params.patientId, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(200).send(result);
    }, next);
})

router.get('/:neroId/patients/tests/routes', function(req, res, next){
    neroDAO.getNeuroTestsRoutes(req.params.neroId, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(200).send(result);
    }, next);
})

module.exports = router;