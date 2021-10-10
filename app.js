var createError    = require("http-errors");
var express        = require("express");
var path           = require("path");
var cookieParser   = require("cookie-parser");
var logger         = require("morgan");
var domoticz       = require("domoticz-heaters");

// ugly
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// routers
var indexRouter = require("./routes/index");

// create app
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// pluging the domoticz module
app.locals.domoticz = domoticz;
app.locals.domoticz.loadConfigs(path.join(__dirname, "data/configs.json"));
app.locals.domoticz.loadState(  path.join(__dirname, "data/house-state.json"));
app.locals.domoticz.getTempsFromGoogleSheet();

// should be done @XX:00
setInterval(app.locals.domoticz.getTempsFromGoogleSheet, 3600*1000);
// should be done once an hour
// setInterval(app.locals.domoticz.uploadToGoogleSheet, 3600*1000);

// we get the state of the switches of the heaters from Domoticz
// then it fetches current temperatures
// then it sends ON / OFF commands
async function work() {

	// get wanted temperatures from Google Sheet only once an hour
	// (but the first time you run that script, comment off the if)
	if (new Date().getMinutes() === 0)
		await app.locals.domoticz.getTempsFromGoogleSheet();

	// change the state with current wanted temperatures
	await app.locals.domoticz.updateWantedTemps();

	// we load the temperatures from Domoticz
	await app.locals.domoticz.loadTemperaturesFromDomoticz();

	// from now, we have loaded the current state
	// + updated the wanted temperatures as the time goes by
	// + read the current temperatures from domotics

	await app.locals.domoticz.updateSwitches();

	await app.locals.domoticz.writeState(path.join(__dirname, "house_state.json"));

	console.log('-----');

//	console.log(domoJS.state.rooms.Bed);
//	console.log(domoJS.state.rooms.Bath2);
//	process.exit(1);
}

setInterval(work, 60 * 1000);

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
