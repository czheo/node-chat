var express = require('express');
var router = express.Router();
var redis = require("../redis");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

module.exports = router;
