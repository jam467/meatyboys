var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
/* GET users listing. */

router.get('/', function(req, res, next) {
  	fs.readFile('downloads/draft.js', function(err, data) {
  		//console.log("james", JSON.parse(data),"James");
  		res.send(JSON.parse(data));
  		
  		
  	});

});

module.exports = router;
