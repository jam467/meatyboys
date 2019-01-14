var express = require('express');

var router = express.Router();
var fs = require('fs');
var request = require('request');
/* GET home page. */
router.get('/:id', function(req, res, next) {
    var users = [{code:'James123',usr:'James'},{code:'James123',usr:'Jonty'}];
    res.send('success');
    //console.log(JSON.stringify(req));
    var start = new Date();
    var noUsers = users.length;
    var currUser = users[0].usr;
    var i =0;
    fs.writeFile('playerfiles/time.txt', '{"time":'+JSON.stringify(start)+',"usr":'+JSON.stringify(currUser)+'}', function (err) {
        //if (err) throw err;
       console.log('Saved Rem');
    });
    if(req.body.toChange!=true){
        var x = setInterval(function(){
            
            request('http://localhost/getTimer', function (error, response, body) {
                start = response.body.time;
                console.log(start);
                currUser = response.usr;
                if(((new Date())-start)>=90000){ 
                    if(i>=(noUsers-1)){
                        i=0;
                    }else{
                        i++;
                    }
                    currUser = users[i].usr;
                    start = new Date();
                    fs.writeFile('playerfiles/time.txt', '{"time":'+JSON.stringify(start)+',"usr":'+JSON.stringify(currUser)+'}', function (err) {
                        //if (err) throw err;
                        console.log('Saved time');
                    });
                    
                }
         })
        },500);
    }else{
        if(i>=(noUsers-1)){
            i=0;
        }else{
            i++;
        }
        currUser = users[i].usr;
        start = new Date();
        fs.writeFile('playerfiles/time.txt', '{"time":'+JSON.stringify(start)+',"usr":'+JSON.stringify(currUser)+'}', function (err) {
        
            console.log('Saved time');
        });
    }
    

	
});

module.exports = router;


