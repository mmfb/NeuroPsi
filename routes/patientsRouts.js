var express = require('express');
var router = express.Router();
var neroDAO = require('../models/neroDAO');
var patientsDAO = require('../models/patientsDAO');

router.get('/:patientId', function(req, res, next){
    neroDAO.getPatientInfo(req.params.patientId, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(200).send(result);
    }, next)
});

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

router.get('/:patientId/tests/pending', function(req, res, next){
    patientsDAO.searchPendingTests(req.params.patientId, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(200).send(result);
    }, next);
});

router.post('/:patientId/tests/:testId/replay', function(req, res, next) {
    patientsDAO.saveReplay(req.params.testId, req.body, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.send({status: "Ok"});
    }, next);
});

router.post('/:patientId/tests/:testId/routes', function(req, res, next){
    patientsDAO.saveRoute(req.params.testId, req.body.waypoints, req.body.time, req.body.distance, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.send({status: "Ok"});
    }, next);
});

router.get('/:patientId/tests/completed/replay', function(req, res, next) {
    neroDAO.getReplay(req.params.patientId, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(200).send(result);
    })
});

module.exports = router;