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
		console.log(data[i].match_end_date);
		if(data[i].match_end_date<isoDateTime){
			console.log('o')
			var twoDays = new Date(date.getTime() - (-660 * 60000)+(60*60*24*2)).toISOString();
			if(twoDays<data[i].match_end_date){
				round = i;
			}else{
				round = i+1;
			}
			
		}
		console.log(round)
		ofRound = data[round].round;
	}
		fs.writeFile(loc+'downloads/round.json', JSON.stringify({"round":round,"official":ofRound}), function (err) {
  						//if (err) throw err;
 						console.log('Saved!');
					});

	}
);