var request = require('request');
var fs = require('fs');
var loc = require('./saveLocation');

fs.readFile(loc + 'downloads/round.json', function (err, data) {
	//console.log("james", JSON.parse(data),"James");
	var round = JSON.parse(data).round;
	request({
		gzip: true,
		json: true,
		url: 'https://site.web.api.espn.com/apis/site/v2/sports/rugby/scorepanel?contentorigin=espn&lang=en&region=us'
	}, async function (error, response, body) {
		var legs = body.scores;
		var leg = {};
		for (var i = 0; i < legs.length; i++) {
			if (legs[i].leagues[0].name === "Super Rugby Pacific") {
				leg = legs[i];
			}
		}
		var scoreArr = [];
		var comps = leg.events;
		for (var i = 0; i < comps.length; i++) {
			scoreArr.push(comps[i].competitions[0].competitors[0])
			scoreArr.push(comps[i].competitions[0].competitors[1])
		}
		console.log(scoreArr)



		fs.writeFile(loc+'downloads/scoreboard.json', JSON.stringify(scoreArr), function (err) {
			//if (err) throw err;
			console.log('Saved!');
		});

	}
	);

});
function scoreboard(matchID) {
	return new Promise((resolve, reject) => {

		request({
			gzip: true,
			json: true,
			url: 'https://statsapi.foxsports.com.au/3.0/api/sports/rugby/matches/' + matchID + '/scoreboard.json?userkey=A00239D3-45F6-4A0A-810C-54A347F144C2'
		}, function (error, response, body) {

			resolve(body);
		})
	})
}
