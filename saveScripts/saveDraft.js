

var request = require('request');
var fs = require('fs');

var matches = [];
var j =0;
var i =0;
var complete = 0;
fs.readFile('/home/ec2-user/meatyboys/meatyboys/downloads/rounds.js', function(err, roundsFile) {
	var rounds = JSON.parse(roundsFile);
	today = new Date();
	
	console.log(rounds[4].start);
	var round = 0;
	if(process.argv[2]=="1"){
		for(var k=0;k<rounds.length;k++){
		    roundDate =new Date(rounds[k].start);
		    if(roundDate>today){
		    	round = k;
		    	k= rounds.length;
		    }
		}
    }
	fs.readFile('/home/ec2-user/meatyboys/meatyboys/downloads/cookie.js', function(err, data) {
		if(process.argv[2]=="0"){
			while(j<16){
					getPage(j,data,process.argv[3]);
					j++;
			}
		}else{
			while(j<16){
					getPage(j,data,round);
				//	console.log('"'+round+'"');
					j++;
			}
		}
	});
});

function getPage(pageNo,cookie,round){
	console.log(round+'+'+pageNo);
	request({
			method: 'POST',
			headers:{
				Cookie:cookie
			},
			json:true,
			url:'http://www.fantasyrugbydraft.com/Web/Services/Action.asmx/Request',
			body:{"Data":'{"filter":"","leagueid":"89de18f0-4cc5-41e4-b4e1-a86f00b9f7bc","gameweek":'+round+',"category":"255","seasons":"be414f72-b472-4358-98a6-a84600dbf701","owner":"256","position":256,"teamnews":"256","sort":"","pageno":'+pageNo+',"action":"member/league/playerhub","type":"control"}'}},
			function (error, response, body) {
				var Content = JSON.parse(body.d)["Content"];
				var regex = /playerid="(.{36})"/g;
				var matchI = 0;
				var begin = Content.indexOf('</th>');
				var indexTemp = 0;
				var indexTemp = 0;
				var playStart = 0;
				var playEnd = 0;
				begin = Content.indexOf('<tr>',begin);
				console.log("HI");
				while(begin!=-1){
					posStart = Content.indexOf('<td>',begin);
					posEnd = Content.indexOf('<',posStart+4);
					var position = Content.slice(posStart+4,posEnd)
					indexTemp = Content.indexOf('<td>',posEnd);
					playStart = Content.indexOf('>',indexTemp+4);
					playEnd = Content.indexOf('<',playStart);
					var playerName = Content.slice(playStart+1,playEnd).trim();
					teamStart = Content.indexOf('<td>',playEnd);
					teamEnd = Content.indexOf('<',teamStart+4);
					var team = Content.slice(teamStart+4,teamEnd);
					userStart = Content.indexOf('<td>',teamEnd);
					userEnd = Content.indexOf('<',userStart+4);
					var userName = Content.slice(userStart+4,userEnd);
					indexTemp = Content.indexOf('<td>',userEnd);
					scoreStart = Content.indexOf('<td>',indexTemp+4);
					scoreEnd = Content.indexOf('<',scoreStart+4);
					var score = Content.slice(scoreStart+4,scoreEnd);
					begin = Content.indexOf('<td>',scoreEnd);
					matches[i] = {
						"playerName":playerName,
						"team":team,
						"userName":userName,
						"score":score,
						"position":position
					};
					i++;
		
				}
				complete++;
				console.log(complete);
				if(complete==16){
					fs.writeFile('/home/ec2-user/meatyboys/meatyboys/downloads/draft'+round+'.js', JSON.stringify(matches), function (err) {
  						//if (err) throw err;
 						console.log('Saved!'+round);
 						complete =0;
					});
				}	
		
			
			}
		);


}