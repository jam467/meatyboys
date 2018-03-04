var request = require('request');
var fs = require('fs');
		
request({
	method: 'POST',
	json:true,
	url:'http://www.fantasyrugbydraft.com/Web/Services/Action.asmx/Request',
	body:{"Data":'{"tblogin":"jdunlop467@gmail.com","tbpassword":"legend12","rememberme":"on","leagueid":"","code":"","timezoneoffset":-660,"action":"user/login","type":"action"}'}},
	function (error, response, body) {
		//console.log(response["headers"]["set-cookie"][0]+';'+response["headers"]["set-cookie"][1]);
		fs.writeFile('/home/ec2-user/meatyboys/meatyboys/downloads/cookie.js', (response["headers"]["set-cookie"][0]+';'+response["headers"]["set-cookie"][1]), function (err) {});
	}
	); 
