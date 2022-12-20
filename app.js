const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const crypto = require('crypto');

const server = require('./network/server');

const indexRouter = require('./routes/index');
const infoRouter = require('./routes/info');

const app = express();


const PROXIMA_SERVICE = "proxima";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {

    const service = hostnameToService(req.hostname);

    if (service !== PROXIMA_SERVICE) {

        console.log(req.url);
        console.log(req.destination);
        console.log(req.hostname);
        console.log(req.ip);
        console.log(req.protocol);
        console.log(req.method);

        server.requestProcessing(req, res, next);
    }

    // next(createError(404));
});


app.use("/info", infoRouter);
app.use("/", indexRouter);

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


fs.readFile('./data/logo.txt', 'utf8', (err, data) => {
    if (!err)
        console.log(data);
});


function hostnameToService(hostname) {

    let result = "";

    if (hostname != null) {

        hostname = String(hostname);

        const split = hostname.trim().split(".");

        if (split.length > 0) {
            result = split[0];
        }
    }


    return result;
}

server.start();

module.exports = app;
