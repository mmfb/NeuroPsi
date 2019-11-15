var express = require("express");
var router = express.Router();

var items = [];
//Get rule
router.get("", function(req, res, next){
  //console.log(req.parse.);
  res.send(items);
})
//Post rule
router.post("", function(req, res, next){
  var data =  req.body;
  console.log(data);
  items.push(data.item);
  res.send({status:"ok", itemsSize: items.length});
});

module.express = router;