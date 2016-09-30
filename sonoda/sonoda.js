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

    app.post('/bri/merchant/register', function(req, res) {
        console.log("req %j", req.body);
        self.regiterMerchant(req.body, res);
    });

    app.post('/bri/tbank/register', function(req, res) {
        console.log("req %j", req.body);
        self.registrasiTBank(req.body, res);
    });

    app.post('/bri/tbank/saldo', function(req, res) {
        console.log("req %j", req.body);
        self.infoSaldoTBank(req.body, res);
    });

    app.post('/bri/tbank/token', function(req, res) {
        console.log("req %j", req.body);
        self.requestTokenTBank(req.body, res);
    });

    app.post('/bri/tbank/topup', function(req, res) {
        console.log("req %j", req.body);
        self.topUpTBank(req.body, res);
    });

    app.post('/bri/tbank/trans', function(req, res) {
        console.log("req %j", req.body);
        self.transferTBank(req.body, res);
    });

    app.post('/bri/tbank/belanja', function(req, res) {
        console.log("req %j", req.body);
        self.belanjaTBank(req.body, res);
    });

    app.post('/bri/tbank/ganti', function(req, res) {
        console.log("req %j", req.body);
        self.gantiPINTBank(req.body, res);
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

sonoda.prototype.responseGeneration = function(res, err, result){
    if (err) {
        var response = {
            success : '0',
            data : '{}',
            message : err
        };
        return res.status(500).json(response);
    } else {
        var response = {
                    success : '0',
                    data : result,
                    message : "success"
                };
        return res.json(response);
    }
}

sonoda.prototype.regiterMerchant = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.regiterMerchant(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}

sonoda.prototype.registrasiTBank = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.registrasiTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}

sonoda.prototype.infoSaldoTBank = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.infoSaldoTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}

sonoda.prototype.inquiryBelanjaTBank = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.inquiryBelanjaTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}

sonoda.prototype.requestTokenTBank = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.requestTokenTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}

sonoda.prototype.topUpTBank = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.topUpTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}

sonoda.prototype.transferTBank = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.transferTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}


sonoda.prototype.belanjaTBank = function(params, res) {

    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.belanjaTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}

sonodaFacade.prototype.gantiPINTBank = function(params) {
    var sonodaCore = require('./sonoda-core.js');
    var self = this;

    sonodaCore.gantiPINTBank(params);

    sonodaCore.on("success", function(response) {
        self.success(response);
    });

    sonodaCore.on("error", function(err) {
        self.error(err);
    });
}


module.exports = new sonoda();
