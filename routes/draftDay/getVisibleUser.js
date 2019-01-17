var express = require('express');
var users = require('../../playerfiles/userLogins');
var router = express.Router();
var fs = require('fs');
/* GET home page. */
router.get('/:code', function(req, res, next) {
    var userID = -1;
    for(var i =0;i<users.length;i++){
        if(users[i].code==req.params.code){
            userID = i
        }
    }
    res.send(users[userID].usr);
	
});

module.exports = router;
