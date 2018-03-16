var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
/* GET users listing. */

router.post('/', function(req, res, next) {
	var roundNo = req.body["round"];
	var file = 'downloads/draft'+roundNo+'.js';
  	fs.readFile(file, function(err, data) {
  		//console.log("james", JSON.parse(data),"James");
  		res.send(JSON.parse(data));
  		
  		
  	});

});

module.exports = router;
