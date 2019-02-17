var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
/* GET users listing. */

router.post('/', function(req, res, next) {
	var roundNo = req.body["round"];
	console.log('downloads/draft'+roundNo+'.json');
	var file = 'downloads/draft'+roundNo+'.json';
  	fs.readFile(file, function(err, data) {
		  //console.log("james", JSON.parse(data),"James");
		  if(err){
			  res.send();
		  }else{
		  res.send(JSON.parse(data));
		  }
  		
  		
  	});

});

module.exports = router;
