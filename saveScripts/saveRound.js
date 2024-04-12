var request = require('request');
var fs = require('fs');
var loc = require('./saveLocation');

fs.readFile(loc + 'downloads/currentseason.json', function (err, data) {
	console.log(data);
	var data = JSON.parse(data);
	var round = 0;
	var ofRound = {};
	var date = new Date();

	
	var isoDateTime = new Date();
	console.log(isoDateTime);
	for (var i = 0; i < data.length; i++) {
		var gameDate = (new Date(convertDate(data[i].datetime)));
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

function convertDate(date) {
	//flip the date to be in the correct format
	//15/02/2019 06:35:00
	//2019-02-15T06:35:00.000Z
	date = date.split("/");
	var day = date[0];
	var month = date[1];
	var year = date[2].split(" ");
	date = year[0] + "-" + month + "-" + day;
	time = year[1];
	date = date + "T" + time;
	return date;
}