var express = require("express");
var router  = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {

	res.render("index", { title: "House state", rooms: req.app.locals.domoticz.state.rooms });

});

router.get("/getState", function(req, res, next) {

	res.setHeader("Content-Type", "application/json");
	res.send( JSON.stringify(req.app.locals.domoticz.state, null, "	") );

});

module.exports = router;
