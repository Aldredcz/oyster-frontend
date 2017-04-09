/* eslint-disable */

var express = require('express'),
	path = require('path'),
	http = require('http'),
	fs = require('fs-extra');
//import PROJECT_CONSTANTS from '../../project.constants'

var app = express();

var isDev = process.env.NODE_ENV === 'development';
var __root = path.join(__dirname, '..', '..');

app.set('port', 9090);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__root));

app.route('/favicon.ico')
	.get(function(req, res) {
		res.end();
	});

var pageRouter = function(req, res) {
	res.render('main', {
		env: process.env.NODE_ENV,
		//PROJECT_CONSTANTS: PROJECT_CONSTANTS
	});
};

app.route('/(:route)?').get(pageRouter);

http.createServer(app).listen(app.get('port'), function(){
	console.log("[EXPRESS] Server listening on port " + app.get('port'));
});
