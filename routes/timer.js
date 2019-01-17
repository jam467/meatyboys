var express = require('express');
var users = require('../playerfiles/userLogins');

var router = express.Router();
var fs = require('fs');
/* GET home page. */
router.get('/:toChange', function(req, res, next) {
    res.send('success');
    //console.log(JSON.stringify(req));
    var start = new Date();
    var currUser = users[0].usr;
    var selectionTime = 90 * 1000;
    var timeobj = {time:start,usr:currUser};
    console.log("Start Timer is:" + req.params.toChange);
    if(req.params.toChange=="start"){       
        fs.writeFile('playerfiles/time.txt', JSON.stringify(timeobj), function (err) {
            //if (err) throw err;
        console.log('Saved start time');
        });
        var x = setInterval(function(){
            
        getTimeData().then((body)=>{            
            start = body.time;
            currUser = body.usr;
            if(((new Date())-(new Date(start)))>=selectionTime){ 
                currUser = users[nextUser(currUser,users)].usr;
                start = new Date();
                timeobj = {time:start,usr:currUser};
                setTimeDate(timeobj);
                
            }
         })
        },500);
    }else if(req.params.toChange=="false"){
        getTimeData().then((body)=>{        
            var user = body.usr;
            start = new Date();
            console.log("Changing to user: "+users[nextUser(user,users)].usr);
            timeobj = {time:start,usr:(users[nextUser(user,users)].usr)}
            setTimeDate(timeobj);
        });
        
    }else{
        var timeout = Number(req.params.toChange);
        getTimeData().then((body)=>{
            var waitTill = new Date(body.time);
            waitTill = waitTill.setTime(waitTill.getTime() + (timeout*1000*60));
            waitTill = new Date(waitTill);
            var UserNow = body.usr;
            console.log("Adding time to user: "+UserNow);
            timeobj = {time:waitTill,usr:UserNow}
            setTimeDate(timeobj);

        });
    }
    

	
});
function getTimeData(){
    return new Promise((resolve,reject)=>{
        fs.readFile('playerfiles/time.txt', function(err, data) {
            resolve(JSON.parse(data));
        });
  
    });
}
function setTimeDate(obj){
    fs.writeFile('playerfiles/time.txt', JSON.stringify(obj), function (err) {
        
        console.log('Saved time');
     });
}
function nextUser(user){
    var userID = -1;
    for(var i =0;i<users.length;i++ ){
        if(users[i].usr==user){
            userID = i;
        }
    }
    if(userID>=(users.length-2)){//all user is at end
        userID=0;
    }else{
        userID++;
    }
    return userID;
}
module.exports = router;


