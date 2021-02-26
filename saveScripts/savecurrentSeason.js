var request = require('request');
var fs = require('fs');
var loc = require('./saveLocation');

request({
	gzip: true,
	json: true,
	url: 'https://statsapi.foxsports.com.au/3.0/api/scores/completeandupcoming.json;ts=1613179454679;past=false;sport=rugby:29,30?limit=50&userkey=A00239D3-45F6-4A0A-810C-54A347F144C2'
}, function (error, response, body) {
	var games = (body);
		request({
			gzip: true,
			json: true,
			url: 'https://statsapi.foxsports.com.au/3.0/api/scoreboard/profiles/foxsports_rugby.json;masthead=foxsports?userkey=A00239D3-45F6-4A0A-810C-54A347F144C2'
		}, function (error, response, body2) {
			var liveAU = (body2)[0].series_scoreboards[0].scoreboards;
			var liveNZ = (body2)[0].series_scoreboards[2].scoreboards;
			var live = liveAU.concat(liveNZ);
			var found = false;
			var spliceLoc = 0;
			var newEntry = {}
			console.log(games.length);
			for (var j = 0; j < live.length; j++) {
				found = false;
				for (var i = 0; i < games.length; i++) {
					if (live[j].match_centre_url.match_id === games[i].match_id) {
						found = true;
						console.log('only 1')
					}
				}
				if (!found) {
					for (var i = 0; i < games.length; i++) {
						if(live[j].score.match_start_date<games[i].match_start_date){
							console.log('splice')
							spliceLoc =i;
							newEntry = live[j].score;
							i = games.length;
						}
					}
					games.splice(spliceLoc, 0, newEntry)
				}
			}


			
			
			fs.writeFile(loc + 'downloads/currentseason.json', JSON.stringify(games), function (err) {
				
				//if (err) throw err;
				console.log('Saved!');
			});
		})

}
);
