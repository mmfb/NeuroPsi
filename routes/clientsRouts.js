var express = require('express');
var router = express.Router();

/* GET home page. */
var resultados = [];
router.get('/:userId/ficha/testes/:testId/resultados', function(req, res, next) {
res.send(resultados);
});

router.post('/:userId/ficha/testes/:testId/resultados', function(req, res, next) {
resultados = req.body;
console.log(req.body);
res.send({status: "ok"});
});

module.exports = router;