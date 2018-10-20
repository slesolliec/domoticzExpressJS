var createError    = require("http-errors");
var express        = require("express");
var path           = require("path");
var cookieParser   = require("cookie-parser");
var logger         = require("morgan");
var sassMiddleware = require("node-sass-middleware");
var domoticz       = require("domoticz-heaters");

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
app.use(sassMiddleware({
	src: path.join(__dirname, "public"),
	dest: path.join(__dirname, "public"),
	indentedSyntax: true, // true = .sass and false = .scss
	sourceMap: true
}));
app.use(express.static(path.join(__dirname, "public")));

// pluging the domoticz module
app.locals.domoticz = domoticz;
app.locals.domoticz.loadConfigs(path.join(__dirname, "data/configs.json"));
app.locals.domoticz.loadState(  path.join(__dirname, "data/house-state.json"));
app.locals.domoticz.getTempsFromGoogleSheet();
// load wanted temperatures from local Google Sheet "cache" file
app.locals.domoticz.loadWantedTemps( path.join(__dirname, "data/wantedTemps.json"));

// should be done @XX:00
setInterval(app.locals.domoticz.getTempsFromGoogleSheet, 3600*1000);
// should be done once an hour
setInterval(app.locals.domoticz.uploadToGoogleSheet, 3600*1000);

// we get the state of the switches of the heaters from Domoticz
// then it fetches current temperatures
// then it sends ON / OFF commands
setInterval(app.locals.domoticz.updateSwitchesStatus, 60*1000);

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
