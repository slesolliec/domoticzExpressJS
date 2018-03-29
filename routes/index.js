var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {

    // we get the state of the House
    var state = JSON.parse( fs.readFileSync( path.join(__dirname, '..' ,'data', 'house-state.json')));

    res.render('index', { title: 'House state', rooms: state.rooms });
});

module.exports = router;
