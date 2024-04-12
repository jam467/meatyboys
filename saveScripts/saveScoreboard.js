var request = require('request');
var fs = require('fs');
var loc = require('./saveLocation');

fs.readFile(loc + 'downloads/round.json', function (err, data) {
	//console.log("james", JSON.parse(data),"James");
	var round = JSON.parse(data).round;
	fs.readFile(loc + 'downloads/currentseason.json', function (err, cS) {
		var currSeas = JSON.parse(cS);
		var roundDates = [];
		for (var i = 0; i < currSeas.length; i++) {
			if (currSeas[i].round === round) {
				roundDates.push(new Date(convertDate(currSeas[i].datetime)));
			}
		}
		var scoreArr = [];
		var uRoundDates = [];
		for (var i = 0; i < roundDates.length; i++) {
			var found = false;
			for (var j = 0; j < uRoundDates.length; j++) {
				if (roundDates[i].getDate() === uRoundDates[j].getDate()) {
					found = true;
				}
			}
			if (!found) {
				uRoundDates.push(roundDates[i]);
			}
		}
		function addZero(num) {
			if (num < 10) {
				return '0' + String(num)
			} else {
				return String(num)
			}
		}
		var returnTally = 0;
		for (var i = 0; i < uRoundDates.length; i++) {
			var dateTag = String(uRoundDates[i].getFullYear()) + addZero((uRoundDates[i].getMonth() + 1)) + addZero(uRoundDates[i].getDate());
			request({
				gzip: true,
				json: true,
				url: 'https://site.web.api.espn.com/apis/site/v2/sports/rugby/scorepanel?contentorigin=espn&dates=' + dateTag + '&lang=en&region=us'
			}, async function (error, response, body) {
				console.log(body);
				var legs = body.scores;
				var leg = {};
				for (var i = 0; i < legs.length; i++) {
					if (legs[i].leagues[0].name === "Super Rugby Pacific") {
						leg = legs[i];
					}
				}
				var comps = leg.events;
				if (comps) {
					for (var i = 0; i < comps.length; i++) {
						scoreArr.push(comps[i].competitions[0].competitors[0])
						scoreArr.push(comps[i].competitions[0].competitors[1])
					}
				}
				returnTally++;
				if (returnTally === uRoundDates.length) {
					console.log(scoreArr)
					fs.writeFile(loc + 'downloads/scoreboard' + round + '.json', JSON.stringify(scoreArr), function (err) {
						//if (err) throw err;
						console.log('Saved!');
					});
				}
			});
		}

	});
});


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