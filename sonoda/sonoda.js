var eventEmitter = new require('events').EventEmitter();
var sonoda = function() {};

sonoda.prototype = Object.create(require('events').EventEmitter.prototype);

sonoda.prototype.start = function() {
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    var self = this;
    var cfenv = require('cfenv');

    app.use(bodyParser.json());

    app.get('/testcall', function (req, res) {
        console.log("test %j",req.body);
        res.send("{ hello world !}");
        //self.testcall(req.body, res);
    });

    var appEnv = cfenv.getAppEnv();
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


module.exports = new sonoda();
