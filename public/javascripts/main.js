
	var gRound = 1;
	var Round = [];
	var users = [];
	var draftData = [];
	var sortBy =0;
	var nameLength = 12;
	var matchNo = 0;
	var roundFirstLoad =0;
	$( document ).ready(function() {
		$.get('/getRound',function(roundD){
			gRound = roundD.round;
			$.get('/getScoreboard/'+gRound,function(data){
				for(var i=0;i<data.length;i++){
					if(data[i].is_match_running==true){
						matchNo=i;
						i= data.length;
					}
				}
				getRound();
				listRounds(gRound);//set to latest round
			});
		});
	});
    function getRound(){
		$.get('/getPlayers/'+gRound,function(data){
			//console.log(data)
			Round = (data);
			getDraft().then(()=>{
				roundsThisWeek();
				getCurrentSeason();
				fillData();
			});
		});
	}
	function refreshData(){
		getDraft().then(()=>{
			fillData();
		});
	}
	function getCurrentSeason(){
		return new Promise((resolve,reject)=>{
			$.get('/getcurrSeason',function(data){
				//console.log(data)
				resolve(data);
			});
		})
	}

	
	function getDraft(){
		return new Promise((resolve,reject)=>{

			$.post('/getDraft',{"round":(gRound)},function(data){
				//console.log(data)
				draftData = (data);
				resolve();
			});		
		});
	}
	function listRounds(noRounds){
    	var roundList = '';
        for(var i=0;i<noRounds;i++){
            roundList = roundList + '<li><a href="javascript:;" onclick="setRound('+(i+1)+')" id="priceChanges" data-toggle="collapse" data-target=".navbar-collapse.in" >Round '+(i+1)+'</a></li>'
        }
        document.getElementById("roundList").innerHTML = roundList;
    }
	
	function toggleSortBy(){
		var button = document.getElementById("sortBy");
		if(sortBy==0){
			sortBy = 1;
			button.firstChild.data = "Sort by Score";
		}else{
			sortBy = 0;
			button.firstChild.data = "Sort by Position";
		}
		fillData();
	}
	
	
	var timer = setInterval(refreshData, 30000);
	

	var loadedOnce =0;
	
	function setZoom(){
		if(screen.width<992){
			document.getElementById("navZoom").style.zoom=2;
			document.getElementById("dashSpace").style.paddingTop='110px';
			var navBrandMob = document.getElementById("headerNav").innerHTML;
			if(loadedOnce==0){
				document.getElementById("headerNav").innerHTML=navBrandMob + '<a class="navbar-brand" href="#">Fantasy Meaty Boys</a>'
				loadedOnce +=1;
			}
		}
		if((screen.width<1700)&&(screen.width>992)){
			var zoomCalc = (screen.width-992)/(1700-992)*.5+.5;
			console.log(zoomCalc);
                            document.getElementById("navZoom").style.zoom=zoomCalc;
		}
	}
    function setRound(round){
        gRound = round;
        getRound();
    }
	function getScore(){
		$.get('/getScoreboard/'+gRound,function(data){
			document.getElementById("scoreHome").innerHTML=" "+data[matchNo].team_A.score;
			document.getElementById("scoreAway").innerHTML=data[matchNo].team_B.score;
			
		});
	}


	function fillData(){
		var homeName = Round[matchNo].team_A.name;
		var awayName = Round[matchNo].team_B.name;
		document.getElementById("round").innerHTML= "Round "+ (gRound)+'<span class="caret"></span>';
		document.getElementById("homeT").innerHTML=homeName+'<span id="scoreHome"></span>';
		document.getElementById("awayT").innerHTML='<span id="scoreAway"></span> '+awayName;
		getScore();
		var team1 = [];
		var team2 = [];
		var table = document.getElementById("playerTable");
		var list = "";
		var team1Name = homeName;
		var team2Name = awayName;
		var round = gRound;
		//Draft player name
		for (var i =0;i<draftData.length;i++){
			if(draftData[i].team == team1Name.substring(0,3).toUpperCase()){
				
				var posDetails =  getPos(draftData[i].position);
					
			
				var t1Score = 0;
					t1Score = draftData[i].score;
				
					
				var ownerName = "";
				if((draftData[i].userName != "Free Agent")&&(draftData[i].userName.slice(0,7)!="WAIVERS")){
					ownerName = draftData[i].userName;
				}
				team1.push({
					name:draftData[i].playerName,
					owner:ownerName,
					score:t1Score,
					position:posDetails.posNum,
					posName: posDetails.posName,
					img: ''
					});
			}else if(draftData[i].team == team2Name.substring(0,3).toUpperCase()){
				var posDetails =  getPos(draftData[i].position);
				
				
				
				var t2Score = 0;
					t2Score = draftData[i].score;
			
				
				var ownerName = "";
				if((draftData[i].userName != "Free Agent")&&(draftData[i].userName.slice(0,7)!="WAIVERS")){
					ownerName = draftData[i].userName;
				}
				team2.push({
					name:draftData[i].playerName,
					owner:ownerName,
					score:t2Score,
					position:posDetails.posNum,
					posName: posDetails.posName,
					img: ''
				});
			}
			
		}
		var blankObj = {
						name:'',
						score:'',
						playerId:'',
						position:'',
						posName: '',
						owner:'',
						img:''
					}
		var lColor = chooseColour(homeName);
		var rColor = chooseColour(awayName);
		var diff = 0;
		if(sortBy == 1){
			team1.sort(function(a, b){return a.position-b.position});
			team2.sort(function(a, b){return a.position-b.position});
		}else{
			team1.sort(function(a, b){return b.score-a.score});
			team2.sort(function(a, b){return b.score-a.score});
		}
		if(team1.length<team2.length){
			diff = team2.length - team1.length;
			for(var l =0;l<diff;l++){
				team1.push(blankObj);
			}
		}else if(team1.length>team2.length){
			diff = team1.length - team2.length;
			for(var l =0;l<diff;l++){
				team2.push(blankObj);
			}
		}
        
		for(var i=0;i<team1.length;i++){
			list = list + '<tr class="myRow">\
			<td width="5%" style="background-color:'+lColor+'">\
			<div class="rOwner">\
			'+team1[i].owner+'\
			</div>\
			</td >\
			<td width="5%" style="background-color:'+lColor+'">\
			<div class="rScore">\
			'+team1[i].score+'\
			</div>\
			</td>\
			<td width="31%" style="background-color:'+lColor+'">\
			<div class="rName">\
			'+team1[i].name+'\
			</div>\
			</td>\
			<td width="5%" class="rImg" style="background-color:'+lColor+'">\
			'+team1[i].img+'\
			</td>\
			<td width="3%" style="background-color:'+lColor+'">\
			<div class="verticaltext">\
			'+team1[i].posName+'\
			</div>\
			</td>\
			<td width="2%" >\
			<br>\
			VS\
			</td>\
			<td width="3%"  style="background-color:'+rColor+'">\
			<div class="verticaltext">\
			'+team2[i].posName+'\
			</div>\
			</td>\
			<td width="5%"  class="rImg" style="background-color:'+rColor+'">\
			'+team2[i].img+'\
			</td>\
			<td width="31%" style="background-color:'+rColor+'">\
			<div class="rName">\
			'+team2[i].name+'\
			</div>\
			</td>\
			<td width="5%"style="background-color:'+rColor+'">\
			<div class="rScore">\
			'+team2[i].score+'\
			</div>\
			</td>\
			<td width="5%" style="background-color:'+rColor+'">\
			<div class="rOwner">\
			'+team2[i].owner+'\
			</div>\
			</td>\
		</tr>'}
		document.getElementById("loader").style.display="none";
				
        table.innerHTML =  list;
		setZoom();
	}

	 $(function() {
  //Enable swiping...
  $("#dashSpace").swipe( {
    //Generic swipe handler for all directions
    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
      //$(this).text("You swiped " + direction );
      
      if(direction=="right"){
        if(matchNo>0){
          matchNo = matchNo - 1;
		  fillData();
        }
      }else if(direction=="left"){
        if(matchNo<(Round.length-1)){
          matchNo= matchNo + 1;
          fillData();
        }
      }
    },
    //Default is 75px, set to 0 for demo so any distance triggers swipe
     //threshold:0
    allowPageScroll:"vertical"
  });
});
function roundsThisWeek(){
		var navBar = '';
		var teams = [];
		for(var i=0;i<Round.length;i++){
			var homeTeam = Round[i].team_A.name;
			var awayTeam = Round[i].team_B.name;
			teams.push(homeTeam);
			teams.push(awayTeam);
			navBar = navBar + '<li><a data-toggle="collapse" data-target=".navbar-collapse.in" href="javascript:;" onClick="changeMatch('+i+')">'+homeTeam+' v '+awayTeam+'</a></li>';

		}
		
		document.getElementById("games").innerHTML = navBar;
	getCurrentSeason().then((currD)=>{
		var byes = '';
		for(var j=0;j<currD.current_season.teams.length;j++){
			var found =0;
			var team = '';
			for(var i=0;i<teams.length;i++){
				if(teams[i]==currD.current_season.teams[j].name){
					found = 1;

				}
			}
			if(found==0){
				byes = byes + '<li><a data-toggle="collapse" data-target=".navbar-collapse.in" href="javascript:;" >'+currD.current_season.teams[j].name+'</a></li>';
			}
			found =0;
		}
		document.getElementById("byes").innerHTML=byes;

	})
}
function changeMatch(match){
	matchNo = match;
	fillData();
}
	
    function chooseColour(team){
		var colour = ''
        switch(team){
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
	function getPos(posRef){
		var posName = '';
		var posRank = '';
		switch(posRef){
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
		return {'posName':posName,'posNum':posNum};
							
					
	}
