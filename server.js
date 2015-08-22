var connect = require('connect');
var http = require('http');

var app = connect();

app.use(function(req, res, next) {
    
});

http.createServer(app).listen(4200);
console.log(String.format('Started nest server, listening %s');