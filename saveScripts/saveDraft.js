

var request = require('request');
var fs = require('fs');
var loc = require('./saveLocation');
var LEAGUEID = "d0f74b10-44f0-4504-b0b6-ae3f016ac58e";
var SEASONID = "7df1adad-976d-4749-8e9f-ae3000fa3444";
var matches = [];
var j = 0;
var i = 0;
var complete = 0;
fs.readFile(loc + 'downloads/round.json', function (err, data) {
	//console.log("james", JSON.parse(data),"James");
	var round = (JSON.parse(data).round);


	fs.readFile(loc + 'downloads/cookie.js', async function (err, data) {
		var matchups = await getMatchup(data);
		var playingMatchups = [];
		for (var i = 0; i < matchups.length; i++) {
			playingMatchups = playingMatchups.concat(await getPlaying(data, matchups[i], round));

		}
		if (process.argv[2] == "0") {
			while (j < 16) {
				getPage(j, data, process.argv[3], playingMatchups);
				j++;
			}
		} else {
			while (j < 16) {
				getPage(j, data, round, playingMatchups);
				//	console.log('"'+round+'"');
				j++;
			}
		}
	});

});
function getPage(pageNo, cookie, round, playing) {
	console.log(round + '+' + pageNo);
	request({
		method: 'POST',
		headers: {
			Cookie: cookie
		},
		json: true,
		url: 'http://www.fantasyrugbydraft.com/Web/Services/Action.asmx/Request',
		body: { "Data": '{"filter":"","leagueid":"' + LEAGUEID + '","gameweek":' + round + ',"category":"255","seasons":"' + SEASONID + '","owner":"256","position":256,"teamnews":"256","sort":"","pageno":' + pageNo + ',"action":"member/league/playerhub","type":"control"}' }
	},
		function (error, response, body) {
			var Content = JSON.parse(body.d)["Content"];
			var regex = /playerid="(.{36})"/g;
			var matchI = 0;
			var begin = Content.indexOf('</th>');
			var indexTemp = 0;
			var indexTemp = 0;
			var playStart = 0;
			var playEnd = 0;
			begin = Content.indexOf('<tr>', begin);
			while (begin != -1) {
				posStart = Content.indexOf('<td>', begin);
				posEnd = Content.indexOf('<', posStart + 4);
				var position = Content.slice(posStart + 4, posEnd)
				indexTemp = Content.indexOf('<td>', posEnd);
				idStart = Content.indexOf('playerid', indexTemp + 4);
				idEnd = Content.indexOf('playername', playStart);
				var playerId = Content.slice(idStart + 10, idEnd - 2).trim();
				playStart = Content.indexOf('>', indexTemp + 4);
				playEnd = Content.indexOf('<', playStart);
				var playerName = Content.slice(playStart + 1, playEnd).trim();
				teamStart = Content.indexOf('<td>', playEnd);
				teamEnd = Content.indexOf('<', teamStart + 4);
				var team = Content.slice(teamStart + 4, teamEnd);
				userStart = Content.indexOf('<td>', teamEnd);
				userEnd = Content.indexOf('<', userStart + 4);
				var userName = Content.slice(userStart + 4, userEnd);
				indexTemp = Content.indexOf('<td>', userEnd);
				scoreStart = Content.indexOf('<td>', indexTemp + 4);
				scoreEnd = Content.indexOf('<', scoreStart + 4);
				var score = Content.slice(scoreStart + 4, scoreEnd);
				TNStart = Content.indexOf('<td', scoreEnd + 4);
				TNEnd = Content.indexOf('<', TNStart + 4);
				var TN = Content.slice(TNStart + 4, TNEnd);
				begin = Content.indexOf('<td>', scoreEnd);
				TN = TN.substring(37, TN.length - 13);
				team = team.substring(14, team.length);
				position = position.substring(14, position.length);
				score = score.substring(14, score.length);
				userName = userName.substring(14, userName.length);
				var bench = true;
				for (var k = 0; k < playing.length; k++) {
					if (playerName === playing[k]) {
						bench = false;
					}
				}
				// console.log(playerId)
				matches[i] = {
					"playerName": playerName,
					"team": team,
					"userName": userName,
					"bench": bench,
					"score": score,
					"position": position,
					"teamNews": TN,
					"playerId": playerId
				};
				i++;

			}
			complete++;
			console.log(complete);
			if (complete == 16) {
				fs.readFile(loc + 'downloads/draftPlayers' + round + '.js', async function (err, dpData) {
					var tally = 0;
					for (var p = 0; p < matches.length; p++) {
						if (matches[p].position === "Front Row") {
							tally++;
						}
					}
					if (tally > 5) {
					if (!dpData||(matches.length >= dpData.length)) {
							fs.writeFile(loc + 'downloads/draftPlayers' + round + '.json', JSON.stringify(matches), function (err) {
								//if (err) throw err;
								console.log('Saved!' + round);
								complete = 0;
							});
						}
					}
				});
			}

		}
	);


}
function getMatchup(cookie) {
	return new Promise((res, rej) => {
		request({
			method: 'GET',
			headers: {
				Cookie: cookie
			},
			url: 'http://fantasyrugbydraft.com/matchup/Meaty_Boys_2'
		},
			function (error, response, body) {
				var matchIds = [];
				var start = 0
				for (var i = 0; i < 5; i++) {
					var posStart = body.indexOf('matchupid', start);
					matchIds.push(body.slice(posStart + 11, posStart + 47));
					start = posStart + 47;
				}
				res(matchIds);

			}

		);
	});


}

function getPlaying(cookie, matchup, round) {
	return new Promise((res, rej) => {
		request({
			method: 'POST',
			headers: {
				Cookie: cookie
			},
			json: true,
			url: 'http://www.fantasyrugbydraft.com/Web/Services/Action.asmx/Request',
			body: { "Data": '{"leagueid":"' + LEAGUEID + '","matchupid":"' + matchup + '","gameweekid":"' + round + '","action":"member/homepage/matchup","type":"control"}' }
		},
			function (error, response, body) {
				var Content = JSON.parse(body.d)["Content"];
				var begin = Content.indexOf('</th>');
				var indexTemp = 0;
				var indexTemp = 0;
				var playStart = 0;
				var playEnd = 0;
				begin = 0;
				var players = [];
				while (begin != -1) {
					posStart = Content.indexOf('playername', begin);
					posEnd = Content.indexOf('>', posStart + 10);
					var player = Content.slice(posStart + 12, posEnd - 1);
					while (player.includes('&#39;')) {
						player = player.replace('&#39;', "'");
					}
					players.push(player);
					begin = Content.indexOf('playername', posEnd + 5);


				}

				res(players);

			}
		);
	})


}

function findDraftRound(round, getGames) {
	var roundGroupings = [[0, 1], [2, 5], [6, 9], [10, 13], [14, 17], [18, 21], [22, 25], [26, 29], [30, 33], [34, 37], [38, 39]];
	for (var i = 0; i < roundGroupings.length; i++) {
		if ((roundGroupings[i][0] <= round) && (round <= roundGroupings[i][1])) {
			if (getGames) {
				return roundGroupings[i];
			} else {
				return i + 1;

			}
		}
	}
}