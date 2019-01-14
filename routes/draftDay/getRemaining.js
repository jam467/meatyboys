var express = require('express');

var router = express.Router();
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
  fs.readFile('playerfiles/allplayers.txt', function(err, data) {
  		//console.log("james", JSON.parse(data),"James");
  		res.send(JSON.parse(data));
  	});

	
});

module.exports = router;


