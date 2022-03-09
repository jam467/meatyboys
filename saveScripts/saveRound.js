var request = require('request');
var fs = require('fs');
var loc = require('./saveLocation');

fs.readFile(loc+'downloads/currentseason.json', function(err,data){
	var data = JSON.parse(data);
	var round = 0;
	var ofRound = {};
	var date = new Date();
	// console.log(date);
	var isoDateTime = new Date(date.getTime() - (-660 * 60000)).toISOString();
	console.log(isoDateTime);
	for(var i =0;i<data.length;i++){
		var gameDate = (new Date(data[i].datetime));
		if(gameDate<new Date(isoDateTime)){
			var twoDays = new Date(date.getTime() - (-660 * 60000)+(60*60*24*2));
			if(twoDays<gameDate){
				ofRound = data[i].round;
			}else{
				ofRound = data[i].round+1;
			}
			
		}
		console.log(ofRound)
	}
		fs.writeFile(loc+'downloads/round.json', JSON.stringify({"round":ofRound,"official":ofRound}), function (err) {
  						//if (err) throw err;
 						console.log('Saved!');
					});

	}
);