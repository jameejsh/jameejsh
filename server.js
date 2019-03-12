/********************************************
 * DO NOT EDIT THIS FILE
 * the verification process may break
 *******************************************/

var express = require('express');
var api = express.Router();
var fs = require('fs');
var path = require('path');

api.use(function(req, res, next) {
  res.set({
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Headers" : "Origin, X-Requested-With, content-type, Accept"
  });
  next();
});

api.get('/file/*?', function(req, res, next) {
  if(req.params[0] === '.env') { return next({status: 401, message: 'ACCESS DENIED'}) }
  fs.readFile(path.join(__dirname, req.params[0]), function(err, data){
    if(err) { return next(err) }
    res.type('txt').send(data.toString());
  });
});


var main = require('./myApp.js');
api.get('/app-info', function(req, res) {
  // list middlewares mounted on the '/' camper's app
  var appMainRouteStack = main._router.stack
    .filter(s => s.path === '')
    .map(l => l.name)
    // filter out express default middlewares
    .filter(n => !(n === 'query' ||
      n === 'expressInit' || n === 'serveStatic'));

    // filter out CORS Headers
    var hs = Object.keys(res.getHeaders())
      .filter(h => !h.match(/^access-control-\w+/));
    var hObj = {};
    hs.forEach(h => {hObj[h] = res.getHeaders()[h]});
    delete res._headers['strict-transport-security'];
  res.json({headers: hObj, appStack: appMainRouteStack });
});

api.get('/package.json', function(req, res, next) {
	    fs.readFile(__dirname + '/package.json', function(err, data) {
	      if(err) return next(err);
	      res.type('txt').send(data.toString());
	    });
	  });

api.use(function(req, res, next){
  res.status(404).type('txt').send('Not Found');
});

module.exports = api;

/********************************************
 * DO NOT EDIT THIS FILE
 * the verification process may break
 *******************************************/
