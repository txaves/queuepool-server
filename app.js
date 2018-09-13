var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});
app.use('/', require('./routes'));
app.use(express.static('queuepool/'));

var port = process.env.PORT;
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
