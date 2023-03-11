

var request = require('request');
var fs = require('fs');
var loc = require('./saveLocation');
var LEAGUEID = "1ba5f27e-6de1-4590-afdf-af95011b0b74";
var SEASONID = "a2adb73b-4599-42f2-8b1b-af8e013efb80";
var matches = [];
var j = 0;
var i = 0;
var complete = 0;
fs.readFile(loc + 'downloads/round.json', function (err, data) {
	//console.log("james", JSON.parse(data),"James");
	var round = (JSON.parse(data).round);


	fs.readFile(loc + 'downloads/cookie.js', async function (err, data) {
		console.log('downloads/draftPlayers' + round + '.js')
		fs.readFile(loc + 'downloads/draftPlayers' + round + '.json', async function (err, dp) {
			var dps = (JSON.parse(dp));
			for (var i = 0; i < dps.length; i++) {
				if ((dps[i].teamNews === "Starting") || (dps[i].teamNews === "Bench") || (dps[i].position === "Front Row")) {

						dps[i].score = await getPlayer(dps[i].playerId, data, round, i)
				}
			}
			fs.writeFile(loc + 'downloads/draft' + round + '.json', JSON.stringify(dps), function (err) {
				//if (err) throw err;
				console.log('Saved!' + round);
				complete = 0;
			});
		});
	});

});
async function getPlayer(playerId, cookie, round, plrNo) {

	console.log(plrNo);
	return new Promise((res, rej) => {

		request({
			method: 'POST',
			headers: {
				Cookie: cookie
			},
			json: true,
			url: 'http://www.fantasyrugbydraft.com/Web/Services/Action.asmx/Request',
			body: { "Data": '{"playerid":"' + playerId + '","leagueid":"' + LEAGUEID + '","action":"member/common/playerstats","type":"control"}' }
		},
			function (error, response, body) {
				var Content = JSON.parse(body.d)["Content"];
				var begin = Content.indexOf('</th>');
				var indexTemp = 0;
				var indexTemp = 0;
				var playStart = 0;
				var playEnd = 0;
				var found = false;
				var fail = false;
				var counter =0;
				var move = Content.indexOf('<tbody>', begin);
				while (!found) {
					counter++;
					next = Content.indexOf('<tr>', move);
					slip = Content.indexOf('<td>', next);
					move = Content.indexOf('</td>', next);
					var number = Content.slice(slip + 4, move).trim();
					if (Number(number) === round) {
						found = true;
					}
					if(counter>(round+1)){
						fail=true;
						found = true;
					}
				}
				if(fail){
					res(0);

				}else{

					var scoreStr = Content.indexOf('<td>', move);
					var scoreEnd = Content.indexOf('</td>', scoreStr);
					var score = Content.slice(scoreStr + 4, scoreEnd).trim();
					res(score);
				}
			}
		);
	});



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