var selectedUser = 'NOONE';//set this on input
var userStore = {};
var playerList = [];
var isActive = false;
var killTimer = false;
var selectionTime = 90 * 1000;
let timer;
render();
function render(){
    if(timer!=undefined){
        clearInterval(timer);
    }
    clearInterval(timer);
    getDraft().then((players)=>{
        playerList = players;
        getUsers().then((users)=>{
            userStore = users;
        });
    });
    getTime();
}
function save(){
    return new Promise((resolve,reject)=>{
        setDraft(playerList).then(()=>{
            setUsers(userStore).then(()=>{
                console.log("ALL UPDATED");
                resolve();
            });
        });
    });
}
function countDownTimer(time,usr){
    var countDownDate = new Date(time);
    countDownDate = countDownDate.setTime(countDownDate.getTime() + (selectionTime));
	// Update the count down every 1 second
	timer = setInterval(function() {
		
		// Get todays date and time
		var now = new Date().getTime();

		// Find the distance between now an the count down date
		var distance =  countDownDate - now;

		// Time calculations for days, hours, minutes and seconds
		// var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		// var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		// Display the result in the element with id="demo"
		document.getElementById("timer").innerHTML = minutes + "m " + seconds + "s " + "( " +usr+" ) ";

		// If the count down is finished, write some text 
		if ((distance < 0)||(killTimer==true)) {
            killTimer =false;
            clearInterval(timer);
            setTimeout(function(){
                render();
            },500);
		}
	}, 1000);
	
}
function getTime(){
    return new Promise((resolve,reject)=>{
        $.get('/getTimer',function(data){
            if(selectedUser==data.usr){
                isActive = true;
            }else{
                isActive = false;
            }
            countDownTimer(data.time,data.usr);
            resolve();
        });
    })
}


function getDraft(){
    return new Promise((resolve,reject)=>{
        $.get('/getDraft',function(data){
            var players = (data);
            console.log(data);
            var playerTable = '';
            for(var i =0;i<players.length;i++){
                playerTable = playerTable+ '<tr><td onClick="addPlayer('+i+')">'+players[i].rank+')   '+players[i].name+'</td></tr>';
            }
            document.getElementById('playerTable').innerHTML = '<tr><th>Remaining Players</th></tr>' + playerTable;
            resolve(players);
        });
    })
}

function setDraft(FullPlayerList){
    return new Promise((resolve,reject)=>{
        $.post('/setDraft',{players:(JSON.stringify(FullPlayerList))},function(data){
            console.log("SAVED");
            resolve();
        });
    })
}

function setUsers(userList){
    return new Promise((resolve,reject)=>{
        $.post('/setUsers',{userList:(JSON.stringify(userList))},function(data){
            console.log("SAVED");
            resolve();
        });
    })
}
function getUsers(){
    return new Promise((resolve,reject)=>{
        $.get('/getUsers',function(data){
            var userStore = (data);
            console.log(userStore[selectedUser]);
            var userTable = '';
            if(selectedUser=='all'){
                Object.keys(userStore).forEach(function(usr){
                    if(userStore[usr]==undefined){
                        userStore[usr] = [];
                    }
                    userTable = userTable + '<tr><th>'+usr+'</th></tr>';
                    for(var i =0;i<userStore[usr].length;i++){
                        userTable = userTable+ '<tr><td onClick="removePlayer('+i+',\''+usr+'\')">'+userStore[usr][i].rank+')   '+userStore[usr][i].name+'</td></tr>';
                    }
                });
                document.getElementById('myPlayers').innerHTML = userTable;
            }else{
                if(userStore[selectedUser]==undefined){
                    userStore[selectedUser] = [];
                }
                for(var i =0;i<userStore[selectedUser].length;i++){
                    userTable = userTable+ '<tr><td>'+userStore[selectedUser][i].rank+')   '+userStore[selectedUser][i].name+'</td></tr>';
                }
                document.getElementById('myPlayers').innerHTML = '<tr><th>'+selectedUser+'</th></tr>' + userTable;
            }
                
            
            resolve(userStore);
        });
    });
}

function addPlayer(id){
    if(isActive){
        clearInterval(timer);
        if(selectedUser!='all'){
            $.get('/startTimer/false',function(data){
                console.log("SAVED");
            });
        
            userStore[selectedUser].push(playerList[id]);
            playerList.splice(id,1);
            save().then(()=>{
                render();
            });
        }
    }
}

function removePlayer(id,usr){
    if(selectedUser=='all'){
        playerList.push(userStore[usr][id]);
        userStore[usr].splice(id,1);
        save().then(()=>{
            render();
        });
    }
}
function lookUpUser(){
    var code = document.getElementById('code').value;
    document.getElementById('code').style.display = "none";
    document.getElementById('codeButton').style.display = "none";
    $.get('/getVisibleUser/'+code,function(data){
        selectedUser = data;
        render();
    });
}