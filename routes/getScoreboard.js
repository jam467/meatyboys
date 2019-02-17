var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');

/* GET users listing. */
router.get('/:round', function(req, res, next) {
  fs.readFile('downloads/scoreboard'+req.params.round+'.json', function(err, data) {
		  //console.log("james", JSON.parse(data),"James");
		  if(err){
			res.send();
		}else{
		  res.send(JSON.parse(data));
		}
  	});
});

module.exports = router;
