var express = require('express');
var router = express.Router();
var request = require('request');

/* GET users listing. */
router.get('/', function(req, res, next) {
   fs.readFile('downloads/players.js', function(err, data) {
  		//console.log("james", JSON.parse(data),"James");
  		res.send(JSON.parse(data));
  	});
});

module.exports = router;
