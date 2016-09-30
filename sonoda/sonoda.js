var eventEmitter = new require('events').EventEmitter();
var sonoda = function() {};

sonoda.prototype = Object.create(require('events').EventEmitter.prototype);

sonoda.prototype.start = function() {
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    var self = this;
    var cfenv = require('cfenv');
    var appEnv = cfenv.getAppEnv();

    app.use(bodyParser.json());

    app.get('/conf', function (req, res) {
        console.log("test %j",req.body);
        res.send(appEnv.getServices());
        //self.testcall(req.body, res);
    });

    app.get('/register', function (req, res) {
        console.log("test %j",req.body);
        self.testcall(req.body, res);
    });

    app.get('/v0/listdebt', function (req, res) {
        console.log("test %j",req.body);
        self.listdebttest(req.body, res);
    });

    app.get('/v0/listcredit', function (req, res) {
        console.log("test %j",req.body);
        self.listcredittest(req.body, res);
    });

    
    app.listen(appEnv.port, '0.0.0.0', function() {

      console.log("server starting on " + appEnv.url);
    });
}

sonoda.prototype.testcall = function(query, res) {
    //call function here to facade
    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err){
                return callback(err, null);
            });

            sonodaFacade.register(query);
        }
    ], function(err, result) {
        if (err) return res.status(500).json(err);

        return res.json(result);
    });

    return;
}

sonoda.prototype.listdebttest = function(query, res) {
    //call function here to facade
    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");
    var listdebtjson = require("./listdebt.json");

    res.json(listdebtjson);

    return;
}

sonoda.prototype.listcredittest = function(query, res) {
    //call function here to facade
    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");
    var listdebtjson = require("./listcredit.json");

    res.json(listdebtjson);

    return;
}


module.exports = new sonoda();
