var createError    = require("http-errors");
var express        = require("express");
var path           = require("path");
var cookieParser   = require("cookie-parser");
var logger         = require("morgan");
var sassMiddleware = require("node-sass-middleware");
var domoticz       = require("domoticz-heaters");

// routers
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

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

/*
// load configs (put that file where it suits you)
domoJS.loadConfigs( path.join(__dirname, "configs.json"));

// get wanted temperatures from Google Sheet only once an hour
if (new Date().getMinutes() === 0)
    domoJS.getTempsFromGoogleSheet();

// load house state (put that file where you want)
domoJS.loadState( path.join(__dirname, "house_state.json"));

// load wanted temperatures from local Google Sheet "cache" file
domoJS.loadWantedTemps( path.join(__dirname, "wantedTemps.json"));

// we get the state of the switches of the heaters from Domoticz
// then it fetches current temperatures
// then it sends ON / OFF commands
domoJS.updateSwitchesStatus();

// update power consumption to Google Sheet once an hour
if (new Date().getMinutes() === 58)
	domoJS.uploadToGoogleSheet();
*/

app.use("/", indexRouter);
app.use("/users", usersRouter);

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
