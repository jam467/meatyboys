    var moneyOn = 0;
	var firstHome = '';
	var firstAway = '';
	var fHomeId = '';
	var fAwayId = '';
	var cAwayId = '';
	var cHomeId = '';
	var currHome = '';
	var currAway = '';
	var gRound = 0;
	var users = [];
	var squads = [];
	var players = [];
	var rounds = [];
	var match = 0;
	var sortBy =0;
    var nameLength = 12;
	var roundFirstLoad =0;
	$( document ).ready(function() {
		$.get('/getSquads',function(data){
				console.log(data)
				squads = (data);
				dlRounds();
		});
		listRounds(17);
		var byeDropList = document.getElementById("navBar").innerHTML;
	});
	
    function listRounds(noRounds){
        var roundList = '';
        for(var i=0;i<noRounds;i++){
            roundList = roundList + '<li><a href="javascript:;" onclick="setRound('+(i)+')" id="priceChanges" data-toggle="collapse" data-target=".navbar-collapse.in" >Round '+(i+1)+'</a></li>'
        }
        document.getElementById("roundList").innerHTML = roundList;
    }
    
	function dlRounds(){
		rounds = []
		$.get('/getRounds',function(data){
			console.log(data);
			getRounds(data);
		});
	}
	
	function dlPlayers(){
		 var d = new Date();
		//document.getElementById("timestamp").innerHTML = d.toLocaleTimeString();
		users = [];
		players = [];
		$.get('/getPlayers',function(data){
				players = (data);
				console.log(data);
				getPlayers(data);
		});
		
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
		fillData(gRound,cHomeId,currHome,cAwayId,currAway,match);
	}
	
	var timer = setInterval(dlRounds, 30000);
	
	function addAllUsers(){
		
	}
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
			console.log(zoomCalc);U	
                            document.getElementById("navZoom").style.zoom=zoomCalc;
		}
	}
    function setRound(round){
        gRound = round;
        roundsThisWeek(1);
        fillData(gRound,fHomeId,firstHome,fAwayId,firstAway);
    }
	function getScore(home,away){

		var scores ={};
		for(var i=0;i<rounds[gRound].matches.length;i++){
			if((rounds[gRound].matches[i].home_squad_id==home)&&(rounds[gRound].matches[i].away_squad_id==away)){
				scores.home=rounds[gRound].matches[i].home_score;
				scores.away=rounds[gRound].matches[i].away_score;
				if(scores.home==null){
					scores.home = '';
				}
				if(scores.away==null){
		                                scores.away = '';
		                        }



			}
		}
		console.log(scores.home);
		return scores;
	}


	function fillData(roundNum,home,homeName,away,awayName,matchNo){
		onRegular = 0;
		var scores = getScore(home,away);
		match = matchNo;
		document.getElementById("round").innerHTML= "Round "+ (gRound+1)+'<span class="caret"></span>';
		document.getElementById("homeT").innerHTML=homeName+'<span id="homeVal"></span> <span id="scoreHome">'+scores.home+'</span>';
		document.getElementById("awayT").innerHTML='<span id="scoreAway">'+scores.away+'</span> '+awayName+'<span id="awayVal"></span>';
		cAwayId = away;
		cHomeId = home;
		currHome = homeName;
		currAway = awayName;
		var team1 = [];
		var team2 = [];
		var table = document.getElementById("playerTable");
		var list = "";
		console.log(roundNum+1);
		var team1Id = home;
		var team2Id = away;
		var round = roundNum+1;
		console.log(players.length);
		for (var i =0;i<players.length;i++){
		
			if((players[i].status == 'playing')){
			
				if(players[i].squad_id == team1Id){
					
					var posName =  getPos(players[i].positions[0]);
						
					
					
					var t1Score = players[i].stats.scores[round];
					if (t1Score == undefined){
						t1Score = "-";
					}
					
					team1.push({
						name:(players[i].first_name+" "+players[i].last_name),
						score:t1Score,
						playerId:players[i].id,
						position:players[i].positions[0],
						posName: posName,
						priceP: getPricePoint(players[i]),
          value:players[i].stats.prices[round],
						img: '<img height="71.14" width="56.92" src="http://dsj3fya52lhzn.cloudfront.net/media/fox_super_rugby/players/'+players[i].id+'.png" alt="'+(players[i].first_name+" "+players[i].last_name)+'">'
					});
				}else if(players[i].squad_id == team2Id){
					var ownerList2 = "";
					var posName =  getPos(players[i].positions[0]);
					
					
					
					var t2Score = players[i].stats.scores[round];
					if (t2Score == undefined){
						t2Score = "-";
					}
					team2.push({
						name:(players[i].first_name+" "+players[i].last_name),
						score:t2Score,
						playerId:players[i].id,
						position:players[i].positions[0],
						posName: posName,
						value:players[i].stats.prices[round],
						priceP:getPricePoint(players[i]),
						img: '<img height="71.14" width="56.92" src="http://dsj3fya52lhzn.cloudfront.net/media/fox_super_rugby/players/'+players[i].id+'.png" alt="'+(players[i].first_name+" "+players[i].last_name)+'">'
						
					});
				}
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
		var team1Value = getTeamValue(team1).toLocaleString();
  var team2Value = getTeamValue(team2).toLocaleString();
  document.getElementById("homeVal").innerHTML=' ($'+team1Value+')';
  document.getElementById("awayVal").innerHTML=' ($'+team2Value+')';
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
        
		console.log(team1.length,team2.length);
		for(var i=0;i<team1.length;i++){
			list = list + '<tr class="myRow">\
			<td width="5%" style="background-color:'+lColor+'">\
			<div class="rOwner">\
			'+'\
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
			<span id="playH'+i+'">($'+team1[i].priceP+'/pt)</span>\
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
			<span id="playA'+i+'">($'+team2[i].priceP+'/pt)</span>\
			</div>\
			</td>\
			<td width="5%"style="background-color:'+rColor+'">\
			<div class="rScore">\
			'+team2[i].score+'\
			</div>\
			</td>\
			<td width="5%" style="background-color:'+rColor+'">\
			<div class="rOwner">\
			'+'\
			</div>\
			</td>\
		</tr>'}
		document.getElementById("loader").style.display="none";
		var teamValString = '<br>\
				<span class="tValh">'+team1Value+'</span>\
				<span>VS</span>\
				<span class="tVala">'+team2Value+'</span>';
		console.log(list);
				
        table.innerHTML =  list;
		setZoom();
		showMoney(1);
	}
	function checkPlaying(user){
		



	}
	function getTeamValue(team){
		var teamVal = 0;
		for(var i =0;i<team.length;i++){
		    teamVal = teamVal+team[i].value;
		}
		return teamVal;

	}
	function getPricePoint(player){
	  var PP = (player.stats.prices[gRound+1]/player.stats.scores[gRound+1]);
	  if((isNaN(PP))||(PP==undefined)){
		PP="";
	  }
	  if(PP>=1000){
		PP = (PP/1000).toFixed(0)+"k";
	  }
	  return PP;
	  
	}
	function showMoney(fromLoad){
	  if(fromLoad!=1){
		if(moneyOn==0){
		  moneyOn=1;
		}else{
		  moneyOn=0;
		}
	  }
	  if(moneyOn==0){
		document.getElementById("homeVal").style.display="none";
		document.getElementById("awayVal").style.display="none";
		for(var i=0;i<25;i++){
		  if((document.getElementById("playH"+i))!=undefined){
		    document.getElementById("playH"+i).style.display="none";
		  }
		  if((document.getElementById("playA"+i))!=undefined){
		    document.getElementById("playA"+i).style.display="none";
		  }
		}
	  }else{
		document.getElementById("homeVal").style.display="inline";
		document.getElementById("awayVal").style.display="inline";
		for(var i=0;i<25;i++){
		  if((document.getElementById("playH"+i))!=undefined){
		    document.getElementById("playH"+i).style.display="inline";
		  }
		  if((document.getElementById("playA"+i))!=undefined){
		    document.getElementById("playA"+i).style.display="inline";
		  }
		}
	  }
	}
	function priceChanges(){
		onRegular = 1;
		var orderedPlayers = [];
		document.getElementById("homeT").innerHTML='Going Up';
		document.getElementById("awayT").innerHTML='Going Down';
		var table = document.getElementById("playerTable");
		var list = "";
		var round = gRound+1;
		var j = 0;
		for (var i =0;i<players.length;i++){
			var newPrice = players[i].stats.prices[round];
			var oldPrice = players[i].stats.prices[round-1];
			if((oldPrice!=undefined)&&(newPrice!=undefined)){
				var posName =  getPos(players[i].positions[0]);
				orderedPlayers[j] = {
						priceChange: newPrice-oldPrice,
						name:(players[i].first_name+" "+players[i].last_name),
						playerId:players[i].id,
						position:players[i].positions[0],
						posName: posName,
						owner: '',
						img: '<img height="71.14" width="56.92" src="http://dsj3fya52lhzn.cloudfront.net/media/fox_super_rugby/players/'+players[i].id+'.png" alt="'+(players[i].first_name+" "+players[i].last_name)+'">'
				}
				j++;
			}
		
		}
		orderedPlayers.sort(function(a, b){return b.priceChange-a.priceChange});
		//list length
		for (var i=0;i<20;i++){
			for(var j=0;j<users.length;j++){
				for(var k=0;k<users[j].result.lineup[orderedPlayers[i].position].length;k++){
					if(orderedPlayers[i].playerId==users[j].result.lineup[orderedPlayers[i].position][k]){
						if(users[j].result.lineup.captain==orderedPlayers[i].playerId){
							orderedPlayers[i].owner =orderedPlayers[i].owner + users[j].result.last_name.substring(0,nameLength)+"(C)<br>";
						}else{
							orderedPlayers[i].owner =orderedPlayers[i].owner + users[j].result.last_name.substring(0,nameLength)+"<br>";
						}
					}
				}
				
			}
			var b = orderedPlayers.length-1-i;
			console.log("d"+b+"I"+i);
			for(var j=0;j<users.length;j++){
				for(var k=0;k<users[j].result.lineup[orderedPlayers[b].position].length;k++){
					if(orderedPlayers[b].playerId==users[j].result.lineup[orderedPlayers[b].position][k]){
						if(users[j].result.lineup.captain==orderedPlayers[b].playerId){
							orderedPlayers[b].owner =orderedPlayers[b].owner+users[j].result.last_name.substring(0,nameLength)+"(C)<br>";
						}else{
							orderedPlayers[b].owner =orderedPlayers[b].owner+users[j].result.last_name.substring(0,nameLength)+"<br>";
						}
					}
				}
				
			}
			var lColor = "#0dff05";
			var rColor = "#FF2828";
			list = list + '<tr class="myRow">\
			<td width="5%" style="background-color:'+lColor+'">\
			<div class="rOwner">\
			'+orderedPlayers[i].owner+'\
			</div>\
			</td >\
			<td width="5%" style="background-color:'+lColor+'">\
			<div class="rScore">\
			$'+orderedPlayers[i].priceChange+'\
			</div>\
			</td>\
			<td width="31%" style="background-color:'+lColor+'">\
			<div class="rName">\
			'+orderedPlayers[i].name+'\
			</div>\
			</td>\
			<td width="5%" class="rImg" style="background-color:'+lColor+'">\
			'+orderedPlayers[i].img+'\
			</td>\
			<td width="3%" style="background-color:'+lColor+'">\
			<div class="verticaltext">\
			'+orderedPlayers[i].posName+'\
			</div>\
			</td>\
			<td width="2%" >\
			<br>\
			VS\
			</td>\
			<td width="3%"  style="background-color:'+rColor+'">\
			<div class="verticaltext">\
			'+orderedPlayers[b].posName+'\
			</div>\
			</td>\
			<td width="5%"  class="rImg" style="background-color:'+rColor+'">\
			'+orderedPlayers[b].img+'\
			</td>\
			<td width="31%" style="background-color:'+rColor+'">\
			<div class="rName">\
			'+orderedPlayers[b].name+'\
			</div>\
			</td>\
			<td width="5%"style="background-color:'+rColor+'">\
			<div class="rScore">\
			$'+orderedPlayers[b].priceChange+'\
			</div>\
			</td>\
			<td width="5%" style="background-color:'+rColor+'">\
			<div class="rOwner">\
			'+orderedPlayers[b].owner+'\
			</div>\
			</td>\
			</tr>'
			table.innerHTML =  list;
		}
		
		
	}
	function updateByMatch(matchNo){
	  console.log(matchNo);
	  for(var i=0;i<squads.length;i++){
	  if(rounds[gRound].matches[matchNo].away_squad_id==squads[i].id){
					awayTeam = squads[i].name;
					awayId = squads[i].id;
	  }
		if(rounds[gRound].matches[matchNo].home_squad_id==squads[i].id){
					homeTeam = squads[i].name;
					homeId = squads[i].id;
		}
	  }
	  fillData(gRound,homeId,homeTeam,awayId,awayTeam,matchNo);
	}
	 $(function() {
  //Enable swiping...
  $("#dashSpace").swipe( {
    //Generic swipe handler for all directions
    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
      //$(this).text("You swiped " + direction );
      
      if(direction=="right"){
        if(match>0){
          match = match - 1;
          updateByMatch(match);
        }
      }else if(direction=="left"){
        if(match<(rounds[gRound].matches.length-1)){
          match= match + 1;
          updateByMatch(match);
        }
      }
    },
    //Default is 75px, set to 0 for demo so any distance triggers swipe
     //threshold:0
    allowPageScroll:"vertical"
  });
});
	function roundsThisWeek(changeRound){
		var found = 0;
		var round = 0;
        if(changeRound==null){
            for(var i=0;i<rounds.length;i++){
                if(((rounds[i].status=="scheduled")||(rounds[i].status=="active"))&&(found!=1)){
                    round = i;
                    found = 1;
                }
		     }
        }else{
            round = gRound;
        }
		var navBar = '';
		var homeTeam = '';
		var awayTeam = '';
		var hfound = 0;
		var afound = 0;
		var matchNow = 0;
		var noBye = [];
		var matchOn = 0;
        
		for(var j=0;j<rounds[round].matches.length;j++){
			for(var k=0;k<squads.length;k++){
				if(rounds[round].matches[j].home_squad_id==squads[k].id){
					homeTeam = squads[k].name;
					homeId = squads[k].id;
					if(hfound!=1){
						firstHome = homeTeam;
						matchOn = j;
					}
					hfound = 1;
                    noBye.push(homeTeam);
				}
				if(rounds[round].matches[j].away_squad_id==squads[k].id){
					awayTeam = squads[k].name;
					awayId = squads[k].id;
					if(afound!=1){
						firstAway = awayTeam;
					}
					afound = 1;
                    noBye.push(awayTeam);
				}
			}
			navBar = navBar + '<li><a data-toggle="collapse" data-target=".navbar-collapse.in" href="javascript:;" onClick="fillData('+round+',\''+homeId+'\',\''+homeTeam+'\',\''+awayId+'\',\''+awayTeam+'\',\''+j+'\')">'+homeTeam+' v '+awayTeam+'</a></li>';
			var today = new Date();
			var matchTime = new Date(rounds[round].matches[j].date);
    if(matchNow==0){
			  if(today<matchTime.setHours(matchTime.getHours()+2)){
				  firstAway = awayTeam;
				  firstHome = homeTeam;
				  matchOn = j;
				  match = j;
				  matchNow += 1;
				  console.log(matchNow);
			  }
    }
		}
		document.getElementById("games").innerHTML = navBar;
		gRound = round;
		fAwayId = rounds[round].matches[matchOn].away_squad_id;
		fHomeId = rounds[round].matches[matchOn].home_squad_id;
        //find byes
        var byes = "";
        for(var k=0;k<squads.length;k++){
            var fNoBye = 0;
            for(var j=0;j<noBye.length;j++){
                if(noBye[j]==squads[k].name){
                    fNoBye = 1;
                }
            }
            if(fNoBye==0){
                byes = byes + '<li><a data-toggle="collapse" data-target=".navbar-collapse.in">'+squads[k].name+'</a></li>';
            }
        }
		document.getElementById("byes").innerHTML=byes;
	}
	function addUser(){
			if(currAway==""){
				fillData(gRound,fHomeId,firstHome,fAwayId,firstAway,match);
			}else{
				if(onRegular==0){
					console.log(gRound,cHomeId,currHome,cAwayId,currAway);
					fillData(gRound,cHomeId,currHome,cAwayId,currAway,match);
				}else{
					priceChanges();
				}
			}
			
		}
    function chooseColour(team){
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
	function getPos(posNum){
		switch(posNum){
			case 1:
				posName = "PRP"
				break;
			case 2:
				posName = "HOK"
				break;
			case 3:
				posName = "LOC"
				break;
			case 4:
				posName = "BKR"
				break;
			case 5:
				posName = "SHV"
				break;
			case 6:
				posName = "FLH"
				break;
			case 7:
				posName = "CTR"
				break;
			case 8:
				posName = "OBK"
				break;
		}
		return posName;
							
					
	}
	function getRounds(response){
		rounds = response;
		if(roundFirstLoad==0){
			roundsThisWeek();
			roundFirstLoad += 1;
		}
		dlPlayers();
	}
	function getPlayers(response){
		players = response;
		addUser();
		
	}

