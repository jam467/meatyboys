
var gRound = 1;
var Round = [];
var users = [];
var draftData = [];
var sortBy = 0;
var currData = [];
var nameLength = 12;
var matchNo = 0;
var roundFirstLoad = 0;
$(document).ready(function () {
	$.get('/getRound', function (roundD) {
		gRound = { draft: roundD.round, official: (roundD.official ? roundD.official.number ? roundD.official.number : 0 : 0) };

		listRounds(11);//set to latest round
		getCurrentSeason().then((currD) => {
			currData = currD;
			getDraft().then(() => {
				roundsThisWeek();
				fillData();
			});

		})
	});
});
// function getRound() {
// 	$.get('/getPlayers/' + gRound.official, function (data) {
// 		//console.log(data)
// 		Round = (data);
// 		getDraft().then(() => {
// 			roundsThisWeek();
// 			getCurrentSeason();
// 			fillData();
// 		});
// 	});
// }
function refreshData() {
	getDraft().then(() => {
		fillData();
	});
}
function getCurrentSeason() {
	return new Promise((resolve, reject) => {
		$.get('/getcurrSeason', function (data) {
			//console.log(data)
			resolve(data);
		});
	})
}


function getDraft() {
	return new Promise((resolve, reject) => {

		$.post('/getDraft', { "round": (findDraftRound(gRound.draft)) }, function (data) {
			//console.log(data)
			draftData = (data);
			resolve();
		});
	});
}
function listRounds(noRounds) {
	var roundList = '';
	for (var i = 0; i < noRounds; i++) {
		roundList = roundList + '<li><a href="javascript:;" onclick="setRound(' + findGameForRound((i)) + ')" id="priceChanges" data-toggle="collapse" data-target=".navbar-collapse.in" >Round ' + (i + 1) + '</a></li>'
	}
	document.getElementById("roundList").innerHTML = roundList;
}

function toggleSortBy() {
	var button = document.getElementById("sortBy");
	if (sortBy == 0) {
		sortBy = 1;
		button.firstChild.data = "Sort by Score";
	} else {
		sortBy = 0;
		button.firstChild.data = "Sort by Position";
	}
	fillData();
}


var timer = setInterval(refreshData, 30000);


var loadedOnce = 0;

function setZoom() {
	if (screen.width < 992) {
		document.getElementById("navZoom").style.zoom = 2;
		document.getElementById("dashSpace").style.paddingTop = '110px';
		var navBrandMob = document.getElementById("headerNav").innerHTML;
		if (loadedOnce == 0) {
			document.getElementById("headerNav").innerHTML = navBrandMob + '<a class="navbar-brand" href="#">Fantasy Meaty Boys</a>'
			loadedOnce += 1;
		}
	}
	if ((screen.width < 1700) && (screen.width > 992)) {
		var zoomCalc = (screen.width - 992) / (1700 - 992) * .5 + .5;
		console.log(zoomCalc);
		document.getElementById("navZoom").style.zoom = zoomCalc;
	}
}
function setRound(round) {
	changeMatch(round)
}
function getScore() {
	document.getElementById("scoreHome").innerHTML = " " + currData[gRound.draft-1].team_A.score;
	document.getElementById("scoreAway").innerHTML = currData[gRound.draft-1].team_B.score;
}

