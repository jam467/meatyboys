var express = require('express');

var router = express.Router();
var fs = require('fs');
router.post('/', function(req, res, next) {
    fs.writeFile('playerfiles/users.txt', req.body.userList, function (err) {
        //if (err) throw err;
       console.log('Saved!');
       res.send('success');
    });

	
});

module.exports = router;