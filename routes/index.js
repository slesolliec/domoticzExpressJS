var express = require("express");
var router  = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {

	res.render("index", { title: "House state", rooms: req.app.locals.domoticz.state.rooms });

});

module.exports = router;
