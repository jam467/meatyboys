var request = require('request');
var fs = require('fs');
var loc = require('./saveLocation');

request({
	gzip: true,
	json:true,
	url:'https://statsapi.foxsports.com.au/3.0/api/scores/completeandupcoming.json;ts=1613179454679;past=false;sport=rugby:29,30?limit=50&userkey=A00239D3-45F6-4A0A-810C-54A347F144C2'}, function (error, response, body) {
		fs.writeFile(loc+'downloads/currentseason.json', JSON.stringify(body), function (err) {
  						//if (err) throw err;
 						console.log('Saved!');
					});

	}
);