function nameSwap(name){
	if(name==='Western Force'){
		return 'Force';
	}
	return name;
}
function fillData() {
	var homeName = nameSwap(currData[gRound.draft-1].team_A.name);
	var awayName = nameSwap(currData[gRound.draft-1].team_B.name);
	document.getElementById("round").innerHTML = "Round " + (findDraftRound(gRound.draft)) + '<span class="caret"></span>';
	document.getElementById("homeT").innerHTML = homeName + '<span id="scoreHome"></span>';
	document.getElementById("awayT").innerHTML = '<span id="scoreAway"></span> ' + awayName;
	getScore();
	var team1 = [];
	var team2 = [];
	var table = document.getElementById("playerTable");
	var list = "";
	var team1Name = (homeName);
	var team2Name = (awayName);
	//Draft player name
	for (var i = 0; i < draftData.length; i++) {
		if (draftData[i].team == team1Name) {

			var posDetails = getPos(draftData[i].position);


			var t1Score = 0;
			t1Score = draftData[i].score;


			var ownerName = "";
			if ((draftData[i].userName != "Free Agent") && (draftData[i].userName.slice(0, 7) != "WAIVERS")) {
				if (draftData[i].bench) {
					ownerName = draftData[i].userName + ' (Bench)';
				} else {
					ownerName = draftData[i].userName;

				}
			}
			team1.push({
				name: draftData[i].playerName,
				status: draftData[i].teamNews,
				owner: ownerName,
				score: t1Score,
				position: posDetails.posNum,
				posName: posDetails.posName,
				img: '',
				status: ((draftData[i].teamNews === 'Starting') ? 'fas fa-star' : (draftData[i].teamNews === 'Bench') ? 'fas fa-star-half-alt' : (draftData[i].teamNews === 'Out') ? 'far fa-star' : '')
			});
		} else if (draftData[i].team == team2Name) {
			var posDetails = getPos(draftData[i].position);



			var t2Score = 0;
			t2Score = draftData[i].score;


			var ownerName = "";
			if ((draftData[i].userName != "Free Agent") && (draftData[i].userName.slice(0, 7) != "WAIVERS")) {
				if (draftData[i].bench) {
					ownerName = draftData[i].userName + ' (Bench)';
				} else {
					ownerName = draftData[i].userName;

				}
			}
			team2.push({
				name: draftData[i].playerName,
				owner: ownerName,
				score: t2Score,
				position: posDetails.posNum,
				posName: posDetails.posName,
				img: '',
				status: ((draftData[i].teamNews === 'Starting') ? 'fas fa-star' : (draftData[i].teamNews === 'Bench') ? 'fas fa-star-half-alt' : (draftData[i].teamNews === 'Out') ? 'far fa-star' : '')
			});
		}

	}
	var blankObj = {
		name: '',
		score: '',
		playerId: '',
		position: '',
		posName: '',
		owner: '',
		img: ''
	}
	var lColor = chooseColour(team1Name);
	var rColor = chooseColour(team2Name);
	var diff = 0;
	if (sortBy == 1) {
		team1.sort(function (a, b) { return a.position - b.position });
		team2.sort(function (a, b) { return a.position - b.position });
	} else {
		team1.sort(function (a, b) { return b.score - a.score });
		team2.sort(function (a, b) { return b.score - a.score });
	}
	if (team1.length < team2.length) {
		diff = team2.length - team1.length;
		for (var l = 0; l < diff; l++) {
			team1.push(blankObj);
		}
	} else if (team1.length > team2.length) {
		diff = team1.length - team2.length;
		for (var l = 0; l < diff; l++) {
			team2.push(blankObj);
		}
	}

	for (var i = 0; i < team1.length; i++) {
		list = list + '<tr class="myRow">\
			<td width="5%" style="background-color:'+ lColor + '">\
			<div class="rOwner">\
			'+ team1[i].owner + '\
			</div>\
			</td >\
			<td width="5%" style="background-color:'+ lColor + '">\
			<div class="rScore">\
			'+ team1[i].score + '\
			</div>\
			</td>\
			<td width="31%" style="background-color:'+ lColor + '">\
			<div class="rName">\
			'+ team1[i].name + '<i style="font-size:20px" class="' + team1[i].status + '"></i>\
			</div>\
			</td>\
			<td width="5%" class="rImg" style="background-color:'+ lColor + '">\
			'+ team1[i].img + '\
			</td>\
			<td width="3%" style="background-color:'+ lColor + '">\
			<div class="verticaltext">\
			'+ team1[i].posName + '\
			</div>\
			</td>\
			<td width="2%" >\
			<br>\
			VS\
			</td>\
			<td width="3%"  style="background-color:'+ rColor + '">\
			<div class="verticaltext">\
			'+ team2[i].posName + '\
			</div>\
			</td>\
			<td width="5%"  class="rImg" style="background-color:'+ rColor + '">\
			'+ team2[i].img + '\
			</td>\
			<td width="31%" style="background-color:'+ rColor + '">\
			<div class="rName">\
			'+ team2[i].name + '<i style="font-size:20px" class="' + team2[i].status + '"></i>\
			</div>\
			</td>\
			<td width="5%"style="background-color:'+ rColor + '">\
			<div class="rScore">\
			'+ team2[i].score + '\
			</div>\
			</td>\
			<td width="5%" style="background-color:'+ rColor + '">\
			<div class="rOwner">\
			'+ team2[i].owner + '\
			</div>\
			</td>\
		</tr>'}
	document.getElementById("loader").style.display = "none";

	table.innerHTML = list;
	setZoom();
}

