var express = require('express');

var router = express.Router();
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
  fs.readFile('playerfiles/time.txt', function(err, data) {
  		//console.log("james", JSON.parse(data),"James");
          console.log(JSON.parse(data).time);
          res.send(JSON.parse(data));
          
  	});

	
});

module.exports = router;


