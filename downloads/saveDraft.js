var request = require('request');
var fs = require('fs');

var matches = [];
var i =0;
var j =0;
var complete = 0;
while(j<16){
	getPage(j);
	j++;
}
function getPage(pageNo){
	request({
			method: 'POST',
			headers:{
				Cookie:"ASP.NET_SessionId=r5vtzmoyrkxfzdnbdu5owi3k;_ga=GA1.2.1285418755.1516418231;FRD-Draft=8FMT6x5VBrFgtfSo8sbKpSfwz5e4A0konbi9BjPdv+ATzUCSL46mt+ELyZVJXfX5akIRj2M3+nUAyLQbzCxw8NoWerYn3MlmYu53L1O79/SstaG+Bg/yG+0kvkySriCvTTjgp41cunxjrFd3li8QyXBNoj25nPdqbB9diphlHIqzie+Hq0wQiFWVrcSZl6U/GjmkExkjSZLE+WqPNrWob66N/reb7+CUsEF8iVS+Ytv9Jx6MaCld09OusnMlgr511vzqhZexF4HrJn9HOA84P/u5plwSiZeej9Tj2MivEjA=;_gid=GA1.2.1234433034.1519900362;_gat=1;.ASPXAUTH=43B7B89730A7244A01BCCB464133F4A845C662CA495B7D83075E54568F9ABA9A8F4316EC70118AA6845A0313B4B3C857C2E01B4759128DF1F6676E603229E26965EE9CA76DAE0AA22319413D361BD06EDCBFD73A4989D33E61D4996445B07C4BA955906920C8DEC6F4C6E3AE7B0C28FA4FA4E929D04E31167C8071C16D64FE21143B288A089332E3CBE94FA64DB0E885ACDF15828C9EA1930E7EFE38EA628DB75221F8EA980FD8288E16D2290336E7ED9C9255A2882C8A512073383915A3B308"
				},
				json:true,
			url:'http://www.fantasyrugbydraft.com/Web/Services/Action.asmx/Request',
			body:{"Data":'{"filter":"","leagueid":"89de18f0-4cc5-41e4-b4e1-a86f00b9f7bc","gameweek":"3","category":"255","seasons":"be414f72-b472-4358-98a6-a84600dbf701","owner":"256","position":256,"teamnews":"256","sort":"","pageno":'+pageNo+',"action":"member/league/playerhub","type":"control"}'}},
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
				if(complete==16){
					fs.writeFile('/home/ec2-user/meatyboys/meatyboys/downloads/draft.js', JSON.stringify(matches), function (err) {
  						//if (err) throw err;
 						console.log('Saved!');
					});
				}	
		
			
			}
		);


}
