var express = require("express");
var router  = express.Router();


router.get("/", function(req, res, next) {
	res.render("index", { title: "House state", rooms: req.app.locals.domoticz.state.rooms });
});


router.get("/getState", function(req, res, next) {
	res.setHeader("Content-Type", "application/json");

	let tosend = req.app.locals.domoticz.state;
	tosend.googleTempSheetUrl = 'https://docs.google.com/spreadsheets/d/' + req.app.locals.domoticz.configs.GoogleTempSheetID;

	let domoUrl = req.app.locals.domoticz.configs.domoticz;
	domoBits = domoUrl.split('@');
	domoUrl = domoBits[0].split('//')[0] + '//' + domoBits[1];
	tosend.domoticzUrl = domoUrl;

	res.send( JSON.stringify(tosend, null, "	") );
});

router.get('/setTempModifier', function(req, res, next) {
	console.log("modifying temp of room " + req.query.room + ": " + req.query.tempModifier + " degrees for " + req.query.duration + " hours");
	req.app.locals.domoticz.state.rooms[req.query.room].tempModifier = parseInt(req.query.tempModifier);
	var now = new Date();
	now.setMinutes(now.getMinutes() + req.query.duration * 60);
	req.app.locals.domoticz.state.rooms[req.query.room].tempModifierUntil = now;
	// console.log(req.app.locals.domoticz.state);

	res.setHeader("Content-Type", "application/json");
	res.send( JSON.stringify(req.app.locals.domoticz.state, null, "	") );
});

router.get('/reloadGoogleSheet', function(req, res, next) {
	console.log("reloading Google Sheet");
	req.app.locals.domoticz.getTempsFromGoogleSheet();
	res.send('ok');
});

module.exports = router;
