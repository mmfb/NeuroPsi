
var express = require("express");
var router = express.Router();
var neuroDAO = require("../models/neuroDAO");

router.get('/:neuroId/savedTests', function(req, res, next){
    neuroDAO.getNeuroSavedTests(req.params.neuroId, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(200).send(result);
    }, next);
});

router.post('/:neuroId/savedTests', function(req, res, next){
    console.log(req.body)
    neuroDAO.saveTest(req.params.neuroId, JSON.parse(req.body.test), function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(200).send(result);
    }, next);
});

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

router.get('/:neuroId/attributions/:attribId/tests', function(req, res, next){
    neuroDAO.getNeuroPatientTests(req.params.attribId, function(err, result){
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

router.post('/:neuroId/tests/:testId/patients/:patientId', function(req, res, next){
    neuroDAO.scheduleTest(req.params.testId, req.body.attribId, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.send({status: "ok"});
    }, next);
});

router.post('/:neuroId/patients/:patientId/tests/:testId/reschedule', function(req, res, next){
    neuroDAO.rescheduleTest(req.params.testId, req.body.attribId, req.body.comment, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.send({status: "ok"});
    }, next);
});

router.get('/:neuroId/patients/tests/state/:testState', function(req, res, next){
    neuroDAO.getNeuroPatientsTestsByState(req.params.neuroId, req.params.testState, function(err, result){
        if(err){
            res.statusMessage = result.status;
            res.status(result.code).json(err);
            return;
        }
        res.status(200).send(result);
    }, next);
})

module.exports = router;
