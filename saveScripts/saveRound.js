var request = require('request');
var fs = require('fs');
var loc = require('./saveLocation');

fs.readFile(loc+'downloads/currentseason.json', function(err,data){
	var data = JSON.parse(data);
	var round = 0;
	var ofRound = {};
	var date = new Date();
	console.log(date);
	var isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
	console.log(isoDateTime);
	for(var i =0;i<data.length;i++){
		if(data[i].match_end_date<isoDateTime){
			round = i+1;
			
		}
		ofRound = data[round].round;
	}
		fs.writeFile(loc+'downloads/round.json', JSON.stringify({"round":round,"official":ofRound}), function (err) {
  						//if (err) throw err;
 						console.log('Saved!');
					});

	}
);