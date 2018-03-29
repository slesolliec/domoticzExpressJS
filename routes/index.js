var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var rooms = {
      'Kitchen': {
          name: 'Cuisine',
          temp: 18.0,
          heater: 'off',
          wanted: 17
      },
      'Living': {
          name: 'Salle',
          temp: 18.0,
          heater: 'off',
          wanted: 17
      },
      'Bathroom': {
          name: 'SdBain',
          temp: 18.0,
          heater: 'off',
          wanted: 17
      },
      'Bedroom': {
      name: 'Chambre',
      temp: 15.6,
      heater: 'on',
      wanted: 17
      }
  };


  res.render('index', { title: 'Express', how: 'cool', rooms: rooms });
});

module.exports = router;