$(function () {
	//Enable swiping...
	$("#dashSpace").swipe({
		//Generic swipe handler for all directions
		swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
			//$(this).text("You swiped " + direction );
			var tempMN = 0;
			var RTW = findDraftRound(gRound.draft, true);
			if (direction == "right") {
				console.log(RTW,gRound.draft);
				if (gRound.draft > RTW[0]) {
					tempMN = gRound.draft - 1;
					changeMatch(tempMN);
				}
			} else if (direction == "left") {
				if (gRound.draft < (RTW[1])) {
					tempMN = gRound.draft + 1;
					changeMatch(tempMN);
				}
			}
		},
		//Default is 75px, set to 0 for demo so any distance triggers swipe
		//threshold:0
		allowPageScroll: "vertical"
	});
});
function roundsThisWeek() {
	var navBar = '';
	var teams = [];
	var RTW = findDraftRound(gRound.draft, true);
	console.log(RTW);
	for (var i = RTW[0]; i <= RTW[1]; i++) {
		var homeTeam = nameSwap(currData[i].team_A.name);
		var awayTeam = nameSwap(currData[i].team_B.name);
		teams.push((homeTeam));
		teams.push((awayTeam));
		navBar = navBar + '<li><a data-toggle="collapse" data-target=".navbar-collapse.in" href="javascript:;" onClick="changeMatch(' + i + ')">' + homeTeam + ' v ' + awayTeam + '</a></li>';

	}

	document.getElementById("games").innerHTML = navBar;
	var currentTeamList = ["Crusaders", "Brumbies", "Hurricanes", "Chiefs", "Highlanders", "Blues", "Force", "Waratahs", "Reds", "Rebels"];
	var byes = '';
	var found = 0;
	for (var i = 0; i < currentTeamList.length; i++) {
		for (var j = 0; j < teams.length; j++) {
			if (teams[j] === currentTeamList[i]) {
				found = 1;
			}
		}

		if (found == 0) {
			byes = byes + '<li><a data-toggle="collapse" data-target=".navbar-collapse.in" href="javascript:;" >' + currentTeamList[i] + '</a></li>';
		}
		found = 0;
	}
	document.getElementById("byes").innerHTML = byes;


}
function changeMatch(match) {
	var prevR = gRound.draft;
	gRound.draft = match;
	roundsThisWeek();
	var roundGroup = findDraftRound(match,true);
	if((roundGroup[0]<prevR)&&(roundGroup[1]>prevR)){
		fillData();
	}else{
		getDraft().then(()=>{
			fillData();
		})
	}
}

function chooseColour(team) {
	var colour = ''
	switch (team) {
		case "Stormers":
			colour = "#005596"
			break;
		case "Crusaders":
			colour = "#ED092E"
			break;
		case "Lions":
			colour = "#FF0000"
			break;
		case "Brumbies":
			colour = "#FFC222"
			break;
		case "Hurricanes":
			colour = "#FFDB01"
			break;
		case "Chiefs":
			colour = "#F4B939"
			break;
		case "Sharks":
			colour = "#FFFFFF"
			break;
		case "Highlanders":
			colour = "#104d87"
			break;
		case "Jaguares":
			colour = "#FFC336"
			break;
		case "Blues":
			colour = "#11ACEC"
			break;
		case "Force":
			colour = "#3A73B8"
			break;
		case "Cheetahs":
			colour = "#F07D3C"
			break;
		case "Waratahs":
			colour = "#8EBAE5"
			break;
		case "Bulls":
			colour = "#52b9FC"
			break;
		case "Kings":
			colour = "#C39410"
			break;
		case "Reds":
			colour = "#B90D3B"
			break;
		case "Sunwolves":
			colour = "#E60012"
			break;
		case "Rebels":
			colour = "#234874"
			break;
	}
	return colour;


}
function getPos(posRef) {
	var posName = '';
	var posRank = '';
	switch (posRef) {
		case "Front Row":
			posName = "FRW";
			posNum = 0;
			break;
		case "Lock":
			posName = "LOC";
			posNum = 1;
			break;
		case "Loose Forward":
			posName = "BKR";
			posNum = 2;
			break;
		case "Half Back":
			posName = "SHV";
			posNum = 3;
			break;
		case "Fly Half":
			posName = "FLH";
			posNum = 4;
			break;
		case "Midfielder":
			posName = "CTR";
			posNum = 5;
			break;
		case "Outside Back":
			posName = "OBK";
			posNum = 6;
			break;
	}
	return { 'posName': posName, 'posNum': posNum };


}

function findDraftRound(round, getGames) {
	var roundGroupings = [[0, 1], [2, 5], [6, 9], [10, 13], [14, 17], [18, 21], [22, 25], [26, 29], [30, 33], [34, 37], [38, 39]];
	for (var i = 0; i < roundGroupings.length; i++) {
		if ((roundGroupings[i][0] <= round) && (round <= roundGroupings[i][1])) {
			if (getGames) {
				return roundGroupings[i];
			} else {
				return i+1;

			}
		}
	}
}
function findGameForRound(round) {
	var roundGroupings = [[0, 1], [2, 5], [6, 9], [10, 13], [14, 17], [18, 21], [22, 25], [26, 29], [30, 33], [34, 37], [38, 39]];		
				return roundGroupings[round][0];
}