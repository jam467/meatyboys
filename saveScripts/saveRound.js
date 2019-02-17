var request = require('request');
var fs = require('fs');
var loc = require('./saveLocation');

request({
	gzip: true,
	json:true,
	url:'https://statsapi.foxsports.com.au/3.0/api/scoreboard/profiles/foxsports_rugby.json;masthead=foxsports?userkey=A00239D3-45F6-4A0A-810C-54A347F144C2'}, function (error, response, body) {
    var round = body[0].series_scoreboards[0].scoreboards[0].score.round.number;
		fs.writeFile(loc+'downloads/round.json', JSON.stringify({"round":round}), function (err) {
  						//if (err) throw err;
 						console.log('Saved!');
					});

	}
);