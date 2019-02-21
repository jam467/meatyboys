var request = require('request');
var fs = require('fs');
var loc = require('./saveLocation');

request({
	gzip: true,
	json:true,
	url:'https://statsapi.foxsports.com.au/3.0/api/scoreboard/profiles/foxsports_rugby.json;masthead=foxsports?userkey=A00239D3-45F6-4A0A-810C-54A347F144C2'}, function (error, response, body) {
	var round = body[0].series_scoreboards[0].scoreboards[0].score.round.number;
		var scrbrds = body[0].series_scoreboards[0].scoreboards;
		var nextGame = 0; 
		for(var i=0;i<scrbrds.length-1;i++){
			if(new Date() > new Date(scrbrds[i].score.match_start_date)){
				nextGame = i+1;
			}
		}
		fs.writeFile(loc+'downloads/round.json', JSON.stringify({"round":round,"nextGame":nextGame}), function (err) {
  						//if (err) throw err;
 						console.log('Saved!');
					});

	}
);