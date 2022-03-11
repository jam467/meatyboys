var request = require('request');
var fs = require('fs');
var loc = require('./saveLocation');

fs.readFile(loc + 'downloads/currentseason.json', function (err, data) {
	var data = JSON.parse(data);
	var round = 0;
	var ofRound = {};
	var date = new Date();
	// console.log(date);
	var isoDateTime = new Date();
	console.log(isoDateTime);
	for (var i = 0; i < data.length; i++) {
		var gameDate = (new Date(data[i].datetime));
		var lesstwoDays = new Date(gameDate.getTime() - (1000 * 60 * 60 * 24 * 3));
		console.log(lesstwoDays, date)
		if (lesstwoDays > date) {
			ofRound = data[i-1].round;
			i=data.length;
		}

	}
	console.log(ofRound)
	fs.writeFile(loc + 'downloads/round.json', JSON.stringify({ "round": ofRound, "official": ofRound }), function (err) {
		//if (err) throw err;
		console.log('Saved!');
	});

}
);