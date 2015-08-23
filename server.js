var connect = require('connect');
var http = require('http');
var fs = require('fs');
var routes = require('./routing.js');
var urlParser = require('url');
var auth = require('./authenticate.js');

var st = require('st');
require('./test-runner.js');

var app = connect();

global.urls = require('./preset-urls.js');

var mount = st({
    path: 'static',
    url: 'static',
    cache: false
});

app.use(function(req, res, next) {
    var urlObject = urlParser.parse(req.url, true);

    var rgxTestPath = /^(\/tests\/.+)/;
    var rgxLoginPath = /^\/login/;
    console.log(req.method + ' : ' + urlObject.pathname);

    if (urlObject.pathname == '/') {
        routes.index(req, res, next);
    } else if (rgxTestPath.exec(urlObject.pathname)) {
        routes.runTest(req, res, next, urlObject);
    } else if (rgxLoginPath.exec(urlObject.pathname)) {
        routes.login(req, res, next, urlObject);
    } else {
        console.log('redirecting to next()');
        next();
    }
});

app.use(mount);

var portNumber = 4200;
http.createServer(app).listen(portNumber);
console.log('Started nest server, listening', portNumber);