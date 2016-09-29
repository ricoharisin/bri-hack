var eventEmitter = new require('events').EventEmitter();
var sonoda = function() {};

sonoda.prototype = Object.create(require('events').EventEmitter.prototype);

sonoda.prototype.start = function() {
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    var self = this;

    app.use(bodyParser.json());

    app.post('/testcall', function (req, res) {
        console.log("test %j",req.body);
        res.json("{ hello world !}");
        //self.testcall(req.body, res);
    });


    var server = app.listen(3000, function () {
        var figlet = require('figlet');

        figlet('SONODA', function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(data)
            console.log("Sonoda is up and running!! have a nice day!");

            return;
        });

        return;
    });

    return;
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
