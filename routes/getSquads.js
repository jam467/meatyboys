var express = require('express');
var router = express.Router();
var request = require('request');

/* GET users listing. */
router.get('/', function(req, res, next) {
  	request({
  		gzip: true,
  		json:true,
  		url:'https://fgp-data.s3-ap-southeast-2.amazonaws.com/json/fox_super_rugby/squads.json'}, function (error, response, body) {
			res.send(body);
	
		}
	);
});

module.exports = router;
