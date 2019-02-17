var express = require('express');
var router = express.Router();
var fs = require('fs');
/* GET users listing. */

router.get('/', function(req, res, next) {
	var file = 'downloads/round.json';
  	fs.readFile(file, function(err, data) {
		  //console.log("james", JSON.parse(data),"James");
		  res.send(JSON.parse(data));
  		
  		
  	});

});

module.exports = router;
