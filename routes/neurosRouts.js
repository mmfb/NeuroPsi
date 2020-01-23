
var express = require("express");
var router = express.Router();
var neuroDAO = require("../models/neuroDAO");

router.get('/:neuroId/patients', function(req, res, next){
    neuroDAO.getNeuroPatients(req.params.neuroId, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(200).send(result);
    }, next);
});

router.get('/:neuroId/patients/:patientId/tests', function(req, res, next){
    neuroDAO.getPatientTests(req.params.neuroId, req.params.patientId, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(200).send(result);
    }, next);
})

router.get('/:neuroId/patients/tests/routes', function(req, res, next){
    neuroDAO.getNeuroTestsRoutes(req.params.neuroId, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(200).send(result);
    }, next);
})

router.post('/:neuroId/patients/:patientId/tests', function(req, res, next){
    neuroDAO.postTest(req.body.attribId, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.send({status: "ok"});
    }, next);
});

module.exports = router;