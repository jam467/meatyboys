var express = require('express');
var router = express.Router();
var request = require('request');


/* GET users listing. */
router.get('/', function(req, res, next) {
	request('https://fgp-data.s3-ap-southeast-2.amazonaws.com/json/fox_super_rugby/rounds.json', function (error, response, body) {
		console.log(error);
		console.log(response);
		console.log(body);
		
		res.send(body);
	
	});
	
});

module.exports = router;



