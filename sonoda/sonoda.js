var eventEmitter = new require('events').EventEmitter();
var sonoda = function() {};

var kodeMerchant = 80077;
var passwordMerchant = "password";
var telpNumber = '085747212167';

sonoda.prototype = Object.create(require('events').EventEmitter.prototype);

sonoda.prototype.start = function() {
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    var self = this;
    var cfenv = require('cfenv');
    var appEnv = cfenv.getAppEnv();

    app.use(bodyParser.urlencoded({
        extended: true
    }));

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

    app.get('/v0/deposit', function (req, res) {
        console.log("test %j",req.body);
        self.deposittest(req.body, res);
    });

    app.get('/bri/testquery', function(req, res) {
        console.log("req %j", req.body);
        self.getUserDataPayment(req.body, res);
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
        self.infoSaldoTBank(req.body, res);
    });

    app.post('/bri/tbank/token', function(req, res) {
        console.log("request parames : %j", req.body);
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

sonoda.prototype.deposittest = function(query, res) {
    //call function here to facade
    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");
    var listdebtjson = require("./deposit.json");

    res.json(listdebtjson);

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
                /*{
                  "ResponseCode": "00",
                  "ResponseDescription": "Sukses",
                  "KodeMerchant": "80077",
                  "Password": "password",
                  "PinNasabah": null,
                  "Saldo": null,
                  "Token": null,
                  "Nama": "ARM Teadm"
                }*/
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

sonoda.prototype.getUserDataPayment = function(params, res) {

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

            sonodaFacade.getUserDataPayment(params);
        }
    ], function(err, result) {
        var user = result[0];
        return user;
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
                /*{
                  "ResponseCode": "00",
                  "ResponseDescription": "Sukses",
                  "KodeMerchant": null,
                  "Password": null,
                  "PinNasabah": "900870",
                  "Saldo": null,
                  "Token": null,
                  "Nama": "Rico"
                }*/
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
                /*{
                  "ResponseCode": "00",
                  "ResponseDescription": "Sukses",
                  "KodeMerchant": null,
                  "Password": null,
                  "PinNasabah": null,
                  "Saldo": "2000000.00",
                  "Token": null,
                  "Nama": null
                }*/
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
    var self = this;

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                
                return callback(null, response);
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.getUserDataPayment(params);
        }
    ], function(err, result) {
        console.log("masuk 1", result);
        if (err) {
            // console.log(err);
            return;
        }
        var user = result[0];

        var newParams = {
            nohandphone : user.user_phone,
            pin : user.user_pin
        }

        asyncTask.waterfall([
            function(callback) {
                sonodaFacade.on("successSecond", function(response) {
                    return callback(null, response);
                    /*{
                      "ResponseCode": "00",
                      "ResponseDescription": "Sukses",
                      "KodeMerchant": null,
                      "Password": null,
                      "PinNasabah": null,
                      "Saldo": null,
                      "Token": "786788",
                      "Nama": null
                    }*/
                });

                sonodaFacade.on("errorSecond", function(err) {
                    return callback(err, null);
                });

                sonodaFacade.requestTokenTBank(newParams);
            }
        ], function(err, result) {
            if (err) {
                return res.status(500).json(err);
            }
            var newResponse = {
                "token" : result.Token
            }
            console.log("token " + result.Token);
            self.responseGeneration(res, err, newResponse);
            return;
        });        
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
                /*{
                  "ResponseCode": "00",
                  "ResponseDescription": "Sukses",
                  "KodeMerchant": null,
                  "Password": null,
                  "PinNasabah": null,
                  "Saldo": null,
                  "Token": null,
                  "Nama": null
                }*/
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

                /*{
                  "ResponseCode": "00",
                  "ResponseDescription": "Sukses",
                  "KodeMerchant": null,
                  "Password": null,
                  "PinNasabah": null,
                  "Saldo": "20000.00",
                  "Token": null,
                  "Nama": null
                }*/
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
                /*{
                  "ResponseCode": "00",
                  "ResponseDescription": "Sukses",
                  "KodeMerchant": null,
                  "Password": null,
                  "PinNasabah": null,
                  "Saldo": "1999000.00",
                  "Token": null,
                  "Nama": null
                }*/
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

sonoda.prototype.gantiPINTBank = function(params) {
    var asyncTask = require('async');
    var sonodaFacade = require("./sonoda-facade.js");

    asyncTask.waterfall([
        function(callback) {
            sonodaFacade.on("success", function(response) {
                return callback(null, response);
                /*{
                  "ResponseCode": "00",
                  "ResponseDescription": "Sukses",
                  "KodeMerchant": null,
                  "Password": null,
                  "PinNasabah": null,
                  "Saldo": "1999000.00",
                  "Token": null,
                  "Nama": null
                }*/
            });

            sonodaFacade.on("error", function(err) {
                return callback(err, null);
            });

            sonodaFacade.gantiPINTBank(params);
        }
    ], function(err, result) {
        self.responseGeneration(res, err, result);
        return;
    });

    return;
}


module.exports = new sonoda();
