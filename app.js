var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var sessionController = require('./controllers/session_controller');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos:
app.use(function(req, res, next) {
    // Guardar path en session.redir para después de login
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }

    // Hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});

// Mecanismo de autologout
app.use(function(req, res, next) {
    // Si existe login...
    if (req.session.user) {
        // Si existe última transacción con login...
        if (req.session.lastRequestDate) {
            var elapsedSeconds = (new Date() - new Date(req.session.lastRequestDate)) / 1000;

            // Si han transcurrido más de 2 minutos desde la última transacción HTTP...
            if (elapsedSeconds > 120) {
                sessionController.destroy(req, res);
                return;
            }
        }

        // Guardar en cada transacción con login la hora de sistema
        req.session.lastRequestDate = new Date();
    } else {
        // Borrar variable de hora de ñultima transacción con login
        delete req.session.lastRequestDate;
    }

    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
