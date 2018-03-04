var request = require('request');
var fs = require('fs');

request({
	gzip: true,
	json:true,
	url:'https://fgp-data.s3-ap-southeast-2.amazonaws.com/json/fox_super_rugby/players.json'}, function (error, response, body) {
		fs.writeFile('/home/ec2-user/meatyboys/meatyboys/downloads/players.js', JSON.stringify(matches), function (err) {
  						//if (err) throw err;
 						console.log('Saved!');
					});

	}
);
