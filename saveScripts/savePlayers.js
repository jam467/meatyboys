var request = require('request');
var fs = require('fs');
var loc = require('./saveLocation');
fs.readFile(loc+'downloads/round.json', function(err, data) {
	//console.log("james", JSON.parse(data),"James");
	var round = JSON.parse(data).round;
	request({
		gzip: true,
		json:true,
		url:'https://statsapi.foxsports.com.au/3.0/api/sports/rugby/series/1/currentseason.json?userkey=A00239D3-45F6-4A0A-810C-54A347F144C2'}, async function (error, response, body) {
			var roundObj = body.current_season.rounds[round-1];
			var playAr = [];
			for(var i=1;i<=roundObj.matches_in_round;i++){
				var roundText = '';
				if(roundObj.number<10){
					roundText= '0'+roundObj.number;
				}else{
					var roundText = roundObj.number;
					
				}
				playAr.push(players('SRU2020'+roundText+'0'+i).then((result)=>{
					return result;
				}));
			}
			var resolvePlayers = await Promise.all(playAr);
			
			fs.writeFile(loc+'downloads/players'+round+'.json', JSON.stringify(resolvePlayers), function (err) {
				//if (err) throw err;
				console.log('Saved!');
			});
			
		}
		);
	});
		
function players(matchID){
	return new Promise((resolve,reject)=>{

		request({
			gzip: true,
			json:true,
			url:'https://statsapi.foxsports.com.au/3.0/api/sports/rugby/matches/'+matchID+'/players.json?userkey=A00239D3-45F6-4A0A-810C-54A347F144C2'}, function (error, response, body) {

				resolve(body);
		})
	})
}