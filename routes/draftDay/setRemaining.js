var express = require('express');

var router = express.Router();
var fs = require('fs');
router.post('/', function(req, res, next) {
    fs.writeFile('playerfiles/allplayers.txt', req.body.players, function (err) {
        //if (err) throw err;
       console.log('Saved Rem');
       res.send('success');
    });

	
});

module.exports = router;