var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  
request({
		method: 'POST',
		headers:{
			Cookie:"ASP.NET_SessionId=r5vtzmoyrkxfzdnbdu5owi3k;_ga=GA1.2.1285418755.1516418231;FRD-Draft=8FMT6x5VBrFgtfSo8sbKpSfwz5e4A0konbi9BjPdv+ATzUCSL46mt+ELyZVJXfX5akIRj2M3+nUAyLQbzCxw8NoWerYn3MlmYu53L1O79/SstaG+Bg/yG+0kvkySriCvTTjgp41cunxjrFd3li8QyXBNoj25nPdqbB9diphlHIqzie+Hq0wQiFWVrcSZl6U/GjmkExkjSZLE+WqPNrWob66N/reb7+CUsEF8iVS+Ytv9Jx6MaCld09OusnMlgr511vzqhZexF4HrJn9HOA84P/u5plwSiZeej9Tj2MivEjA=;.ASPXAUTH=4286AAF26E233E54AF39AECE2DEFD1A47202E64557F58E05FA3C64AF8E25E59E35B70DDF67A3F2CCC8D189E2E992FF9782E9077D7A8B0ED7F65A253A977BFDAFBA68BDDB817FEAB6A0E7042600AE848EFF47F2F5D029BC6E5F8D028321A6FFBE334DA664AF200FFFCA89600AF45BA84EFA7C9C7C5C8C6CAA2CAD43736F24356E898CA53108FE545F9034F544780C92E8911D0CE8A44F2EC63C4D92ECCC90EDE62D115EC0C48313D0CFCB2194D834D09F72DDA66C0FCEADC2EB806B3B19D6ED82;_gid=GA1.2.1122346297.1518690176"},
		json:true,
		url:'http://www.fantasyrugbydraft.com/Web/Services/Action.asmx/Request',
		body:{"Data":'{"filter":"","leagueid":"89de18f0-4cc5-41e4-b4e1-a86f00b9f7bc","gameweek":"255","category":"255","seasons":"ac431136-3679-41b6-b968-a40600d7de5c","owner":"256","position":256,"teamnews":"256","sort":"","pageno":0,"action":"member/league/playerhub","type":"control"}'}},
		function (error, response, body) {
			console.log(body);
			var Content = JSON.parse(body.d)["Content"];
			var regex = /playerid="(.{36})"/g
			var matches = [];
			var match = regex.exec(Content);
			while (match != null) {
				matches.push(match[1]);
				match = regex.exec(Content);
			}
			console.log(matches);
});

module.exports = router;
