var request = require('request');
var fs = require('fs');
var loc = require('./saveLocation');

fs.readFile(loc+'downloads/currentseason.json', function(err,data){
	var data = JSON.parse(data);
	var round = data.current_season.current_round_number;
		fs.writeFile(loc+'downloads/round.json', JSON.stringify({"round":round,"nextGame":1}), function (err) {
  						//if (err) throw err;
 						console.log('Saved!');
					});

	}
);